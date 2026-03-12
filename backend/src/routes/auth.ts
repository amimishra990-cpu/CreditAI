import { Router, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { User } from "../models/User.js";
import { generateToken, authenticate, AuthRequest } from "../middleware/auth.js";
import { auditLog } from "../middleware/audit.js";
import { authLimiter } from "../middleware/security.js";

const router = Router();

// Register new user with organization
router.post(
    "/register",
    authLimiter,
    [
        body("email").isEmail().normalizeEmail(),
        body("password").isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/),
        body("name").trim().isLength({ min: 2 }),
        body("phone").optional().trim(),
    ],
    auditLog("register", "user"),
    async (req: Request, res: Response) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }

            const { email, password, name, phone } = req.body;

            // Check if user already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                res.status(409).json({ error: "User already exists with this email" });
                return;
            }

            // Create new user (without organization initially)
            const user = await User.create({
                email,
                password,
                name,
                phone,
                organizations: [],
                emailVerified: false,
            });

            const token = generateToken(user._id.toString(), user.email, "viewer", "");

            res.status(201).json({
                success: true,
                message: "Account created successfully. Please complete onboarding.",
                token,
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name,
                    phone: user.phone,
                    organizations: [],
                },
                requiresOnboarding: true,
            });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
);

// Login
router.post(
    "/login",
    authLimiter,
    [
        body("email").isEmail().normalizeEmail(),
        body("password").notEmpty(),
    ],
    auditLog("login", "user"),
    async (req: Request, res: Response) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }

            const { email, password } = req.body;

            // Find user
            const user = await User.findOne({ email });
            if (!user) {
                res.status(401).json({ error: "Invalid credentials" });
                return;
            }

            // Check if account is locked
            if (user.isLocked()) {
                res.status(423).json({
                    error: "Account locked due to multiple failed login attempts. Please try again later.",
                    lockUntil: user.lockUntil,
                });
                return;
            }

            // Check if user is active
            if (!user.isActive) {
                res.status(403).json({ error: "Account is inactive" });
                return;
            }

            // Verify password
            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                await user.incLoginAttempts();
                res.status(401).json({ error: "Invalid credentials" });
                return;
            }

            // Reset login attempts on successful login
            await user.resetLoginAttempts();

            // Get user's current organization context
            const currentOrgId = user.currentOrganizationId || user.organizations[0]?.organizationId;
            const currentOrgRole = user.organizations.find(
                (o) => o.organizationId === currentOrgId
            )?.role || "viewer";

            const token = generateToken(user._id.toString(), user.email, currentOrgRole, currentOrgId || "");

            res.json({
                success: true,
                message: "Login successful",
                token,
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name,
                    phone: user.phone,
                    organizations: user.organizations,
                    currentOrganizationId: currentOrgId,
                },
                requiresOnboarding: user.organizations.length === 0,
            });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
);

// Get current user profile
router.get(
    "/me",
    authenticate,
    auditLog("view_profile", "user"),
    async (req: AuthRequest, res: Response) => {
        try {
            const user = await User.findById(req.user?.id).select("-password");
            if (!user) {
                res.status(404).json({ error: "User not found" });
                return;
            }

            res.json({
                success: true,
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name,
                    phone: user.phone,
                    avatar: user.avatar,
                    organizations: user.organizations,
                    currentOrganizationId: user.currentOrganizationId,
                    isActive: user.isActive,
                    emailVerified: user.emailVerified,
                    lastLogin: user.lastLogin,
                    createdAt: user.createdAt,
                },
            });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
);

// Change password
router.post(
    "/change-password",
    authenticate,
    [
        body("currentPassword").notEmpty(),
        body("newPassword").isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/),
    ],
    auditLog("change_password", "user"),
    async (req: AuthRequest, res: Response) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }

            const { currentPassword, newPassword } = req.body;

            const user = await User.findById(req.user?.id);
            if (!user) {
                res.status(404).json({ error: "User not found" });
                return;
            }

            // Verify current password
            const isMatch = await user.comparePassword(currentPassword);
            if (!isMatch) {
                res.status(401).json({ error: "Current password is incorrect" });
                return;
            }

            // Update password
            user.password = newPassword;
            await user.save();

            res.json({
                success: true,
                message: "Password changed successfully",
            });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
);

// Logout (client-side token removal, but log the action)
router.post(
    "/logout",
    authenticate,
    auditLog("logout", "user"),
    async (req: AuthRequest, res: Response) => {
        res.json({
            success: true,
            message: "Logged out successfully",
        });
    }
);

export default router;

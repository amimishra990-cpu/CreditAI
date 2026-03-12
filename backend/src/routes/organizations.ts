import { Router, Response } from "express";
import { body, validationResult } from "express-validator";
import { v4 as uuidv4 } from "uuid";
import { Organization } from "../models/Organization.js";
import { User } from "../models/User.js";
import { Workspace } from "../models/Workspace.js";
import { authenticate, AuthRequest } from "../middleware/auth.js";
import { auditLog } from "../middleware/audit.js";

const router = Router();

// Create new organization (onboarding)
router.post(
    "/",
    authenticate,
    [
        body("name").trim().isLength({ min: 2 }),
        body("industry").optional().trim(),
        body("size").optional().isIn(["1-10", "11-50", "51-200", "201-500", "500+"]),
        body("website").optional().trim().isURL(),
    ],
    auditLog("create_organization", "organization"),
    async (req: AuthRequest, res: Response) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }

            const { name, description, industry, size, website } = req.body;
            const userId = req.user!.id;

            // Check if organization name already exists
            const slug = name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-|-$/g, "");

            const existingOrg = await Organization.findOne({ slug });
            if (existingOrg) {
                res.status(409).json({ error: "Organization name already taken" });
                return;
            }

            // Create organization
            const organization = await Organization.create({
                name,
                slug,
                description,
                industry,
                size,
                website,
                ownerId: userId,
                members: [
                    {
                        userId,
                        role: "owner",
                        joinedAt: new Date(),
                    },
                ],
            });

            // Update user with organization
            await User.findByIdAndUpdate(userId, {
                $push: {
                    organizations: {
                        organizationId: organization._id.toString(),
                        role: "owner",
                        joinedAt: new Date(),
                    },
                },
                currentOrganizationId: organization._id.toString(),
            });

            res.status(201).json({
                success: true,
                message: "Organization created successfully",
                organization: {
                    id: organization._id,
                    name: organization.name,
                    slug: organization.slug,
                    description: organization.description,
                    industry: organization.industry,
                    size: organization.size,
                    website: organization.website,
                    role: "owner",
                },
            });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
);

// Get user's organizations
router.get(
    "/",
    authenticate,
    auditLog("list_organizations", "organization"),
    async (req: AuthRequest, res: Response) => {
        try {
            const user = await User.findById(req.user!.id);
            if (!user) {
                res.status(404).json({ error: "User not found" });
                return;
            }

            const orgIds = user.organizations.map((o) => o.organizationId);
            const organizations = await Organization.find({
                _id: { $in: orgIds },
                isActive: true,
            });

            const orgsWithRole = organizations.map((org) => {
                const userOrg = user.organizations.find(
                    (o) => o.organizationId === org._id.toString()
                );
                return {
                    id: org._id,
                    name: org.name,
                    slug: org.slug,
                    description: org.description,
                    industry: org.industry,
                    size: org.size,
                    website: org.website,
                    logo: org.logo,
                    role: userOrg?.role || "viewer",
                    memberCount: org.members.length,
                    createdAt: org.createdAt,
                };
            });

            res.json({
                success: true,
                organizations: orgsWithRole,
            });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
);

// Get organization details
router.get(
    "/:id",
    authenticate,
    auditLog("view_organization", "organization"),
    async (req: AuthRequest, res: Response) => {
        try {
            const organization = await Organization.findById(req.params.id);
            if (!organization) {
                res.status(404).json({ error: "Organization not found" });
                return;
            }

            // Check if user is member
            const user = await User.findById(req.user!.id);
            const userOrg = user?.organizations.find(
                (o) => o.organizationId === req.params.id
            );

            if (!userOrg) {
                res.status(403).json({ error: "Access denied" });
                return;
            }

            res.json({
                success: true,
                organization: {
                    id: organization._id,
                    name: organization.name,
                    slug: organization.slug,
                    description: organization.description,
                    industry: organization.industry,
                    size: organization.size,
                    website: organization.website,
                    logo: organization.logo,
                    role: userOrg.role,
                    memberCount: organization.members.length,
                    settings: organization.settings,
                    createdAt: organization.createdAt,
                },
            });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
);

// Switch active organization
router.post(
    "/:id/switch",
    authenticate,
    auditLog("switch_organization", "organization"),
    async (req: AuthRequest, res: Response) => {
        try {
            const user = await User.findById(req.user!.id);
            if (!user) {
                res.status(404).json({ error: "User not found" });
                return;
            }

            const userOrg = user.organizations.find(
                (o) => o.organizationId === req.params.id
            );

            if (!userOrg) {
                res.status(403).json({ error: "You are not a member of this organization" });
                return;
            }

            user.currentOrganizationId = req.params.id;
            await user.save();

            res.json({
                success: true,
                message: "Organization switched successfully",
                currentOrganizationId: req.params.id,
            });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
);

// Create workspace within organization
router.post(
    "/:id/workspaces",
    authenticate,
    [
        body("name").trim().isLength({ min: 2 }),
        body("company.name").trim().isLength({ min: 2 }),
        body("company.cin").trim().notEmpty(),
        body("company.pan").trim().notEmpty(),
        body("company.sector").trim().notEmpty(),
        body("loan.amount").trim().notEmpty(),
    ],
    auditLog("create_workspace", "workspace"),
    async (req: AuthRequest, res: Response) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }

            const organizationId = req.params.id;
            const userId = req.user!.id;

            // Verify user is member of organization
            const user = await User.findById(userId);
            const userOrg = user?.organizations.find(
                (o) => o.organizationId === organizationId
            );

            if (!userOrg) {
                res.status(403).json({ error: "Access denied" });
                return;
            }

            const { name, company, loan } = req.body;
            const workspaceId = uuidv4();

            // Create workspace
            const workspace = await Workspace.create({
                id: workspaceId,
                organizationId,
                createdBy: userId,
                name,
                company: {
                    name: company.name,
                    cin: company.cin,
                    pan: company.pan,
                    sector: company.sector,
                    annualTurnover: company.annualTurnover || "",
                },
                loan: {
                    type: loan.type || "Working Capital",
                    amount: loan.amount,
                    tenure: loan.tenure || "",
                    interestRate: loan.interestRate || "",
                },
                status: "draft",
            });

            res.status(201).json({
                success: true,
                message: "Workspace created successfully",
                workspace: {
                    id: workspace.id,
                    name: workspace.name,
                    company: workspace.company,
                    loan: workspace.loan,
                    status: workspace.status,
                    createdAt: workspace.createdAt,
                },
            });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
);

// Get organization workspaces
router.get(
    "/:id/workspaces",
    authenticate,
    auditLog("list_workspaces", "workspace"),
    async (req: AuthRequest, res: Response) => {
        try {
            const organizationId = req.params.id;
            const userId = req.user!.id;

            // Verify user is member
            const user = await User.findById(userId);
            const userOrg = user?.organizations.find(
                (o) => o.organizationId === organizationId
            );

            if (!userOrg) {
                res.status(403).json({ error: "Access denied" });
                return;
            }

            const workspaces = await Workspace.find({
                organizationId,
                isArchived: false,
            }).sort({ createdAt: -1 });

            res.json({
                success: true,
                workspaces: workspaces.map((w) => ({
                    id: w.id,
                    name: w.name,
                    company: w.company,
                    loan: w.loan,
                    status: w.status,
                    createdAt: w.createdAt,
                })),
            });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
);

export default router;

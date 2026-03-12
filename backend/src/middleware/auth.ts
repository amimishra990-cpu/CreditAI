import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "8h";

export interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
        role: string;
        organization: string;
    };
}

// Generate JWT token
export const generateToken = (userId: string, email: string, role: string, organization: string): string => {
    return jwt.sign(
        { id: userId, email, role, organization },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions
    );
};

// Verify JWT token
export const verifyToken = (token: string): any => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
};

// Authentication middleware
export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.replace("Bearer ", "");

        if (!token) {
            res.status(401).json({ error: "Authentication required" });
            return;
        }

        const decoded = verifyToken(token);
        if (!decoded) {
            res.status(401).json({ error: "Invalid or expired token" });
            return;
        }

        // Verify user still exists and is active
        const user = await User.findById(decoded.id);
        if (!user || !user.isActive) {
            res.status(401).json({ error: "User not found or inactive" });
            return;
        }

        req.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role,
            organization: decoded.organization,
        };

        next();
    } catch (error: any) {
        res.status(401).json({ error: "Authentication failed" });
    }
};

// Authorization middleware - check roles
export const authorize = (...roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            res.status(401).json({ error: "Authentication required" });
            return;
        }

        if (!roles.includes(req.user.role)) {
            res.status(403).json({ error: "Insufficient permissions" });
            return;
        }

        next();
    };
};

// Check workspace ownership or access
export const checkWorkspaceAccess = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const workspaceId = req.params.id || req.body.workspaceId;

        if (!workspaceId) {
            res.status(400).json({ error: "Workspace ID required" });
            return;
        }

        // Admin can access all workspaces
        if (req.user?.role === "admin") {
            next();
            return;
        }

        // Check if workspace belongs to user's organization
        const { Workspace } = await import("../models/Workspace.js");
        const workspace = await Workspace.findOne({ id: workspaceId });

        if (!workspace) {
            res.status(404).json({ error: "Workspace not found" });
            return;
        }

        // Add organization check when workspace model is updated
        // For now, allow access
        next();
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

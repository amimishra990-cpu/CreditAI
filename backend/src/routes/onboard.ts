import { Router, Response } from "express";
import { Workspace } from "../models/Workspace.js";
import { User } from "../models/User.js";
import { authenticate, AuthRequest } from "../middleware/auth.js";
import { auditLog } from "../middleware/audit.js";

const router = Router();

// Get user's workspaces across all organizations
router.get("/my-workspaces", authenticate, auditLog("view_my_workspaces", "workspace"), async (req: AuthRequest, res: Response) => {
    try {
        const user = await User.findById(req.user!.id);
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        const orgIds = user.organizations.map((o) => o.organizationId);
        const workspaces = await Workspace.find({
            organizationId: { $in: orgIds },
            isArchived: false,
        }).sort({ createdAt: -1 });

        res.json({
            success: true,
            workspaces: workspaces.map((w) => ({
                id: w.id,
                name: w.name,
                organizationId: w.organizationId,
                company: w.company,
                loan: w.loan,
                status: w.status,
                createdAt: w.createdAt,
            })),
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Get workspace by ID (requires authentication and membership)
router.get("/workspace/:id", authenticate, auditLog("view_workspace", "workspace"), async (req: AuthRequest, res: Response) => {
    try {
        const workspace = await Workspace.findOne({ id: req.params.id });
        if (!workspace) {
            res.status(404).json({ error: "Workspace not found" });
            return;
        }

        // Check if user has access to this workspace's organization
        const user = await User.findById(req.user!.id);
        const hasAccess = user?.organizations.some(
            (o) => o.organizationId === workspace.organizationId
        );

        if (!hasAccess) {
            res.status(403).json({ error: "Access denied" });
            return;
        }

        res.json(workspace);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Update workspace
router.put("/workspace/:id", authenticate, auditLog("update_workspace", "workspace"), async (req: AuthRequest, res: Response) => {
    try {
        const workspace = await Workspace.findOne({ id: req.params.id });
        if (!workspace) {
            res.status(404).json({ error: "Workspace not found" });
            return;
        }

        // Check if user has access
        const user = await User.findById(req.user!.id);
        const userOrg = user?.organizations.find(
            (o) => o.organizationId === workspace.organizationId
        );

        if (!userOrg) {
            res.status(403).json({ error: "Access denied" });
            return;
        }

        // Update allowed fields
        const allowedUpdates = [
            "name", "status", "documents", "classifications",
            "extractedData", "agentResults", "orchestratorResult",
            "earlyWarningAlerts", "report"
        ];

        Object.keys(req.body).forEach((key) => {
            if (allowedUpdates.includes(key)) {
                (workspace as any)[key] = req.body[key];
            }
        });

        await workspace.save();

        res.json({
            success: true,
            message: "Workspace updated successfully",
            workspace,
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Delete workspace (admin/owner only)
router.delete("/workspace/:id", authenticate, auditLog("delete_workspace", "workspace"), async (req: AuthRequest, res: Response) => {
    try {
        const workspace = await Workspace.findOne({ id: req.params.id });
        if (!workspace) {
            res.status(404).json({ error: "Workspace not found" });
            return;
        }

        // Check if user is admin/owner
        const user = await User.findById(req.user!.id);
        const userOrg = user?.organizations.find(
            (o) => o.organizationId === workspace.organizationId
        );

        if (!userOrg || !["owner", "admin"].includes(userOrg.role)) {
            res.status(403).json({ error: "Admin access required" });
            return;
        }

        await Workspace.deleteOne({ id: req.params.id });
        res.json({ success: true, message: "Workspace deleted successfully" });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;

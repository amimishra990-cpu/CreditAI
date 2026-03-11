import { Router, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { Workspace } from "../models/Workspace.js";

const router = Router();

// Create workspace
router.post("/onboard", async (req: Request, res: Response) => {
    try {
        const {
            cin, pan, sector, annualTurnover,
            loanType, loanAmount, loanTenure, interestRate,
            companyName
        } = req.body;

        if (!cin || !pan || !sector || !loanAmount) {
            res.status(400).json({ error: "Missing required fields: cin, pan, sector, loanAmount" });
            return;
        }

        const workspaceId = uuidv4();

        const workspace = await Workspace.create({
            id: workspaceId,
            company: {
                name: companyName || "Unknown Company",
                cin, pan, sector, annualTurnover,
            },
            loan: {
                type: loanType || "Working Capital",
                amount: loanAmount,
                tenure: loanTenure,
                interestRate,
            },
        });

        res.json({
            success: true,
            workspaceId,
            message: `Workspace created for ${companyName || cin}`,
            workspace,
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Get workspace by ID
router.get("/workspace/:id", async (req: Request, res: Response) => {
    try {
        const workspace = await Workspace.findOne({ id: req.params.id });
        if (!workspace) {
            res.status(404).json({ error: "Workspace not found" });
            return;
        }
        res.json(workspace);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// List all workspaces
router.get("/workspaces", async (_req: Request, res: Response) => {
    try {
        const workspaces = await Workspace.find({}, {
            id: 1, company: 1, loan: 1, createdAt: 1
        }).sort({ createdAt: -1 });

        const list = workspaces.map((w) => ({
            id: w.id,
            companyName: w.company?.name,
            cin: w.company?.cin,
            sector: w.company?.sector,
            loanAmount: w.loan?.amount,
            loanType: w.loan?.type,
            createdAt: w.createdAt,
        }));
        res.json(list);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Delete workspace
router.delete("/workspace/:id", async (req: Request, res: Response) => {
    try {
        await Workspace.deleteOne({ id: req.params.id });
        res.json({ success: true });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;

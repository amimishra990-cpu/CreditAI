import { Router, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

const router = Router();

// In-memory workspace store
export const workspaces: Record<string, any> = {};

router.post("/onboard", (req: Request, res: Response) => {
    try {
        const {
            cin, pan, sector, annualTurnover,
            loanType, loanAmount, loanTenure, interestRate,
            companyName
        } = req.body;

        // Validation
        if (!cin || !pan || !sector || !loanAmount) {
            res.status(400).json({ error: "Missing required fields: cin, pan, sector, loanAmount" });
            return;
        }

        const workspaceId = uuidv4();

        workspaces[workspaceId] = {
            id: workspaceId,
            createdAt: new Date().toISOString(),
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
            documents: [],
            classifications: [],
            extractedData: null,
            agentResults: null,
            orchestratorResult: null,
            earlyWarningAlerts: [],
            report: null,
        };

        res.json({
            success: true,
            workspaceId,
            message: `Workspace created for ${companyName || cin}`,
            workspace: workspaces[workspaceId],
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Get workspace
router.get("/workspace/:id", (req: Request, res: Response) => {
    const workspace = workspaces[req.params.id];
    if (!workspace) {
        res.status(404).json({ error: "Workspace not found" });
        return;
    }
    res.json(workspace);
});

// List workspaces
router.get("/workspaces", (_req: Request, res: Response) => {
    const list = Object.values(workspaces).map((w: any) => ({
        id: w.id,
        companyName: w.company.name,
        cin: w.company.cin,
        loanAmount: w.loan.amount,
        createdAt: w.createdAt,
    }));
    res.json(list);
});

export default router;

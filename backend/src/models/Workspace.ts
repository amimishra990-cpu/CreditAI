import mongoose, { Schema, Document } from "mongoose";

export interface IWorkspace extends Document {
    id: string;
    createdAt: string;
    updatedAt: string;
    company: {
        name: string;
        cin: string;
        pan: string;
        sector: string;
        annualTurnover: string;
    };
    loan: {
        type: string;
        amount: string;
        tenure: string;
        interestRate: string;
    };
    documents: any[];
    classifications: any[];
    extractedData: any;
    agentResults: any;
    orchestratorResult: any;
    earlyWarningAlerts: any[];
    report: any;
}

const WorkspaceSchema = new Schema<IWorkspace>(
    {
        id: { type: String, required: true, unique: true, index: true },
        company: {
            name: { type: String, default: "Unknown Company" },
            cin: { type: String, required: true },
            pan: { type: String, required: true },
            sector: { type: String, required: true },
            annualTurnover: { type: String },
        },
        loan: {
            type: { type: String, default: "Working Capital" },
            amount: { type: String, required: true },
            tenure: { type: String },
            interestRate: { type: String },
        },
        documents: { type: [], default: [] },
        classifications: { type: [], default: [] },
        extractedData: { type: Schema.Types.Mixed, default: null },
        agentResults: { type: Schema.Types.Mixed, default: null },
        orchestratorResult: { type: Schema.Types.Mixed, default: null },
        earlyWarningAlerts: { type: [], default: [] },
        report: { type: Schema.Types.Mixed, default: null },
    },
    { timestamps: true }
);

export const Workspace = mongoose.models.Workspace || mongoose.model<IWorkspace>("Workspace", WorkspaceSchema);

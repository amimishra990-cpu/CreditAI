import mongoose, { Schema, Document } from "mongoose";

export interface IWorkspace extends Document {
    id: string;
    organizationId: string; // Organization this workspace belongs to
    createdBy: string; // User who created it
    name: string; // Workspace name/identifier
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
    status: "draft" | "in_progress" | "completed" | "archived";
    isArchived: boolean;
}

const WorkspaceSchema = new Schema<IWorkspace>(
    {
        id: { type: String, required: true, unique: true, index: true },
        organizationId: { type: String, required: true, index: true },
        createdBy: { type: String, required: true, index: true },
        name: { type: String, required: true },
        status: {
            type: String,
            enum: ["draft", "in_progress", "completed", "archived"],
            default: "draft",
        },
        isArchived: { type: Boolean, default: false },
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

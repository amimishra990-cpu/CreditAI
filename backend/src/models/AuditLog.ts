import mongoose, { Schema, Document } from "mongoose";

export interface IAuditLog extends Document {
    userId?: string;
    userEmail?: string;
    action: string;
    resource: string;
    resourceId?: string;
    method: string;
    endpoint: string;
    ipAddress: string;
    userAgent: string;
    status: "success" | "failure";
    errorMessage?: string;
    metadata?: Record<string, any>;
    timestamp: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
    {
        userId: {
            type: String,
            index: true,
        },
        userEmail: String,
        action: {
            type: String,
            required: true,
            index: true,
        },
        resource: {
            type: String,
            required: true,
            index: true,
        },
        resourceId: String,
        method: {
            type: String,
            required: true,
        },
        endpoint: {
            type: String,
            required: true,
        },
        ipAddress: {
            type: String,
            required: true,
        },
        userAgent: String,
        status: {
            type: String,
            enum: ["success", "failure"],
            required: true,
            index: true,
        },
        errorMessage: String,
        metadata: Schema.Types.Mixed,
        timestamp: {
            type: Date,
            default: Date.now,
            index: true,
        },
    },
    {
        timestamps: false,
    }
);

// Index for querying logs
AuditLogSchema.index({ timestamp: -1, userId: 1 });
AuditLogSchema.index({ resource: 1, action: 1, timestamp: -1 });

export const AuditLog = mongoose.model<IAuditLog>("AuditLog", AuditLogSchema);

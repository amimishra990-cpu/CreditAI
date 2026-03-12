import { Request, Response, NextFunction } from "express";
import { AuditLog } from "../models/AuditLog.js";
import { AuthRequest } from "./auth.js";

// Audit logging middleware
export const auditLog = (action: string, resource: string) => {
    return async (req: AuthRequest, res: Response, next: NextFunction) => {
        const originalJson = res.json.bind(res);
        let responseStatus: "success" | "failure" = "success";
        let errorMessage: string | undefined;

        // Override res.json to capture response
        res.json = function (body: any) {
            if (res.statusCode >= 400) {
                responseStatus = "failure";
                errorMessage = body.error || body.message || "Unknown error";
            }

            // Log after response
            setImmediate(async () => {
                try {
                    await AuditLog.create({
                        userId: req.user?.id,
                        userEmail: req.user?.email,
                        action,
                        resource,
                        resourceId: req.params.id || req.body.workspaceId || req.body.id,
                        method: req.method,
                        endpoint: req.originalUrl,
                        ipAddress: req.ip || req.socket.remoteAddress || "unknown",
                        userAgent: req.headers["user-agent"] || "unknown",
                        status: responseStatus,
                        errorMessage,
                        metadata: {
                            body: sanitizeBody(req.body),
                            query: req.query,
                        },
                    });
                } catch (error) {
                    console.error("Audit log error:", error);
                }
            });

            return originalJson(body);
        };

        next();
    };
};

// Sanitize sensitive data from logs
function sanitizeBody(body: any): any {
    if (!body || typeof body !== "object") return body;

    const sanitized = { ...body };
    const sensitiveFields = ["password", "token", "apiKey", "secret", "creditCard", "ssn"];

    for (const field of sensitiveFields) {
        if (field in sanitized) {
            sanitized[field] = "[REDACTED]";
        }
    }

    return sanitized;
}

import mongoose, { Schema, Document } from "mongoose";

export interface IOrganization extends Document {
    name: string;
    slug: string;
    description?: string;
    industry?: string;
    size?: string;
    website?: string;
    logo?: string;
    ownerId: string; // User who created the org
    members: Array<{
        userId: string;
        role: "owner" | "admin" | "analyst" | "viewer";
        joinedAt: Date;
    }>;
    settings: {
        allowMemberInvites: boolean;
        requireApproval: boolean;
    };
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const OrganizationSchema = new Schema<IOrganization>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        description: {
            type: String,
            trim: true,
        },
        industry: {
            type: String,
            trim: true,
        },
        size: {
            type: String,
            enum: ["1-10", "11-50", "51-200", "201-500", "500+"],
        },
        website: {
            type: String,
            trim: true,
        },
        logo: {
            type: String,
        },
        ownerId: {
            type: String,
            required: true,
            index: true,
        },
        members: [
            {
                userId: {
                    type: String,
                    required: true,
                },
                role: {
                    type: String,
                    enum: ["owner", "admin", "analyst", "viewer"],
                    default: "analyst",
                },
                joinedAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
        settings: {
            allowMemberInvites: {
                type: Boolean,
                default: true,
            },
            requireApproval: {
                type: Boolean,
                default: false,
            },
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

// Create slug from name before saving
OrganizationSchema.pre("save", function () {
    if (this.isModified("name") && !this.slug) {
        this.slug = this.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");
    }
});

export const Organization = mongoose.model<IOrganization>("Organization", OrganizationSchema);

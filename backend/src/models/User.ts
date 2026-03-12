import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
    email: string;
    password: string;
    name: string;
    phone?: string;
    avatar?: string;
    organizations: Array<{
        organizationId: string;
        role: "owner" | "admin" | "analyst" | "viewer";
        joinedAt: Date;
    }>;
    currentOrganizationId?: string; // Active organization context
    isActive: boolean;
    emailVerified: boolean;
    lastLogin?: Date;
    failedLoginAttempts: number;
    lockUntil?: Date;
    twoFactorSecret?: string;
    twoFactorEnabled: boolean;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
    isLocked(): boolean;
    incLoginAttempts(): Promise<void>;
    resetLoginAttempts(): Promise<void>;
}

const UserSchema = new Schema<IUser>(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 8,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        phone: {
            type: String,
            trim: true,
        },
        avatar: {
            type: String,
        },
        organizations: [
            {
                organizationId: {
                    type: String,
                    required: true,
                    index: true,
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
        currentOrganizationId: {
            type: String,
            index: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        emailVerified: {
            type: Boolean,
            default: false,
        },
        lastLogin: Date,
        failedLoginAttempts: {
            type: Number,
            default: 0,
        },
        lockUntil: Date,
        twoFactorSecret: String,
        twoFactorEnabled: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Hash password before saving
UserSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        return;
    }

    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

// Check if account is locked
UserSchema.methods.isLocked = function (): boolean {
    return !!(this.lockUntil && this.lockUntil > new Date());
};

// Increment login attempts
UserSchema.methods.incLoginAttempts = async function (): Promise<void> {
    // If lock has expired, reset attempts
    if (this.lockUntil && this.lockUntil < new Date()) {
        this.failedLoginAttempts = 1;
        this.lockUntil = undefined;
        await this.save();
        return;
    }

    this.failedLoginAttempts += 1;

    // Lock account after 5 failed attempts for 2 hours
    if (this.failedLoginAttempts >= 5 && !this.isLocked()) {
        this.lockUntil = new Date(Date.now() + 2 * 60 * 60 * 1000);
    }

    await this.save();
};

// Reset login attempts
UserSchema.methods.resetLoginAttempts = async function (): Promise<void> {
    this.failedLoginAttempts = 0;
    this.lastLogin = new Date();
    this.lockUntil = undefined;
    await this.save();
};

export const User = mongoose.model<IUser>("User", UserSchema);

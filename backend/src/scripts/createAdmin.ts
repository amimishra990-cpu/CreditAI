import { connectDB } from "../db.js";
import { User } from "../models/User.js";
import readline from "readline";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const question = (query: string): Promise<string> => {
    return new Promise((resolve) => {
        rl.question(query, resolve);
    });
};

async function createAdminUser() {
    try {
        await connectDB();
        console.log("\n🔐 Create Admin User\n");

        const email = await question("Email: ");
        const password = await question("Password (min 8 chars, uppercase, lowercase, number, special char): ");
        const name = await question("Full Name: ");
        const organization = await question("Organization: ");

        // Validate password
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/;
        if (password.length < 8 || !passwordRegex.test(password)) {
            console.error("\n❌ Password does not meet requirements");
            process.exit(1);
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.error("\n❌ User with this email already exists");
            process.exit(1);
        }

        // Create admin user
        const user = await User.create({
            email,
            password,
            name,
            organization,
            role: "admin",
            isActive: true,
        });

        console.log("\n✅ Admin user created successfully!");
        console.log(`\nUser ID: ${user._id}`);
        console.log(`Email: ${user.email}`);
        console.log(`Name: ${user.name}`);
        console.log(`Role: ${user.role}`);
        console.log(`Organization: ${user.organization}`);

        process.exit(0);
    } catch (error: any) {
        console.error("\n❌ Error creating admin user:", error.message);
        process.exit(1);
    }
}

createAdminUser();

import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";

const MONGODB_URI = "mongodb+srv://dhanushpthampi_db_user:Ao6Fu2X3EWNqR3gz@cluster0.prtfjd5.mongodb.net/?appName=Cluster0";

async function seedUsers() {
    let client;

    try {
        client = new MongoClient(MONGODB_URI);
        await client.connect();

        const db = client.db("dreamdvpr");

        // Check if users already exist
        const existingUsers = await db.collection("users").countDocuments();

        if (existingUsers > 0) {
            console.log("⚠️  Users already exist in database. Skipping seed.");
            await client.close();
            process.exit(0);
        }

        // Hash passwords
        const adminPassword = await bcrypt.hash("admin123", 10);
        const clientPassword = await bcrypt.hash("client123", 10);

        // Create test users
        const users = [
            {
                name: "Admin User",
                email: "admin@dreamdvpr.com",
                password: adminPassword,
                role: "admin",
                createdAt: new Date(),
            },
            {
                name: "Client User",
                email: "client@dreamdvpr.com",
                password: clientPassword,
                role: "client",
                createdAt: new Date(),
            },
        ];

        const result = await db.collection("users").insertMany(users);

        console.log("✅ Successfully created test users:");
        console.log("\n📧 Admin Login:");
        console.log("   Email: admin@dreamdvpr.com");
        console.log("   Password: admin123");
        console.log("\n📧 Client Login:");
        console.log("   Email: client@dreamdvpr.com");
        console.log("   Password: client123");
        console.log(`\n✨ Inserted ${result.insertedCount} users into database`);

        await client.close();
        process.exit(0);
    } catch (error) {
        console.error("❌ Error seeding database:", error);
        if (client) await client.close();
        process.exit(1);
    }
}

seedUsers();

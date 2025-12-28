import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/authOptions";
import clientPromise from "@/app/lib/db";
import { NextResponse } from "next/server";

// POST - Complete client onboarding
export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'client') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await request.json();
        const { company, industry, phone, website } = data;

        const client = await clientPromise;
        const db = client.db("dreamdvpr");

        // Check if user exists
        const user = await db.collection("users").findOne({ email: session.user.email });
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Update user with onboarding data
        const result = await db.collection("users").updateOne(
            { email: session.user.email },
            {
                $set: {
                    company: company || '',
                    industry: industry || '',
                    phone: phone || '',
                    website: website || '',
                    onboardingCompleted: true,
                    updatedAt: new Date(),
                },
            }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'Onboarding completed successfully'
        });

    } catch (error) {
        console.error('Onboarding error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

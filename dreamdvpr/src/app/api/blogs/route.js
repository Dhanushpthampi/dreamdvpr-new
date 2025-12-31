import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import clientPromise from "@/app/lib/db";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

// GET - Get all blogs (public for homepage, admin can see all)
export async function GET(request) {
    try {
        const session = await getServerSession(authOptions);
        const { searchParams } = new URL(request.url);
        const publishedOnly = searchParams.get('published') !== 'false' || session?.user?.role !== 'admin';

        const client = await clientPromise;
        const db = client.db("dreamdvpr");

        let query = {};
        if (publishedOnly) {
            query.published = true;
        }

        const blogs = await db.collection("blogs")
            .find(query)
            .sort({ createdAt: -1 })
            .toArray();

        const blogsWithIds = blogs.map(blog => ({
            ...blog,
            _id: blog._id.toString(),
        }));

        return NextResponse.json({ blogs: blogsWithIds });

    } catch (error) {
        console.error('Get blogs error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST - Create new blog (admin only)
export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await request.json();
        const { title, content, excerpt, category, imageUrl, published = false } = data;

        if (!title || !content || !category) {
            return NextResponse.json({ error: 'Title, content, and category are required' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db("dreamdvpr");

        const blog = {
            title,
            content,
            excerpt: excerpt || content.substring(0, 200) + '...',
            category,
            imageUrl: imageUrl || '',
            published,
            author: session.user.name || session.user.email,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const result = await db.collection("blogs").insertOne(blog);

        return NextResponse.json({
            success: true,
            blog: {
                ...blog,
                _id: result.insertedId.toString(),
            }
        }, { status: 201 });

    } catch (error) {
        console.error('Create blog error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

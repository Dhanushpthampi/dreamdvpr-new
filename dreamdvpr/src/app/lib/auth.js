import { getServerSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import clientPromise from "./db";
import bcrypt from "bcryptjs";

export const authOptions = {
    session: {
        strategy: "jwt",
    },
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: {},
                password: {},
            },
            async authorize(credentials) {
                const client = await clientPromise;
                const db = client.db("dreamdvpr");

                const user = await db.collection("users").findOne({
                    email: credentials.email,
                });

                if (!user) throw new Error("User not found");

                const isValid = await bcrypt.compare(
                    credentials.password,
                    user.password
                );

                if (!isValid) throw new Error("Invalid password");

                return {
                    id: user._id.toString(),
                    email: user.email,
                    name: user.name,
                    role: user.role, // 👈 admin | client
                };
            },
        }),
    ],
    callbacks: {
        jwt({ token, user }) {
            if (user) {
                token.role = user.role;
                token.name = user.name;
            }
            return token;
        },
        session({ session, token }) {
            session.user.role = token.role;
            session.user.name = token.name;
            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
};

export const getAuthSession = () => getServerSession(authOptions);

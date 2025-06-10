import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import { sendEmail } from "./mailer.server";
import { schema } from "~/db/schema";
import { ActionFunctionArgs, redirect } from "@remix-run/node";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: schema
    }),
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true
    },
    emailVerification: {
        sendOnSignUp: true,
        sendVerificationEmail: async ({ user, url, token }, request) => {
            await sendEmail({
                to: user.email,
                subject: 'Verify your email address',
                url: url,
            })
        }
    },
    advanced: {
        cookiePrefix: "stuco",
        cookies: {
            session_token: {
                name: "session_token",
                attributes: {
                }
            },
        }
    }
});

// Custom function to validate user at POST requests
export async function requireSession({ request }: ActionFunctionArgs) {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
        throw redirect("/auth/signin");
    }
    return session;
}
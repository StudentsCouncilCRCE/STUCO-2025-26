import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import { getChangeEmailVerificationMail, getVerificationMail, sendEmail } from "./mailer.server";
import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { authSchema } from "~/db/schema/auth-schema";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "mysql", schema: authSchema
    }),
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true
    },
    emailVerification: {
        sendOnSignUp: true,
        sendVerificationEmail: async ({ user, url, token }) => {
            await sendEmail({
                to: user.email,
                subject: 'Verify your email address',
                html: getVerificationMail(url),
            })
        }
    },
    user: {
        changeEmail: {
            enabled: true,
            sendChangeEmailVerification: async ({ user, newEmail, url, token }) => {
                await sendEmail({
                    to: newEmail,
                    subject: 'Approve email change',
                    html: getChangeEmailVerificationMail(url)
                })
            }
        },
        deleteUser: {
            enabled: true,
            beforeDelete: async (user) => {
                // Perform any cleanup or additional checks here
            },
        },
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
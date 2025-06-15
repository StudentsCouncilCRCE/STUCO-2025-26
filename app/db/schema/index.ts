import { usersTable, sessionsTable, accountsTable, verificationTokensTable } from "./auth-schema";

export const schema = {
    user: usersTable,
    session: sessionsTable,
    account: accountsTable,
    verificationToken: verificationTokensTable,
};
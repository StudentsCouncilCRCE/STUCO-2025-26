// app/routes/app.tsx
import { redirect, LoaderFunctionArgs } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { Navbar } from "~/components/layout/nav-bar";
import { auth } from "~/lib/auth.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) throw redirect("/auth/signin"); // redirect to login if not authenticated

  return null;
};

export default function ProtectedAppLayout() {
  return (
    <div>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}

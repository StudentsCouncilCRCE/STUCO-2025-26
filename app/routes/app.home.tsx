import { LoaderFunctionArgs } from "@remix-run/node";

export function loader({ request }: LoaderFunctionArgs) {
  auth.api;
}

export default function AppHome() {
  return (
    <div>
      <h1>Home Page</h1>
    </div>
  );
}

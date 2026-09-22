import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/admin";
import { HttpError } from "@/lib/http";
import MessagesDashboard from "@/components/admin/MessagesDashboard";
export default async function MessagesPage() {
  let session;
  try {
    session = await requireAdmin();
  } catch (error) {
    if (error instanceof HttpError && [401, 403].includes(error.status))
      redirect("/admin/login");
    return (
      <main id="main" className="admin-login-page container">
        <section className="admin-login-card">
          <span className="eyebrow">ADPOLY CYBERGUARD / ADMIN</span>
          <h1>Messages unavailable</h1>
          <p>
            Admin access is not configured or the service is temporarily
            unavailable. Complete the Supabase setup or try again shortly.
          </p>
          <a href="/admin/login" className="button secondary">
            Return to sign in
          </a>
        </section>
      </main>
    );
  }
  return <MessagesDashboard email={session.user.email || "Team admin"} />;
}

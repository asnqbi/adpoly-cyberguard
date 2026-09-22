import AdminLogin from "@/components/admin/AdminLogin";
import { supabaseConfig } from "@/lib/supabase/config";
export default function LoginPage() {
  return <AdminLogin configured={!!supabaseConfig()} />;
}

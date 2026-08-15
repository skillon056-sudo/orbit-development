import { loginAction } from "../actions";
import Emblem from "@/components/Emblem";

export const metadata = { title: "Admin Login" };

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <div className="grid min-h-screen place-items-center px-5">
      <div className="glass w-full max-w-sm rounded-2xl p-8">
        <div className="mb-6 flex items-center gap-3">
          <Emblem className="h-10 w-10" />
          <div>
            <div className="font-black tracking-[2px]">ORBIT</div>
            <div className="text-[10px] tracking-[4px] text-white/45">ADMIN PANEL</div>
          </div>
        </div>

        {searchParams.error && (
          <p className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            Invalid username or password.
          </p>
        )}

        <form action={loginAction} className="space-y-3">
          <div>
            <label className="mb-1 block text-xs text-white/50">Username</label>
            <input name="username" required autoFocus className="admin-input" />
          </div>
          <div>
            <label className="mb-1 block text-xs text-white/50">Password</label>
            <input name="password" type="password" required className="admin-input" />
          </div>
          <button className="btn btn-primary w-full">Sign In</button>
        </form>
        <p className="mt-4 text-center text-xs text-white/35">
          Protected area. Credentials set via seed / env.
        </p>
      </div>
    </div>
  );
}

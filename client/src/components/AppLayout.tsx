import { Brain, Gamepad2, LayoutDashboard, LogOut, ShieldCheck } from "lucide-react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

export function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link to="/dashboard" className="brand"><Brain size={28} /> MathSprint</Link>
        <nav>
          <NavLink to="/dashboard"><LayoutDashboard size={18} /> Dashboard</NavLink>
          <NavLink to="/multiplayer"><Gamepad2 size={18} /> Live</NavLink>
          {["admin", "teacher"].includes(user?.role ?? "") && <NavLink to="/admin"><ShieldCheck size={18} /> Admin</NavLink>}
          <button
            className="ghost-button"
            onClick={async () => {
              await logout();
              navigate("/login");
            }}
          >
            <LogOut size={18} /> Logout
          </button>
        </nav>
      </header>
      <Outlet />
    </div>
  );
}

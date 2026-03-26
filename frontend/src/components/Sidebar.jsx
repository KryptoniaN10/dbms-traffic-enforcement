import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const { user, logout } = useAuth();

  const getIcon = (name) => {
    switch(name) {
      case 'Dashboard': return <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>;
      case 'Owners': return <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>;
      case 'Vehicles': return <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" /></svg>;
      case 'Add Violation': return <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;
      case 'Payments': return <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>;
      case 'Blacklist': return <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>;
      case 'Reports': return <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
      default: return null;
    }
  };

  const navItems = [
    { name: "Dashboard", path: "/dashboard", roles: ["ADMIN", "OFFICER", "CLERK"] },
    { name: "Owners", path: "/owners", roles: ["ADMIN", "OFFICER"] },
    { name: "Vehicles", path: "/vehicles", roles: ["ADMIN", "OFFICER"] },
    { name: "Add Violation", path: "/violations/new", roles: ["ADMIN", "OFFICER"] },
    { name: "Payments", path: "/payments", roles: ["ADMIN", "CLERK"] },
    { name: "Blacklist", path: "/blacklist", roles: ["ADMIN", "OFFICER"] },
    { name: "Reports", path: "/reports", roles: ["ADMIN"] },
  ];

  return (
    <aside className="w-72 bg-slate-900 text-slate-300 flex flex-col min-h-screen border-r border-slate-800 shadow-xl z-20">
      <div className="p-6 pb-4 flex items-center gap-3">
        <div className="flex gap-1.5 bg-slate-800 p-2 rounded-lg border border-slate-700">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.4)]"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]"></div>
        </div>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">TrafficOps</h1>
        </div>
      </div>
      
      <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => (
          item.roles.includes(user?.role) && (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium ${
                  isActive
                    ? "bg-slate-800 text-white shadow-md border-l-4 border-slate-400"
                    : "hover:bg-slate-800/60 hover:text-slate-100 border-l-4 border-transparent"
                }`
              }
            >
              {getIcon(item.name)}
              {item.name}
            </NavLink>
          )
        ))}
      </nav>

      <div className="p-4 m-4 bg-slate-800/80 rounded-xl shadow-inner border border-slate-700">
        <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold shadow-sm">
              {user?.username ? user.username.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-sm font-semibold text-white truncate">{user?.username || "User"}</p>
              <p className="text-xs text-slate-400 truncate tracking-wide">{user?.role}</p>
            </div>
        </div>
        <button
          onClick={logout}
          className="w-full py-2 text-sm bg-slate-900 hover:bg-slate-700 text-slate-300 hover:text-white font-medium rounded-lg transition-all duration-200 active:scale-95 shadow-sm border border-slate-700"
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
};
export default Sidebar;
import { useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  
  const getPageName = () => {
    const path = location.pathname.split("/")[1];
    if (!path) return "Dashboard";
    return path.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <header className="sticky top-0 z-10 bg-white/70 backdrop-blur-md border-b border-black/5 shadow-sm h-16 flex items-center justify-between px-8 transition-all">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-bold text-slate-800 tracking-tight">
          {getPageName()}
        </h2>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center bg-green-50 px-3 py-1.5 rounded-full border border-green-200 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
            <span className="text-xs font-semibold text-green-700">System Active</span>
        </div>
      </div>
    </header>
  );
};
export default Navbar;
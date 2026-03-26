import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const MainLayout = () => {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden text-slate-800 font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col relative w-full">
        <Navbar />
        <main className="flex-1 overflow-y-auto w-full">
          <div className="max-w-7xl mx-auto px-6 py-8 animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
export default MainLayout;
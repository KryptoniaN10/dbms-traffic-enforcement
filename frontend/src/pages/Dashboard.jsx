import { useState, useEffect } from "react";
import api from "../services/api";

const Dashboard = () => {
  const [stats, setStats] = useState({ total_violations: 0, unpaid_fines: 0, blacklisted_vehicles: 0, suspended_licenses: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/stats');
        setStats(response.data);
      } catch (error) {
        console.error("Failed to load generic stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const CardSkeleton = () => (
    <div className="bg-white/60 p-6 rounded-xl border border-black/5 shadow-sm animate-pulse flex flex-col justify-between h-32">
      <div className="h-4 bg-slate-200 rounded w-1/2 mb-4"></div>
      <div className="h-8 bg-slate-200 rounded w-3/4"></div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : (
          <>
            <div className="bg-white/60 backdrop-blur-lg p-6 rounded-xl shadow-md border border-white/60 hover:shadow-xl hover:scale-[1.01] transition-all duration-200 ease-in-out relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                 <svg className="w-16 h-16 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>
              <p className="text-slate-600 text-sm font-medium mb-1">Total Violations</p>
              <p className="text-3xl font-bold text-slate-900">{stats.total_violations}</p>
            </div>
            
            <div className="bg-white/60 backdrop-blur-lg p-6 rounded-xl shadow-md border border-white/60 hover:shadow-xl hover:scale-[1.01] transition-all duration-200 ease-in-out relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                 <svg className="w-16 h-16 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <p className="text-slate-600 text-sm font-medium mb-1 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-yellow-400"></span> Unpaid Fines
              </p>
              <p className="text-3xl font-bold text-slate-900">${parseFloat(stats.unpaid_fines).toFixed(2)}</p>
            </div>

            <div className="bg-white/60 backdrop-blur-lg p-6 rounded-xl shadow-md border border-white/60 hover:shadow-xl hover:scale-[1.01] transition-all duration-200 ease-in-out relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                 <svg className="w-16 h-16 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
              </div>
              <p className="text-slate-600 text-sm font-medium mb-1 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500"></span> Blacklisted
              </p>
              <p className="text-3xl font-bold text-slate-900">{stats.blacklisted_vehicles}</p>
            </div>
            
            <div className="bg-white/60 backdrop-blur-lg p-6 rounded-xl shadow-md border border-white/60 hover:shadow-xl hover:scale-[1.01] transition-all duration-200 ease-in-out relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                 <svg className="w-16 h-16 text-red-800" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <p className="text-slate-600 text-sm font-medium mb-1 flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-red-700"></span> Suspended Licenses
              </p>
              <p className="text-3xl font-bold text-slate-900">{stats.suspended_licenses}</p>
            </div>
          </>
        )}
      </div>
      
      <div className="bg-white/60 backdrop-blur-lg rounded-xl shadow-md border border-white/60 p-8">
        <div className="flex items-center gap-3 mb-4">
          <svg className="w-6 h-6 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <h2 className="text-lg font-bold text-slate-800">System Monitoring</h2>
        </div>
        <div className="bg-gradient-to-r from-slate-100 to-white rounded-lg border border-slate-200/50 p-6 flex items-center justify-center min-h-[200px]">
           <div className="text-center">
             <div className="w-16 h-16 bg-white rounded-full shadow-md flex items-center justify-center mx-auto mb-4 border border-slate-100">
               <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse shadow-sm shadow-green-500/50"></div>
             </div>
             <h3 className="text-slate-800 font-bold mb-1">Enforcement APIs Active</h3>
             <p className="text-slate-500 text-sm max-w-sm mx-auto">Connecting securely to PostgreSQL triggers processing real-time violations and payments.</p>
           </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
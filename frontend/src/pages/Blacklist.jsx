import { useState, useEffect } from "react";
import api from "../services/api";

const Blacklist = () => {
  const [blacklisted, setBlacklisted] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlacklist = async () => {
      try {
        const response = await api.get('/blacklist');
        setBlacklisted(response.data);
      } catch (err) {
        console.error("Failed to load blacklist", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlacklist();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-red-50/80 backdrop-blur-lg border border-red-100 p-5 rounded-xl shadow-sm text-red-900 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          <h1 className="text-xl font-bold tracking-tight">Blacklisted Vehicles</h1>
        </div>
        <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-lg shadow-sm">{blacklisted.length} MATCHES</span>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        {loading ?(
          <div className="p-12 flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-bold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">License Plate</th>
                  <th className="px-6 py-4">Trigger Reason</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Added By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {blacklisted.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-red-50 text-red-700 border border-red-100 font-bold text-sm">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        V-{item.vehicle_id}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-700">{item.reason}</td>
                    <td className="px-6 py-4 text-sm text-slate-500 font-medium">
                      {new Date(item.blacklisted_date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-md font-mono border border-slate-200">
                        SYSTEM
                      </span>
                    </td>
                  </tr>
                ))}
                {blacklisted.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-400">
                        <svg className="w-12 h-12 mb-3 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span className="font-medium text-slate-500">No active blacklists found.</span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
export default Blacklist;
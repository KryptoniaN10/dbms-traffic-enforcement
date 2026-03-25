import { useState, useEffect } from "react";

const Blacklist = () => {
  const [blacklisted, setBlacklisted] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setBlacklisted([
        { vehicle_id: "SDF-4492", reason: "Multiple unpaid fines > $500", date_added: "2023-11-10", added_by: "OFFICER_99" },
        { vehicle_id: "JKL-0012", reason: "Suspended license involvement", date_added: "2023-11-12", added_by: "SYSTEM_TRIGGER" }
      ]);
      setLoading(false);
    }, 600);
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

      <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-md border border-slate-200 overflow-hidden">
        {loading ?(
          <div className="p-8 text-center text-slate-500 font-medium">Loading details...</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-slate-100/50 text-slate-600 text-xs uppercase tracking-wider font-bold border-b border-slate-200">
              <tr><th className="px-6 py-4">License Plate</th><th className="px-6 py-4">Trigger Reason</th><th className="px-6 py-4">Date</th><th className="px-6 py-4">Added By</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {blacklisted.map((item, idx) => (
                <tr key={idx} className="hover:bg-red-50/30 transition-colors">
                  <td className="px-6 py-4 font-black text-red-600">{item.vehicle_id}</td>
                  <td className="px-6 py-4 font-medium text-slate-800">{item.reason}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{item.date_added}</td>
                  <td className="px-6 py-4 text-xs font-bold text-slate-400 font-mono">{item.added_by}</td>
                </tr>
              ))}
              {blacklisted.length === 0 && (
                <tr><td colSpan="4" className="px-6 py-10 text-center font-medium text-slate-500">No active blacklists.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
export default Blacklist;
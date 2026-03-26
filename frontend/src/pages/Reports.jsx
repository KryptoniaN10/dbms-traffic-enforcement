import { useState, useEffect } from "react";

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
        setReports([
            {
                id: 1,
                date: "2023-11-20",
                type: "Monthly Summary",
                generated_by: "System",
                status: "READY"
            },
            {
                id: 2,
                date: "2023-11-25",
                type: "High-Risk Vehicles",
                generated_by: "Officer Smith",
                status: "PROCESSING"
            }
        ]);
        setLoading(false);
    }, 800);
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between bg-white/60 backdrop-blur-lg p-5 rounded-xl shadow-md border border-white/60">
        <h1 className="text-xl font-bold text-slate-800">System Reports</h1>
        <button className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-lg shadow-md transition-all active:scale-95 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Generate New
        </button>
      </div>

      <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-md border border-slate-200 overflow-hidden">
        {loading ? (
            <div className="p-8 flex justify-center items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800"></div>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                {reports.map((report) => (
                    <div key={report.id} className="group p-5 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 group-hover:text-slate-900">{report.type}</h3>
                                <p className="text-sm text-slate-500 mt-1">Generated: {report.date}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                                report.status === 'READY' 
                                ? 'bg-green-100 text-green-700 border-green-200' 
                                : 'bg-slate-100 text-slate-600 border-slate-200 animate-pulse'
                            }`}>
                                {report.status}
                            </span>
                        </div>
                        <div className="flex justify-between items-center text-sm border-t border-slate-100 pt-4 mt-4">
                            <span className="text-slate-500">By: <span className="font-medium text-slate-700">{report.generated_by}</span></span>
                            <button 
                                disabled={report.status !== 'READY'}
                                className={`text-xs font-semibold flex items-center gap-1 ${
                                    report.status === 'READY' 
                                    ? 'text-slate-600 hover:text-slate-900 transition-colors' 
                                    : 'text-slate-400 cursor-not-allowed'
                                }`}>
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                Download PDF
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};
export default Reports;
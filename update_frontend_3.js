const fs = require('fs');
const paymentsJSX = `import { useState, useEffect } from "react";

const Payments = () => {
  const [fines, setFines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [selectedFine, setSelectedFine] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setFines([
        { fine_id: 201, violation_id: 105, amount: 75.00, due_date: "2023-12-05", status: "UNPAID", vehicle_id: "CAB-1023" },
        { fine_id: 202, violation_id: 106, amount: 250.00, due_date: "2023-12-10", status: "LATE", vehicle_id: "SDF-4492" }
      ]);
      setLoading(false);
    }, 600);
  }, []);

  const handleProcess = (e) => {
    e.preventDefault();
    setProcessing(true);
    setTimeout(() => {
      setFines(fines.filter(f => f.fine_id !== selectedFine.fine_id));
      setProcessing(false);
      setSelectedFine(null);
    }, 1000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between bg-white/60 backdrop-blur-lg p-5 rounded-xl shadow-md border border-white/60">
        <h1 className="text-xl font-bold text-slate-800">Pending Fines & Collections</h1>
      </div>

      <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-md border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500 font-medium tracking-wide">Loading records...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100/50 text-slate-500 text-xs uppercase tracking-wider font-semibold border-b border-slate-200">
                  <th className="px-6 py-4">Receipt / Fine ID</th>
                  <th className="px-6 py-4">Vehicle</th>
                  <th className="px-6 py-4">Amount Due</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {fines.map(fine => (
                  <tr key={fine.fine_id} className="hover:bg-slate-50 even:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-sm text-slate-600">#{fine.fine_id} / V-{fine.violation_id}</td>
                    <td className="px-6 py-4 font-bold text-slate-800">{fine.vehicle_id}</td>
                    <td className="px-6 py-4 font-black text-slate-800">$\{fine.amount.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={\`px-2.5 py-1 rounded-md text-xs font-semibold border \${
                        fine.status === 'LATE' 
                        ? 'bg-red-100 text-red-700 border-red-200' 
                        : 'bg-yellow-100 text-yellow-700 border-yellow-200'
                      }\`}>
                        {fine.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setSelectedFine(fine)}
                        className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-all active:scale-95"
                      >
                        Process Payment
                      </button>
                    </td>
                  </tr>
                ))}
                {fines.length === 0 && (
                  <tr><td colSpan="5" className="p-8 text-center text-slate-500 font-medium tracking-wide">No pending fines.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedFine && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-all">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-sm w-full p-6 animate-fade-in scale-100">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800">Clear Invoice</h3>
              <button onClick={() => setSelectedFine(null)} className="text-slate-400 hover:text-slate-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100 shadow-sm">
                <span className="text-sm font-medium text-slate-500">Fine Amount</span>
                <span className="text-lg font-black text-slate-800">$\{selectedFine.amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center px-2">
                <span className="text-sm text-slate-500">Vehicle</span>
                <span className="text-sm font-bold text-slate-700">{selectedFine.vehicle_id}</span>
              </div>
            </div>

            <form onSubmit={handleProcess}>
              <button 
                type="submit" 
                disabled={processing}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                {processing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Processing...
                  </>
                ) : "Confirm Remittance"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default Payments;`;

const reportsJSX = `import { useState, useEffect } from "react";

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
                            <span className={\`px-3 py-1 rounded-full text-xs font-semibold border \${
                                report.status === 'READY' 
                                ? 'bg-green-100 text-green-700 border-green-200' 
                                : 'bg-slate-100 text-slate-600 border-slate-200 animate-pulse'
                            }\`}>
                                {report.status}
                            </span>
                        </div>
                        <div className="flex justify-between items-center text-sm border-t border-slate-100 pt-4 mt-4">
                            <span className="text-slate-500">By: <span className="font-medium text-slate-700">{report.generated_by}</span></span>
                            <button 
                                disabled={report.status !== 'READY'}
                                className={\`text-xs font-semibold flex items-center gap-1 \${
                                    report.status === 'READY' 
                                    ? 'text-slate-600 hover:text-slate-900 transition-colors' 
                                    : 'text-slate-400 cursor-not-allowed'
                                }\`}>
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
export default Reports;`;

const addViolationJSX = `import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddViolation = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    vehicle_id: "",
    violation_type_id: "",
    location: "",
    description: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
        setLoading(false);
        navigate('/dashboard');
    }, 1000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
        <div className="flex items-center justify-between bg-white/60 backdrop-blur-lg p-5 rounded-xl shadow-md border border-white/60">
            <div>
                <h1 className="text-xl font-bold text-slate-800">Issue Citation</h1>
                <p className="text-sm text-slate-500 mt-1">Record a new traffic violation</p>
            </div>
            <button onClick={() => navigate(-1)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </button>
        </div>

        <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-md border border-slate-200 p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">License Plate</label>
                        <input 
                            required
                            type="text" 
                            placeholder="e.g. CAB-1023"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all font-mono uppercase"
                            value={formData.vehicle_id}
                            onChange={(e) => setFormData({...formData, vehicle_id: e.target.value})}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Violation Type</label>
                        <select 
                            required
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all text-slate-700"
                            value={formData.violation_type_id}
                            onChange={(e) => setFormData({...formData, violation_type_id: e.target.value})}
                        >
                            <option value="" disabled>Select infraction...</option>
                            <option value="1">Speeding</option>
                            <option value="2">Running Red Light</option>
                            <option value="3">Illegal Parking</option>
                            <option value="4">Reckless Driving</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Location of Incident</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        </div>
                        <input 
                            required
                            type="text" 
                            placeholder="Street name, Intersection, etc."
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all"
                            value={formData.location}
                            onChange={(e) => setFormData({...formData, location: e.target.value})}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Officer Notes / Description</label>
                    <textarea 
                        rows="4"
                        placeholder="Provide details about the incident..."
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all resize-none"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                    ></textarea>
                </div>

                <div className="pt-4 flex items-center justify-end gap-4 border-t border-slate-100">
                    <button 
                        type="button"
                        onClick={() => navigate(-1)}
                        className="px-6 py-3 text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit"
                        disabled={loading}
                        className="px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-lg shadow-md transition-all active:scale-95 flex items-center justify-center min-w-[140px]"
                    >
                        {loading ? (
                            <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        ) : 'Submit Citation'}
                    </button>
                </div>
            </form>
        </div>
    </div>
  );
};
export default AddViolation;`;

fs.writeFileSync('frontend/src/pages/Payments.jsx', paymentsJSX);
fs.writeFileSync('frontend/src/pages/Reports.jsx', reportsJSX);
fs.writeFileSync('frontend/src/pages/AddViolation.jsx', addViolationJSX);
console.log("Updated Payments, Reports, AddViolation");

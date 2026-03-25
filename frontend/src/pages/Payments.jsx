import { useState, useEffect } from "react";

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
                    <td className="px-6 py-4 font-black text-slate-800">${fine.amount.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${
                        fine.status === 'LATE' 
                        ? 'bg-red-100 text-red-700 border-red-200' 
                        : 'bg-yellow-100 text-yellow-700 border-yellow-200'
                      }`}>
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
                <span className="text-lg font-black text-slate-800">${selectedFine.amount.toFixed(2)}</span>
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
export default Payments;
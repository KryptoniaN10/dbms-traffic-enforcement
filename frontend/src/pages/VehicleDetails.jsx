import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";

const VehicleDetails = () => {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await api.get(`/vehicles/${id}`);
        // To make it look like our old mock, attach empty owner and violations or fetch them:
        const data = response.data;
        data.owner = data.owner || { full_name: "Unknown", license_number: "N/A", phone: "N/A", address: "N/A" };
        data.violations = data.violations || [];
        setVehicle(data);
      } catch (error) {
        console.error("Failed to load vehicle details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6">
         <div className="h-8 bg-slate-200 rounded w-1/4 animate-pulse"></div>
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-64 bg-slate-200 rounded-xl animate-pulse"></div>
            <div className="h-64 bg-slate-200 rounded-xl animate-pulse"></div>
         </div>
      </div>
    );
  }
  
  if (!vehicle) return <div className="p-10 text-center text-slate-500 bg-white rounded-xl shadow-sm">Vehicle not found.</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Link to="/vehicles" className="inline-flex items-center text-slate-500 hover:text-slate-800 text-sm font-medium mb-2 transition-colors">
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back to Registry
          </Link>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            {vehicle.vehicle_id}
            <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold ${vehicle.license_status === "ACTIVE" ? "bg-green-100 text-green-700 border border-green-200" : "bg-red-100 text-red-700 border border-red-200"}`}>
              {vehicle.license_status}
            </span>
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 shadow-md border border-slate-200">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
            <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" /></svg>
            Specs
          </h2>
          <div className="grid grid-cols-2 gap-y-5 gap-x-4">
            <div>
              <p className="text-xs text-slate-500 mb-1">Make & Model</p>
              <p className="font-semibold text-slate-800">{vehicle.make} {vehicle.model}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Body Type</p>
              <p className="font-semibold text-slate-800">{vehicle.body_type}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Color</p>
              <p className="font-semibold text-slate-800">{vehicle.color}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Registered Date</p>
              <p className="font-semibold text-slate-800">{vehicle.registration_date}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 shadow-md border border-slate-200">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
            <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            Owner Details
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-slate-500 mb-1">Full Name</p>
              <p className="font-semibold text-slate-800">{vehicle.owner.full_name}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500 mb-1">License #</p>
                <p className="font-medium text-slate-800">{vehicle.owner.license_number}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Contact</p>
                <p className="font-medium text-slate-800">{vehicle.owner.phone}</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Address</p>
              <p className="font-medium text-slate-800">{vehicle.owner.address}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-md border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200 bg-slate-50/50">
           <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
             <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
             Violation History
           </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-100/50 text-slate-500 text-xs uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Violation Type</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Fine Amount</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {vehicle.violations.length > 0 ? (
                vehicle.violations.map(v => (
                  <tr key={v.violation_id} className="hover:bg-slate-50 even:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-600">{v.date}</td>
                    <td className="px-6 py-4 font-semibold text-slate-800">{v.type}</td>
                    <td className="px-6 py-4 text-slate-500 text-sm">{v.location}</td>
                    <td className="px-6 py-4 font-bold text-slate-800">${v.amount.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                        v.status === "PAID" 
                        ? "bg-green-100 text-green-700 border border-green-200" 
                        : "bg-yellow-100 text-yellow-700 border border-yellow-200"
                      }`}>
                        {v.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center flex flex-col items-center justify-center text-slate-500">
                    <svg className="w-10 h-10 text-slate-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    <span className="font-medium">No violations found for this vehicle.</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default VehicleDetails;
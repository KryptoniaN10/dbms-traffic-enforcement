import { useState, useEffect } from "react";

const Owners = () => {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setTimeout(() => {
      setOwners([
        { id: 1, name: "John Doe", license_number: "DL-992384", phone: "555-0192", violations_count: 2, status: "ACTIVE" },
        { id: 2, name: "Jane Smith", license_number: "DL-448291", phone: "555-8832", violations_count: 0, status: "ACTIVE" },
        { id: 3, name: "Robert Johnson", license_number: "DL-110293", phone: "555-1029", violations_count: 5, status: "SUSPENDED" }
      ]);
      setLoading(false);
    }, 600);
  }, []);

  const filtered = owners.filter(o => o.name.toLowerCase().includes(search.toLowerCase()) || o.license_number.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white/60 backdrop-blur-lg p-5 rounded-xl shadow-md border border-white/60 gap-4">
        <h1 className="text-xl font-bold text-slate-800">Vehicle Owners</h1>
        <div className="relative w-full sm:w-72">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text" 
            placeholder="Search name or license..."
            className="w-full pl-10 pr-4 py-2 bg-white/80 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-md border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500 font-medium">Loading owners...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {filtered.map(owner => (
              <div key={owner.id} className="group bg-white rounded-xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all hover:bg-slate-50/50">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">
                      {owner.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800">{owner.name}</h3>
                      <p className="text-xs text-slate-500 font-mono">{owner.license_number}</p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${owner.status === 'SUSPENDED' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {owner.status}
                  </span>
                </div>
                
                <div className="space-y-2 mt-4 pt-4 border-t border-slate-100">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Phone</span>
                    <span className="font-medium text-slate-700">{owner.phone}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Violations</span>
                    <span className={`font-bold ${owner.violations_count > 3 ? 'text-red-600' : owner.violations_count > 0 ? 'text-yellow-600' : 'text-green-600'}`}>
                      {owner.violations_count}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default Owners;
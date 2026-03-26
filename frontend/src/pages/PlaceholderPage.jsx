const PlaceholderPage = ({ title }) => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8 flex items-center justify-center min-h-[400px]">
        <div className="text-center text-slate-500">
          <svg className="w-16 h-16 mx-auto text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <p className="text-lg font-medium">{title} Page Content</p>
          <p className="text-sm mt-1">Component is scaffolded and ready for implementation.</p>
        </div>
      </div>
    </div>
  );
};

export default PlaceholderPage;
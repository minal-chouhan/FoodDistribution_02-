export default function Navbar({ page, setPage, listingCount }) {
  const tabs = [
    { id: 'dashboard', label: '📊 Dashboard' },
    { id: 'donate',    label: '🍽 Donate Food' },
    { id: 'listings',  label: '🤝 Find Food' },
    { id: 'map',       label: '📍 Map' },
    { id: 'ngo',       label: '🏠 NGO Hub' },
    { id: 'predict',   label: '🧠 AI Insights' },
  ]
  return (
    <nav className="bg-white border-b border-[#E2DAD0] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="font-syne font-black text-lg text-[#1A1612]">
          no food <span className="text-[#1D7A45]">left.</span>
        </div>
        <div className="flex gap-1">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setPage(t.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200
                ${page === t.id
                  ? 'bg-[#1A1612] text-white'
                  : 'text-[#7A6F63] hover:bg-[#F0EDE6]'}`}>
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 text-xs text-[#7A6F63]">
          <span className="w-2 h-2 rounded-full bg-[#1D7A45] animate-pulse-dot inline-block" />
          {listingCount} active
        </div>
      </div>
    </nav>
  )
}

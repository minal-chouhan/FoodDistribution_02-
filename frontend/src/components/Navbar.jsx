  export default function Navbar({ page, setPage, listingCount, user, onLogout }) {
    const tabs = [
      { id: 'dashboard', label: '📊 Dashboard', roles: ['admin', 'donor', 'receiver'] },
      { id: 'admin',     label: '🛠️ Admin',    roles: ['admin'] },
      { id: 'donate',    label: '🍽 Donate Food', roles: ['admin', 'donor'] },
      { id: 'listings',  label: '🤝 Find Food', roles: ['admin', 'receiver'] },
      { id: 'map',       label: '📍 Map',        roles: ['admin', 'receiver'] },
      { id: 'ngo',       label: '🏠 NGO Hub',    roles: ['admin', 'receiver'] },
      { id: 'predict',   label: '🧠 AI Insights', roles: ['admin', 'donor'] },
    ]

    const visibleTabs = tabs.filter((tab) => tab.roles.includes(user?.role))

    return (
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E2DAD0]/80 shadow-[0_18px_40px_-26px_rgba(26,22,18,0.35)]">
        <div className="max-w-7xl mx-auto px-6 py-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-1">
            <div className="font-syne font-black text-xl sm:text-2xl tracking-tight text-[#1A1612]">
              No Food <span className="text-[#1D7A45]">Left.</span>
            </div>
            <div className="text-[11px] uppercase tracking-[0.24em] text-[#7A6F63]">
              {user?.role === 'admin' ? 'admin portal' : user?.role === 'donor' ? 'donor dashboard' : 'receiver portal'}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {visibleTabs.map((t) => (
              <button key={t.id} onClick={() => setPage(t.id)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 shadow-sm
                  ${page === t.id
                    ? 'bg-[#1A1612] text-white shadow-[#1A1612]/20'
                    : 'text-[#4C4B48] bg-[#F8F6F2] hover:bg-[#EDE8DE]'}`}>
                {t.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm text-[#4C4B48]">
            <div className="rounded-full bg-[#F7F9F4] px-3 py-1 text-xs text-[#1A1612]">
              {user?.name || 'Guest'}
            </div>
            <button onClick={onLogout} className="rounded-full border border-[#E2DAD0] bg-white px-4 py-2 text-xs font-semibold text-[#1A1612] hover:bg-[#F7F7F5]">
              Logout
            </button>
          </div>
        </div>
      </nav>
    )
  }

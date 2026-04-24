// Badge component
export function Badge({ children, variant = 'green' }) {
  const styles = {
    green:  'bg-[#E6F5ED] text-[#1D7A45] border border-[#C2E8D0]',
    amber:  'bg-[#FEF2DC] text-[#9A5700] border border-[#F0D8A0]',
    red:    'bg-[#FDEAEA] text-[#B03232] border border-[#EDBBBB]',
    blue:   'bg-[#E8EFFA] text-[#1A4E8A] border border-[#B8D0F0]',
    purple: 'bg-[#EDE8FA] text-[#5B3FA0] border border-[#C8B8F0]',
    gray:   'bg-[#F0EDE6] text-[#7A6F63] border border-[#E2DAD0]',
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[variant]}`}>
      {children}
    </span>
  )
}

// Stat card
export function StatCard({ label, value, sub, color = 'ink' }) {
  const colors = {
    ink:    'text-[#1A1612]',
    green:  'text-[#1D7A45]',
    red:    'text-[#B03232]',
    blue:   'text-[#1A4E8A]',
    amber:  'text-[#9A5700]',
  }
  return (
    <div className="bg-white border border-[#E2DAD0] rounded-xl p-4">
      <div className="text-[11px] text-[#B5AA9E] uppercase tracking-widest font-medium mb-1">{label}</div>
      <div className={`font-syne text-3xl font-black ${colors[color]} leading-none my-1`}>{value}</div>
      {sub && <div className="text-xs text-[#7A6F63] mt-1">{sub}</div>}
    </div>
  )
}

// Button
export function Btn({ children, onClick, variant = 'primary', className = '', disabled = false, type = 'button' }) {
  const base = 'px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
  const variants = {
    primary:   'bg-[#1A1612] text-white hover:bg-[#2e2a26]',
    green:     'bg-[#1D7A45] text-white hover:bg-[#155E36]',
    ghost:     'bg-white text-[#7A6F63] border border-[#E2DAD0] hover:bg-[#F0EDE6]',
    danger:    'bg-[#FDEAEA] text-[#B03232] border border-[#EDBBBB] hover:bg-[#f5d0d0]',
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  )
}

// Input wrapper
export function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-[#7A6F63]">{label}</label>
      {children}
    </div>
  )
}

// Section label
export function SectionLabel({ children }) {
  return (
    <div className="font-syne text-[11px] font-bold uppercase tracking-widest text-[#B5AA9E] mb-3 pb-2 border-b border-[#E2DAD0]">
      {children}
    </div>
  )
}

// Expiry bar
export function ExpiryBar({ level }) {
  const cfg = {
    fresh:    { pct: 82, color: '#1D7A45', label: '🟢 Fresh (>4 hrs)' },
    moderate: { pct: 50, color: '#9A5700', label: '🟡 Moderate (2–4 hrs)' },
    urgent:   { pct: 14, color: '#B03232', label: '🔴 Urgent (<2 hrs)' },
  }
  const { pct, color, label } = cfg[level] || cfg.fresh
  return (
    <div className="mb-3">
      <div className="flex justify-between text-[11px] text-[#7A6F63] mb-1">
        <span>Freshness</span>
        <span style={{ color }}>{label}</span>
      </div>
      <div className="h-1.5 bg-[#F0EDE6] rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  )
}

// Loading spinner
export function Spinner() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="w-8 h-8 border-2 border-[#E2DAD0] border-t-[#1D7A45] rounded-full animate-spin" />
    </div>
  )
}

// Empty state
export function Empty({ icon = '🍛', message = 'Nothing here yet' }) {
  return (
    <div className="col-span-2 flex flex-col items-center justify-center py-16 text-center">
      <div className="text-4xl mb-3">{icon}</div>
      <p className="text-[#B5AA9E] text-sm">{message}</p>
    </div>
  )
}

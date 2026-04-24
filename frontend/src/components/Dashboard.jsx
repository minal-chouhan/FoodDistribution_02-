import { useEffect, useState } from 'react'
import { foodAPI } from '../api'
import { StatCard } from './UI'

const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']

export default function Dashboard({ onNavigate }) {
  const [stats, setStats]     = useState(null)
  const [recent, setRecent]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([foodAPI.stats(), foodAPI.getAll()])
      .then(([s, f]) => {
        setStats(s.data)
        setRecent(f.data.listings.slice(0, 4))
      })
      .finally(() => setLoading(false))
  }, [])

  const today = DAYS[new Date().getDay()]
  const currentShort = new Date().toLocaleDateString('en-US', { weekday: 'short' })

  const barData = [
    { day: 'Sun', val: 48 }, { day: 'Mon', val: 62 },
    { day: 'Tue', val: 70 }, { day: 'Wed', val: 55 },
    { day: 'Thu', val: 88 }, { day: 'Fri', val: 75 },
    { day: 'Sat', val: 60 },
  ]

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Hero */}
      <div className="mb-8 grid gap-5 lg:grid-cols-[1.5fr_1fr] lg:items-end">
        <div>
          <div className="inline-flex items-center rounded-full bg-[#E6F5ED] px-3 py-1 text-[11px] uppercase tracking-[0.26em] font-semibold text-[#1D7A45] mb-4">
            Built for food rescue
          </div>
          <h1 className="font-syne text-4xl sm:text-4xl lg:text-5.
          xl font-black text-[#1A1612] leading-tight">
            Food waste is a choice.
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[#4C4B48] max-w-3xl leading-relaxed">
            Turn surplus meals into community impact with a dashboard that makes pickup, donation and sharing simple.
          </p>
          <div className="mt-5 flex flex-wrap gap-3 items-center text-xs text-[#7A6F63] uppercase tracking-[0.24em]">
            <span>Live stats — {today}</span>
            <span className="inline-flex items-center rounded-full bg-[#F7F9F4] px-2.5 py-1">Fast updates</span>
          </div>
        </div>
        <div className="rounded-[28px] bg-[#F7FAF6] p-6 border border-[#D8E7DF] shadow-sm">
          <div className="text-[11px] uppercase tracking-[0.3em] text-[#1D7A45] font-bold mb-2">Active snapshot</div>
          <div className="text-4xl sm:text-5xl font-black text-[#1A1612]">{stats ? stats.active_listings : '—'}</div>
          <div className="text-sm text-[#4C4B48] mt-2">available listings right now</div>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-8">
          <StatCard label="Active Listings" value={stats.active_listings} sub="right now" color="ink" />
          <StatCard label="Plates Available" value={stats.plates_available} sub="total quantity" color="green" />
          <StatCard label="Urgent Pickups" value={stats.urgent_listings} sub="expire < 2 hrs" color="red" />
          <StatCard label="Meals Donated" value={stats.total_meals_donated.toLocaleString()} sub="since launch" color="green" />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
        {/* Bar chart */}
        <div className="bg-white border border-[#E2DAD0] rounded-2xl p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-5">
            <div>
              <div className="font-syne text-sm font-bold uppercase tracking-wider text-[#B5AA9E]">Weekly pickups</div>
              <div className="text-xs text-[#7A6F63]">Includes the full week and weekend</div>
            </div>
            <span className="text-xs text-[#7A6F63]">Last 7 days</span>
          </div>
          <div className="flex items-end gap-3 h-32">
            {barData.map((b, i) => {
              const isToday = b.day === currentShort
              return (
                <div key={i} className="flex flex-col items-center gap-2 flex-1">
                  <div className={`w-full rounded-t-3xl transition-all ${isToday ? 'shadow-[0_0_0_3px_rgba(29,122,69,0.16)]' : ''}`}
                    style={{
                      height: `${Math.max(20, b.val)}%`,
                      background: isToday ? '#1D7A45' : `linear-gradient(180deg, rgba(29,122,69,0.85), rgba(29,122,69,0.18))`
                    }} />
                  <span className={`text-[11px] font-semibold ${isToday ? 'text-[#1D7A45]' : 'text-[#B5AA9E]'}`}>{b.day}</span>
                </div>
              )
            })}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 text-[11px] text-[#7A6F63]">
            <div className="rounded-2xl bg-[#F7F9F4] p-3">Weekend totals included</div>
            <div className="rounded-2xl bg-[#F7F9F4] p-3">Today highlighted</div>
          </div>
        </div>

        {/* Impact */}
        {stats && (
          <div className="bg-white border border-[#E2DAD0] rounded-2xl p-6">
            <div className="font-syne text-sm font-bold uppercase tracking-wider text-[#B5AA9E] mb-4">Impact</div>
            <div className="space-y-5">
              <div className="rounded-2xl bg-[#F7F9F4] p-4">
                <div className="text-xs text-[#7A6F63] mb-1">Food saved (kg)</div>
                <div className="font-syne text-3xl font-black text-[#1D7A45]">{Math.round(stats.total_kg_saved)}</div>
              </div>
              <div className="rounded-2xl bg-[#F3F6FB] p-4">
                <div className="text-xs text-[#7A6F63] mb-1">CO₂ avoided (kg)</div>
                <div className="font-syne text-3xl font-black text-[#1A4E8A]">{Math.round(stats.co2_avoided)}</div>
              </div>
              <div className="rounded-2xl bg-[#FEF9F2] p-4">
                <div className="text-xs text-[#7A6F63] mb-1">Claimed listings</div>
                <div className="font-syne text-3xl font-black text-[#9A5700]">{stats.claimed_listings}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Recent listings */}
      <div className="mt-6 bg-white border border-[#E2DAD0] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="font-syne text-sm font-bold uppercase tracking-wider text-[#B5AA9E]">Recent listings</div>
          <button onClick={() => onNavigate('listings')}
            className="text-xs text-[#1D7A45] font-medium hover:underline">View all →</button>
        </div>
        <div className="space-y-2">
          {recent.map(l => {
            const expColor = l.expiry_level === 'fresh' ? '#1D7A45' : l.expiry_level === 'moderate' ? '#9A5700' : '#B03232'
            return (
              <div key={l.id} className="flex items-center justify-between py-2 border-b border-[#F0EDE6] last:border-0">
                <div>
                  <span className="font-medium text-sm">{l.food_name}</span>
                  <span className="text-xs text-[#7A6F63] ml-2">{l.donor_name} · {l.zone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-syne font-bold text-sm" style={{ color: expColor }}>{l.quantity} {l.unit}</span>
                  <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                    l.status === 'available' ? 'bg-[#E6F5ED] text-[#1D7A45]' : 'bg-[#F0EDE6] text-[#B5AA9E]'
                  }`}>{l.status}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <button onClick={() => onNavigate('donate')}
          className="bg-[#1D7A45] text-white rounded-2xl p-5 text-left hover:bg-[#155E36] transition-colors">
          <div className="text-2xl mb-2">🍛</div>
          <div className="font-syne font-bold text-lg">List surplus food</div>
          <div className="text-sm text-[#C2E8D0] mt-1">Connect with nearby NGOs instantly</div>
        </button>
        <button onClick={() => onNavigate('predict')}
          className="bg-[#1A1612] text-white rounded-2xl p-5 text-left hover:bg-[#2e2a26] transition-colors">
          <div className="text-2xl mb-2">🧠</div>
          <div className="font-syne font-bold text-lg">AI demand insights</div>
          <div className="text-sm text-[#B5AA9E] mt-1">Know what to cook less of today</div>
        </button>
      </div>
    </div>
  )
}

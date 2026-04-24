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

  const barData = [
    { day: 'Mon', val: 55 }, { day: 'Tue', val: 70 },
    { day: 'Wed', val: 45 }, { day: 'Thu', val: 88 },
    { day: 'Fri', val: 75 }, { day: 'Sat', val: 60 },
    { day: 'Today', val: 100 },
  ]

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Hero */}
      <div className="mb-8">
        <h1 className="font-syne text-3xl font-black text-[#1A1612] leading-tight">
          Food waste is <span className="text-[#1D7A45]">a choice.</span><br />
          Let's make a different one.
        </h1>
        <p className="text-sm text-[#7A6F63] mt-2">Live stats — {today}</p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-4 gap-3 mb-8">
          <StatCard label="Active Listings" value={stats.active_listings} sub="right now" color="ink" />
          <StatCard label="Plates Available" value={stats.plates_available} sub="total quantity" color="green" />
          <StatCard label="Urgent Pickups" value={stats.urgent_listings} sub="expire < 2 hrs" color="red" />
          <StatCard label="Meals Donated" value={stats.total_meals_donated.toLocaleString()} sub="since launch" color="green" />
        </div>
      )}

      <div className="grid grid-cols-3 gap-6">
        {/* Bar chart */}
        <div className="col-span-2 bg-white border border-[#E2DAD0] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="font-syne text-sm font-bold uppercase tracking-wider text-[#B5AA9E]">Weekly pickups</div>
            <span className="text-xs text-[#7A6F63]">Last 7 days</span>
          </div>
          <div className="flex items-end gap-2 h-28">
            {barData.map((b, i) => (
              <div key={i} className="flex flex-col items-center gap-1 flex-1">
                <div className="w-full rounded-t-md transition-all"
                  style={{
                    height: `${b.val}%`,
                    background: b.day === 'Today' ? '#1D7A45' : `rgba(29,122,69,${0.2 + b.val/200})`
                  }} />
                <span className="text-[10px] text-[#B5AA9E] font-medium">{b.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Impact */}
        {stats && (
          <div className="bg-white border border-[#E2DAD0] rounded-2xl p-6">
            <div className="font-syne text-sm font-bold uppercase tracking-wider text-[#B5AA9E] mb-4">Impact</div>
            <div className="space-y-4">
              <div>
                <div className="text-xs text-[#7A6F63] mb-1">Food saved (kg)</div>
                <div className="font-syne text-2xl font-black text-[#1D7A45]">{Math.round(stats.total_kg_saved)}</div>
              </div>
              <div>
                <div className="text-xs text-[#7A6F63] mb-1">CO₂ avoided (kg)</div>
                <div className="font-syne text-2xl font-black text-[#1A4E8A]">{Math.round(stats.co2_avoided)}</div>
              </div>
              <div>
                <div className="text-xs text-[#7A6F63] mb-1">Claimed listings</div>
                <div className="font-syne text-2xl font-black text-[#9A5700]">{stats.claimed_listings}</div>
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

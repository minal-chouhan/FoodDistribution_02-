import { useEffect, useState } from 'react'
import { foodAPI } from '../api'
import { StatCard } from './UI'

export default function AdminPanel({ onNavigate, refresh }) {
  const [stats, setStats] = useState(null)
  const [listings, setListings] = useState([])

  useEffect(() => {
    Promise.all([foodAPI.stats(), foodAPI.getAll()])
      .then(([s, f]) => {
        setStats(s.data)
        setListings(f.data.listings)
      })
  }, [refresh])

  const donors = Array.from(new Set(listings.map((item) => item.donor_name))).slice(0, 6)
  const receivers = listings.filter((item) => item.status === 'claimed').length
  const available = listings.filter((item) => item.status === 'available').length

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.32em] text-[#7A6F63] font-semibold mb-2">Admin dashboard</div>
          <h1 className="font-syne text-3xl sm:text-4xl font-black text-[#1A1612] leading-tight">
            Manage donors, receivers and listings
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-[#4C4B48]">
            Get a quick overview of active donations, claimed pickups and the organizations using the platform.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-2">
          <button
            onClick={() => onNavigate('donate')}
            className="rounded-2xl bg-[#1D7A45] px-4 py-3 text-sm font-semibold text-white hover:bg-[#155E36] transition"
          >
            Add donation
          </button>
          <button
            onClick={() => onNavigate('listings')}
            className="rounded-2xl border border-[#E2DAD0] bg-white px-4 py-3 text-sm font-semibold text-[#1A1612] hover:bg-[#F7F7F5] transition"
          >
            Review listings
          </button>
        </div>
      </div>

      {stats && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-8">
          <StatCard label="Active listings" value={stats.active_listings} sub="currently available" color="ink" />
          <StatCard label="Plates available" value={stats.plates_available} sub="ready for pickup" color="green" />
          <StatCard label="Urgent pickups" value={stats.urgent_listings} sub="needs action" color="red" />
          <StatCard label="Claimed pickups" value={stats.claimed_listings} sub="receiver activity" color="blue" />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-[#E2DAD0] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div className="font-syne text-sm font-bold uppercase tracking-wider text-[#B5AA9E]">Top donors</div>
            <span className="text-xs text-[#7A6F63]">Real names</span>
          </div>
          <div className="space-y-3">
            {donors.length > 0 ? donors.map((donor) => (
              <div key={donor} className="rounded-2xl bg-[#F7F9F4] p-4 text-sm font-medium text-[#1A1612]">
                {donor}
              </div>
            )) : (
              <div className="rounded-2xl bg-[#F7F9F4] p-4 text-sm text-[#7A6F63]">No donors yet</div>
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-[#E2DAD0] bg-white p-6 shadow-sm">
          <div className="font-syne text-sm font-bold uppercase tracking-wider text-[#B5AA9E] mb-4">Receiver summary</div>
          <div className="space-y-4">
            <div className="rounded-2xl bg-[#F7F9F4] p-4">
              <div className="text-xs text-[#7A6F63] mb-1">Active receivers</div>
              <div className="text-3xl font-black text-[#1A1612]">{receivers}</div>
            </div>
            <div className="rounded-2xl bg-[#F7F9F4] p-4">
              <div className="text-xs text-[#7A6F63] mb-1">Open requests</div>
              <div className="text-3xl font-black text-[#1D7A45]">{available}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-3xl border border-[#E2DAD0] bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div className="font-syne text-sm font-bold uppercase tracking-wider text-[#B5AA9E]">Recent listings</div>
          <button onClick={() => onNavigate('listings')} className="text-xs text-[#1D7A45] font-medium hover:underline">Manage all</button>
        </div>
        <div className="space-y-3">
          {listings.slice(0, 5).map((item) => (
            <div key={item.id} className="grid gap-3 rounded-3xl border border-[#F0EDE6] bg-[#F7F9F4] p-5 sm:grid-cols-[1fr_auto]">
              <div>
                <div className="font-semibold text-sm text-[#1A1612]">{item.food_name}</div>
                <div className="text-xs text-[#7A6F63] mt-1">{item.donor_name} · {item.zone}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-[#1D7A45]">{item.quantity} {item.unit}</div>
                <div className="text-[11px] mt-1 text-[#7A6F63]">{item.status}</div>
              </div>
            </div>
          ))}
          {listings.length === 0 && (
            <div className="rounded-2xl bg-[#F7F9F4] p-5 text-sm text-[#7A6F63]">No listings available yet.</div>
          )}
        </div>
      </div>
    </div>
  )
}

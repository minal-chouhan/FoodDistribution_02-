import { useEffect, useState } from 'react'
import { foodAPI } from '../api'
import { Badge, ExpiryBar, Spinner, Empty, StatCard } from './UI'
import toast from 'react-hot-toast'

const NGOS = ['Ananya Foundation','Roti Bank Indore','Snehi Mahila Mandal','Yuva Shakti Volunteers']

export default function Listings({ refresh }) {
  const [listings, setListings] = useState([])
  const [stats, setStats]       = useState(null)
  const [loading, setLoading]   = useState(true)
  const [filters, setFilters]   = useState({ diet: '', exp: '', zone: '' })
  const [accepting, setAccepting] = useState(null)
  const [ngoModal, setNgoModal]   = useState(null)

  const load = async () => {
    const [f, s] = await Promise.all([foodAPI.getAll(), foodAPI.stats()])
    setListings(f.data.listings)
    setStats(s.data)
    setLoading(false)
  }

  useEffect(() => { load() }, [refresh])

  const accept = async (id, ngo) => {
    setAccepting(id)
    try {
      await foodAPI.accept(id, ngo)
      toast.success(`✅ Pickup accepted by ${ngo}!`)
      load()
    } catch (e) {
      toast.error(e.response?.data?.detail || 'Failed to accept')
    }
    setAccepting(null)
    setNgoModal(null)
  }

  const setF = (k, v) => setFilters(f => ({ ...f, [k]: f[k] === v ? '' : v }))

  const filtered = listings.filter(l => {
    if (filters.diet && l.food_type !== filters.diet) return false
    if (filters.exp  && l.expiry_level !== filters.exp) return false
    if (filters.zone && l.zone !== filters.zone) return false
    return true
  })

  const typeEmoji = t => t === 'veg' ? '🥦' : t === 'nonveg' ? '🍗' : '🌱'
  const expBadge  = e => e === 'fresh' ? 'green' : e === 'moderate' ? 'amber' : 'red'

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="font-syne text-3xl font-black mb-1">Food available <span className="text-[#1D7A45]">near you</span></h1>
      <p className="text-sm text-[#7A6F63] mb-6">Real-time listings with allergen & diet info on every card.</p>

      {stats && (
        <div className="grid grid-cols-4 gap-3 mb-6">
          <StatCard label="Active listings" value={stats.active_listings} color="ink" />
          <StatCard label="Plates available" value={stats.plates_available} color="green" />
          <StatCard label="Urgent pickups" value={stats.urgent_listings} color="red" sub="expire <2 hrs" />
          <StatCard label="Total donated" value={stats.total_meals_donated.toLocaleString()} color="green" />
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[['veg','🥦 Veg only'],['nonveg','🍗 Non-veg'],['vegan','🌱 Vegan']].map(([v,l]) => (
          <button key={v} onClick={() => setF('diet', v)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
              filters.diet === v ? 'bg-[#1A1612] text-white border-[#1A1612]' : 'bg-white text-[#7A6F63] border-[#E2DAD0] hover:bg-[#F0EDE6]'
            }`}>{l}</button>
        ))}
        {[['urgent','🔴 Urgent'],['fresh','🟢 Fresh'],['moderate','🟡 Moderate']].map(([v,l]) => (
          <button key={v} onClick={() => setF('exp', v)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
              filters.exp === v ? 'bg-[#1A1612] text-white border-[#1A1612]' : 'bg-white text-[#7A6F63] border-[#E2DAD0] hover:bg-[#F0EDE6]'
            }`}>{l}</button>
        ))}
        <select value={filters.zone} onChange={e => setFilters(f => ({...f, zone: e.target.value}))}
          className="px-3 py-1.5 rounded-full text-xs border border-[#E2DAD0] bg-white text-[#7A6F63]">
          <option value="">All zones</option>
          {['Vijay Nagar','Palasia','MG Road','Scheme 54','Race Course'].map(z => <option key={z}>{z}</option>)}
        </select>
        {(filters.diet || filters.exp || filters.zone) && (
          <button onClick={() => setFilters({diet:'',exp:'',zone:''})}
            className="px-3 py-1.5 rounded-full text-xs font-medium text-[#B03232] bg-[#FDEAEA] border border-[#EDBBBB]">
            Clear filters ✕
          </button>
        )}
      </div>

      {loading ? <Spinner /> : (
        <div className="grid grid-cols-2 gap-4">
          {filtered.length === 0 && <Empty message="No listings match your filters." />}
          {filtered.map((l, i) => (
            <div key={l.id} className="bg-white border border-[#E2DAD0] rounded-2xl p-5 hover:shadow-md transition-shadow animate-fade-up"
              style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-syne font-bold text-base">{l.food_name}</h3>
                  <p className="text-xs text-[#7A6F63] mt-0.5">{l.donor_name} · {l.zone}</p>
                </div>
                <div className="text-right">
                  <div className="font-syne font-black text-xl text-[#1D7A45]">{l.quantity}</div>
                  <div className="text-[10px] text-[#B5AA9E]">{l.unit}</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-3">
                <Badge variant={l.food_type === 'veg' ? 'green' : l.food_type === 'nonveg' ? 'amber' : 'green'}>
                  {typeEmoji(l.food_type)} {l.food_type}
                </Badge>
                <Badge variant={expBadge(l.expiry_level)}>
                  {l.expiry_level === 'fresh' ? '🟢' : l.expiry_level === 'moderate' ? '🟡' : '🔴'} {l.expiry_level}
                </Badge>
                {l.status === 'claimed' && <Badge variant="gray">✓ claimed</Badge>}
              </div>

              {l.allergens?.length > 0 && (
                <div className="bg-[#FDEAEA] rounded-lg px-3 py-1.5 text-xs text-[#B03232] mb-2 flex gap-1.5">
                  <span>⚠️</span><span>Contains: {l.allergens.join(', ')}</span>
                </div>
              )}
              {l.restrictions?.length > 0 && (
                <div className="bg-[#FEF2DC] rounded-lg px-3 py-1.5 text-xs text-[#9A5700] mb-2 flex gap-1.5">
                  <span>🚫</span><span>Not for: {l.restrictions.join(', ')}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="bg-[#F0EDE6] rounded-lg px-2.5 py-1.5">
                  <div className="text-[10px] text-[#B5AA9E]">Location</div>
                  <div className="text-xs font-medium truncate">{l.address}</div>
                </div>
                <div className="bg-[#F0EDE6] rounded-lg px-2.5 py-1.5">
                  <div className="text-[10px] text-[#B5AA9E]">Listed</div>
                  <div className="text-xs font-medium">{new Date(l.created_at).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</div>
                </div>
              </div>

              <ExpiryBar level={l.expiry_level} />

              {l.status === 'available' ? (
                <button onClick={() => setNgoModal(l.id)}
                  className="w-full py-2.5 bg-[#1D7A45] text-white rounded-xl text-sm font-medium hover:bg-[#155E36] transition-colors">
                  Accept pickup
                </button>
              ) : (
                <div className="w-full py-2.5 bg-[#F0EDE6] text-[#B5AA9E] rounded-xl text-sm font-medium text-center">
                  ✓ Claimed by {l.accepted_by}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* NGO picker modal */}
      {ngoModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm animate-fade-up">
            <h3 className="font-syne font-bold text-lg mb-1">Select your NGO</h3>
            <p className="text-sm text-[#7A6F63] mb-4">Which organisation is accepting this pickup?</p>
            <div className="space-y-2 mb-4">
              {NGOS.map(n => (
                <button key={n} onClick={() => accept(ngoModal, n)}
                  disabled={accepting === ngoModal}
                  className="w-full text-left px-4 py-3 border border-[#E2DAD0] rounded-xl hover:bg-[#E6F5ED] hover:border-[#1D7A45] transition-all text-sm font-medium">
                  {n}
                </button>
              ))}
            </div>
            <button onClick={() => setNgoModal(null)}
              className="w-full text-sm text-[#7A6F63] hover:text-[#1A1612]">Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}

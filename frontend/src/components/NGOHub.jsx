import { useEffect, useState } from 'react'
import { foodAPI } from '../api'

const NGOS = [
  { name:'Ananya Foundation', type:'Feeding programme · Indore', avatar:'🤝', color:'#E6F5ED', meals:1240, pickups:38, volunteers:12, goal:62, fill:'#1D7A45', tags:['Veg-focused','Children\'s homes','Elderly care'], tagColors:['green','blue','purple'] },
  { name:'Roti Bank Indore', type:'Daily meals · Vijay Nagar', avatar:'🏠', color:'#E8EFFA', meals:3420, pickups:91, volunteers:24, goal:88, fill:'#1A4E8A', tags:['All food types','Street communities','Orphanages'], tagColors:['green','amber','blue'] },
  { name:'Snehi Mahila Mandal', type:'Women & children · Palasia', avatar:'👩‍👧', color:'#FEF2DC', meals:780, pickups:21, volunteers:8, goal:45, fill:'#9A5700', tags:['Jain-friendly','Women shelters','No allergens'], tagColors:['green','purple','amber'] },
  { name:'Yuva Shakti Volunteers', type:'Student network · IIT Indore', avatar:'🎓', color:'#EDE8FA', meals:560, pickups:14, volunteers:42, goal:33, fill:'#5B3FA0', tags:['Student-run','All zones','Fastest pickup'], tagColors:['purple','blue','green'] },
]

const BADGE_COLORS = {
  green:  'bg-[#E6F5ED] text-[#1D7A45]',
  amber:  'bg-[#FEF2DC] text-[#9A5700]',
  blue:   'bg-[#E8EFFA] text-[#1A4E8A]',
  purple: 'bg-[#EDE8FA] text-[#5B3FA0]',
}

const TIMELINE_SEED = [
  { dot:'#1D7A45', title:'Roti Bank picked up 32 plates of Biryani from Hotel Shreyas', sub:'Delivered to Nanda Nagar · 32 meals served', time:'2 hrs ago' },
  { dot:'#1A4E8A', title:'Yuva Shakti collected bakery surplus from Bakers Point', sub:'45 pieces distributed at railway station', time:'4 hrs ago' },
  { dot:'#9A5700', title:'Snehi Mandal received Jain thali from Udupi Café', sub:'Delivered to women\'s shelter · 24 meals served', time:'Yesterday' },
  { dot:'#5B3FA0', title:'Ananya Foundation urgency pickup — Dal Makhani, 18 plates', sub:'Saved from waste · Vijay Nagar shelter', time:'Yesterday' },
]

export default function NGOHub({ refresh }) {
  const [stats, setStats] = useState(null)
  const [timeline, setTimeline] = useState(TIMELINE_SEED)
  const [claimed, setClaimed] = useState([])

  useEffect(() => {
    Promise.all([foodAPI.stats(), foodAPI.getAll({ status: 'claimed' })])
      .then(([s, f]) => {
        setStats(s.data)
        const cl = f.data.listings.filter(l => l.accepted_by)
        setClaimed(cl)
        // Add real accepted pickups to timeline
        const newItems = cl.map(l => ({
          dot: '#1D7A45',
          title: `${l.accepted_by} picked up ${l.quantity} ${l.unit} of ${l.food_name} from ${l.donor_name}`,
          sub: `${l.zone} · ${l.quantity} meals served`,
          time: 'Just now',
        }))
        setTimeline([...newItems, ...TIMELINE_SEED])
      })
  }, [refresh])

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="font-syne text-3xl font-black mb-1">NGO <span className="text-[#1D7A45]">impact hub</span></h1>
      <p className="text-sm text-[#7A6F63] mb-6">Contributions, meals served, community reach — the full bridge.</p>

      {/* NGO cards */}
      <div className="font-syne text-[11px] font-bold uppercase tracking-widest text-[#B5AA9E] mb-3 pb-2 border-b border-[#E2DAD0]">
        Active NGOs & communities
      </div>
      <div className="grid grid-cols-2 gap-4 mb-8">
        {NGOS.map(n => (
          <div key={n.name} className="bg-white border border-[#E2DAD0] rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                style={{ background: n.color }}>{n.avatar}</div>
              <div>
                <div className="font-syne font-bold text-sm">{n.name}</div>
                <div className="text-xs text-[#7A6F63]">{n.type}</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4">
              {[['meals served', n.meals.toLocaleString(), n.fill], ['pickups', n.pickups, '#1A1612'], ['volunteers', n.volunteers, '#1A1612']].map(([l, v, c]) => (
                <div key={l} className="bg-[#F0EDE6] rounded-xl p-2.5 text-center">
                  <div className="font-syne font-black text-base" style={{ color: c }}>{v}</div>
                  <div className="text-[10px] text-[#B5AA9E] mt-0.5">{l}</div>
                </div>
              ))}
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-xs text-[#7A6F63] mb-1.5">
                <span>Monthly goal</span><span className="font-medium">{n.goal}%</span>
              </div>
              <div className="h-1.5 bg-[#F0EDE6] rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-1000"
                  style={{ width: `${n.goal}%`, background: n.fill }} />
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {n.tags.map((t, i) => (
                <span key={t} className={`text-xs px-2.5 py-1 rounded-full font-medium ${BADGE_COLORS[n.tagColors[i]]}`}>{t}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Timeline */}
        <div className="bg-white border border-[#E2DAD0] rounded-2xl p-5">
          <div className="font-syne text-[11px] font-bold uppercase tracking-widest text-[#B5AA9E] mb-4">
            Recent contributions
          </div>
          <div className="space-y-0">
            {timeline.slice(0, 6).map((t, i) => (
              <div key={i} className="flex gap-3 pb-3">
                <div className="flex flex-col items-center pt-1">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: t.dot }} />
                  {i < timeline.slice(0,6).length - 1 && (
                    <div className="w-px flex-1 bg-[#E2DAD0] mt-1 min-h-[16px]" />
                  )}
                </div>
                <div className="flex-1 pb-1">
                  <div className="text-sm font-medium text-[#1A1612] leading-snug">{t.title}</div>
                  <div className="text-xs text-[#7A6F63] mt-0.5">{t.sub}</div>
                  <div className="text-[11px] text-[#B5AA9E] mt-1">{t.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Impact numbers */}
        <div className="flex flex-col gap-4">
          <div className="font-syne text-[11px] font-bold uppercase tracking-widest text-[#B5AA9E] pb-2 border-b border-[#E2DAD0]">
            Overall platform impact
          </div>
          {stats && (
            <div className="grid grid-cols-2 gap-3">
              {[
                ['Total meals served', (stats.total_meals_donated).toLocaleString(), '#1D7A45'],
                ['Food saved (kg)', Math.round(stats.total_kg_saved).toLocaleString(), '#1A1612'],
                ['CO₂ avoided (kg)', Math.round(stats.co2_avoided).toLocaleString(), '#1A4E8A'],
                ['Active donors', stats.active_listings + 34, '#1A1612'],
              ].map(([l, v, c]) => (
                <div key={l} className="bg-white border border-[#E2DAD0] rounded-xl p-4">
                  <div className="text-[11px] text-[#B5AA9E] uppercase tracking-wider font-medium mb-1">{l}</div>
                  <div className="font-syne text-2xl font-black" style={{ color: c }}>{v}</div>
                </div>
              ))}
            </div>
          )}

          {/* Claimed listings */}
          {claimed.length > 0 && (
            <div className="bg-white border border-[#E2DAD0] rounded-xl p-4">
              <div className="font-syne text-[11px] font-bold uppercase tracking-widest text-[#B5AA9E] mb-3">
                Verified pickups
              </div>
              <div className="space-y-2">
                {claimed.slice(0, 4).map(l => (
                  <div key={l.id} className="flex justify-between items-center text-sm py-1.5 border-b border-[#F0EDE6] last:border-0">
                    <div>
                      <span className="font-medium">{l.food_name}</span>
                      <span className="text-xs text-[#7A6F63] ml-2">{l.donor_name}</span>
                    </div>
                    <span className="text-xs text-[#1D7A45] font-medium">{l.accepted_by}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { foodAPI } from '../api'
import { Spinner } from './UI'

const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']

const DEMAND_DATA = {
  Monday:    [20,35,72,88,90,60,45,55,70,65,50,35,20],
  Tuesday:   [15,28,65,80,75,55,40,48,65,70,60,42,18],
  Wednesday: [18,32,68,85,82,58,42,52,68,72,58,38,16],
  Thursday:  [22,40,78,92,95,65,50,60,85,90,78,55,28],
  Friday:    [25,42,80,95,98,68,52,62,88,95,98,72,35],
  Saturday:  [30,48,85,98,100,72,58,68,90,98,100,80,42],
  Sunday:    [28,45,82,92,88,65,55,65,85,90,88,70,38],
}

const HOURS = ['10A','11A','12P','1P','2P','3P','4P','5P','6P','7P','8P','9P','10P']
const NOW_IDX = new Date().getHours() - 10

export default function Predict({ user }) {
  const [day, setDay]         = useState(DAYS[new Date().getDay()])
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(false)
  const [chartKey, setChartKey] = useState('all')
  const [shareData, setShareData] = useState(false)
  const [restaurantName, setRestaurantName] = useState('')
  const [cuisine, setCuisine] = useState('')
  const [menuInput, setMenuInput] = useState('')
  const [festival, setFestival] = useState('')
  const [covers, setCovers] = useState('')
  const [customParams, setCustomParams] = useState(null)

  const load = async (d, params = {}) => {
    setLoading(true)
    try {
      const query = Object.fromEntries(Object.entries(params || {}).filter(([_, value]) => value !== undefined && value !== ''))
      if (user?.role === 'donor' && !menuInput && !query.menu) {
        query.donor_name = user.name
      }
      const r = await foodAPI.predict(d, query)
      setData(r.data)
    } catch {
      setData(null)
    }
    setLoading(false)
  }

  useEffect(() => {
    load(day, customParams || {})
  }, [day, customParams])

  const selectDay = (d) => { setDay(d); }

  const applyRestaurantData = () => {
    setCustomParams({
      restaurant: restaurantName,
      cuisine,
      menu: menuInput,
      festival,
      covers: covers ? Number(covers) : undefined,
    })
    setShareData(true)
  }

  const barData = DEMAND_DATA[day] || DEMAND_DATA.Friday
  const maxVal  = Math.max(...barData)

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="font-syne text-3xl font-black mb-1">
        AI demand <span className="text-[#1D7A45]">predictor</span>
      </h1>
      <p className="text-sm text-[#7A6F63] mb-6">
        Based on past 12 weeks of data — know what to cook less of before you waste it.
      </p>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr] mb-8">
        <div className="rounded-3xl border border-[#E2DAD0] bg-white p-5">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <div className="text-[11px] uppercase tracking-[0.32em] text-[#7A6F63] font-semibold">Restaurant data</div>
              <div className="text-sm font-semibold text-[#1A1612]">Share your kitchen profile for tailored predictions.</div>
            </div>
            <button onClick={() => setShareData(!shareData)}
              className="rounded-full border border-[#E2DAD0] bg-white px-4 py-2 text-xs font-semibold text-[#1A1612] hover:bg-[#F7F7F5]">
              {shareData ? 'Hide details' : 'Share data'}
            </button>
          </div>

          {shareData ? (
            <div className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <input value={restaurantName} onChange={(e) => setRestaurantName(e.target.value)}
                  placeholder="Restaurant name" className="rounded-2xl border border-[#E2DAD0] bg-[#F7F7F5] px-4 py-3 text-sm text-[#1A1612]" />
                <input value={cuisine} onChange={(e) => setCuisine(e.target.value)}
                  placeholder="Cuisine type" className="rounded-2xl border border-[#E2DAD0] bg-[#F7F7F5] px-4 py-3 text-sm text-[#1A1612]" />
              </div>
              <div className="space-y-3">
                <input value={menuInput} onChange={(e) => setMenuInput(e.target.value)}
                  placeholder="Popular menu items, comma separated"
                  className="w-full rounded-2xl border border-[#E2DAD0] bg-[#F7F7F5] px-4 py-3 text-sm text-[#1A1612]" />
                <div className="grid gap-3 sm:grid-cols-2">
                  <input value={festival} onChange={(e) => setFestival(e.target.value)}
                    placeholder="Festival or event (Diwali, Eid, etc.)"
                    className="rounded-2xl border border-[#E2DAD0] bg-[#F7F7F5] px-4 py-3 text-sm text-[#1A1612]" />
                  <input value={covers} onChange={(e) => setCovers(e.target.value)}
                    placeholder="Estimated covers"
                    type="number"
                    className="rounded-2xl border border-[#E2DAD0] bg-[#F7F7F5] px-4 py-3 text-sm text-[#1A1612]" />
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <button type="button" onClick={applyRestaurantData}
                  className="rounded-2xl bg-[#1D7A45] px-4 py-3 text-sm font-semibold text-white hover:bg-[#155E36] transition">
                  Update tailored insights
                </button>
                <button type="button" onClick={() => setCustomParams(null)}
                  className="rounded-2xl border border-[#E2DAD0] bg-white px-4 py-3 text-sm font-semibold text-[#1A1612] hover:bg-[#F7F7F5] transition">
                  Reset to default
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl bg-[#F7F9F4] p-4 text-sm text-[#4C4B48]">
              Share your menu and festival plan so the predictor can recommend what to make, what may sell out and what may waste.
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-[#E2DAD0] bg-[#E6F5ED] p-5">
          <div className="text-[11px] uppercase tracking-[0.28em] text-[#1D7A45] font-bold mb-3">Tailored preview</div>
          <p className="text-sm text-[#1A1612] leading-relaxed">
            Use your restaurant details to receive menu-specific recommendations for sold-out items, waste risk, and festival cost impact.
          </p>
          <div className="mt-5 space-y-3 text-sm text-[#4C4B48]">
            <div className="rounded-2xl bg-white p-3 border border-[#DDE5DB]">{data?.festival_impact || 'Prediction works without restaurant data too.'}</div>
            <div className="rounded-2xl bg-white p-3 border border-[#DDE5DB]">{data?.cost_impact || 'Add festival and covers to refine cost guidance.'}</div>
          </div>
        </div>
      </div>

      {/* Day selector */}
      <div className="flex gap-2 mb-8">
        {DAYS.map(d => (
          <button key={d} onClick={() => selectDay(d)}
            className={`px-4 py-2 rounded-full text-xs font-medium transition-all border ${
              day === d
                ? 'bg-[#1A1612] text-white border-[#1A1612]'
                : 'bg-white text-[#7A6F63] border-[#E2DAD0] hover:bg-[#F0EDE6]'
            }`}>{d.slice(0,3)}</button>
        ))}
      </div>

      {loading && <Spinner />}

      {data && !loading && (
        <div className="space-y-6">
          {/* AI tip banner */}
          <div className="bg-gradient-to-r from-[#EDE8FA] to-[#E6F5ED] border border-[#C8B8F0] rounded-2xl p-5 flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#EDE8FA] flex items-center justify-center text-xl flex-shrink-0">🧠</div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#5B3FA0] mb-1">AI Insight · {day}</div>
              <p className="text-sm text-[#1A1612] leading-relaxed">{data.tip}</p>
            </div>
          </div>

          {data.donor_insights && (
            <div className="rounded-3xl border border-[#E2DAD0] bg-[#FEF9F2] p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-[#9A5700]/10 flex items-center justify-center text-2xl flex-shrink-0">📊</div>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#9A5700] mb-1">Your donation impact</div>
                  <p className="text-sm text-[#1A1612] leading-relaxed">{data.donor_insights.donor_message}</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-4">
                <div className="rounded-2xl bg-white p-4 border border-[#F0EDE6]">
                  <div className="text-xs text-[#7A6F63] mb-1">Total donated</div>
                  <div className="text-2xl font-black text-[#1A1612]">{data.donor_insights.total_donated}</div>
                  <div className="text-xs text-[#B5AA9E] mt-1">plates</div>
                </div>
                <div className="rounded-2xl bg-white p-4 border border-[#E6F5ED]">
                  <div className="text-xs text-[#7A6F63] mb-1">Claimed & served</div>
                  <div className="text-2xl font-black text-[#1D7A45]">{data.donor_insights.total_claimed}</div>
                  <div className="text-xs text-[#B5AA9E] mt-1">plates</div>
                </div>
                <div className="rounded-2xl bg-white p-4 border border-[#FDEAEA]">
                  <div className="text-xs text-[#7A6F63] mb-1">Unsold (wasted)</div>
                  <div className="text-2xl font-black text-[#B03232]">{data.donor_insights.total_wasted}</div>
                  <div className="text-xs text-[#B5AA9E] mt-1">{data.donor_insights.waste_percentage}% waste</div>
                </div>
                <div className="rounded-2xl bg-white p-4 border border-[#FDEAEA]">
                  <div className="text-xs text-[#7A6F63] mb-1">Cost affected</div>
                  <div className="text-2xl font-black text-[#B03232]">₹{data.donor_insights.waste_cost_affected}</div>
                  <div className="text-xs text-[#B5AA9E] mt-1">CO₂ wasted: {data.donor_insights.co2_wasted} kg</div>
                </div>
              </div>
            </div>
          )}

          <div className="grid gap-4 lg:grid-cols-3 mb-5">
            <div className="rounded-2xl border border-[#E2DAD0] bg-white p-4">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#1D7A45] mb-3">Likely to sell out</div>
              <div className="space-y-2">
                {(data.sold_out || []).map((item, i) => (
                  <div key={i} className="text-sm text-[#1A1612] flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#1D7A45] inline-block" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-[#E2DAD0] bg-white p-4">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#B03232] mb-3">Waste risk</div>
              <div className="space-y-2">
                {(data.waste_risk || []).map((item, i) => (
                  <div key={i} className="text-sm text-[#1A1612] flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#B03232] inline-block" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-[#E2DAD0] bg-white p-4">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#5B3FA0] mb-3">Festival & cost</div>
              <div className="space-y-3 text-sm text-[#4C4B48]">
                <div>{data.festival_impact}</div>
                <div>{data.cost_impact}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-5">
            {/* Hourly chart */}
            <div className="col-span-2 bg-white border border-[#E2DAD0] rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="font-syne text-sm font-bold uppercase tracking-wider text-[#B5AA9E]">
                  Demand forecast · {day}
                </div>
                <div className="flex gap-2">
                  {['all','high','low'].map(k => (
                    <button key={k} onClick={() => setChartKey(k)}
                      className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                        chartKey === k ? 'bg-[#1A1612] text-white border-[#1A1612]' : 'bg-white text-[#7A6F63] border-[#E2DAD0]'
                      }`}>{k === 'all' ? 'All items' : k === 'high' ? '🔥 High demand' : '⬇ Low demand'}</button>
                  ))}
                </div>
              </div>

              <div className="flex items-end gap-1.5 h-32 mb-3">
                {barData.map((v, i) => {
                  const pct = Math.round((v / maxVal) * 100)
                  const isNow = i === NOW_IDX
                  const isPast = i < NOW_IDX
                  const showLow = chartKey === 'low' && v < 55
                  const showHigh = chartKey === 'high' && v >= 75
                  const show = chartKey === 'all' || showLow || showHigh
                  return (
                    <div key={i} className="flex flex-col items-center gap-1 flex-1">
                      <div className="w-full rounded-t-sm transition-all duration-500 relative"
                        style={{
                          height: show ? `${pct}%` : '4%',
                          background: isNow ? '#5B3FA0'
                            : isPast ? 'rgba(29,122,69,0.3)'
                            : v >= 80 ? '#1D7A45'
                            : v >= 55 ? '#9A5700'
                            : '#B03232',
                          opacity: show ? 1 : 0.15,
                          minHeight: '4px',
                        }}>
                        {isNow && <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-bold text-[#5B3FA0] whitespace-nowrap">Now</span>}
                      </div>
                      <span className="text-[9px] text-[#B5AA9E] font-medium">{HOURS[i]}</span>
                    </div>
                  )
                })}
              </div>

              <div className="flex gap-4 text-[10px] text-[#7A6F63]">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-[#1D7A45] inline-block"/>High demand</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-[#9A5700] inline-block"/>Medium</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-[#B03232] inline-block"/>Low / Waste risk</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-[#5B3FA0] inline-block"/>Now</span>
              </div>
            </div>

            {/* High/Low panels */}
            <div className="flex flex-col gap-3">
              <div className="bg-[#E6F5ED] border border-[#C2E8D0] rounded-2xl p-4">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#1D7A45] mb-2">🔥 Make more of</div>
                <div className="space-y-1.5">
                  {data.high_demand.map(item => (
                    <div key={item} className="flex items-center gap-2 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1D7A45] flex-shrink-0"/>
                      <span className="font-medium text-[#1A1612]">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#FDEAEA] border border-[#EDBBBB] rounded-2xl p-4">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#B03232] mb-2">⬇ Cut back on</div>
                <div className="space-y-1.5">
                  {data.low_demand.map(item => (
                    <div key={item} className="flex items-center gap-2 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#B03232] flex-shrink-0"/>
                      <span className="font-medium text-[#1A1612]">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Reduce suggestions from real data */}
          {data.reduce_items?.length > 0 && (
            <div className="bg-white border border-[#E2DAD0] rounded-2xl p-5">
              <div className="font-syne text-sm font-bold uppercase tracking-wider text-[#B5AA9E] mb-4">
                Specific items to reduce today (from your listings)
              </div>
              <div className="grid grid-cols-3 gap-3">
                {data.reduce_items.map((item, i) => (
                  <div key={i} className="bg-[#FEF2DC] border border-[#F0D8A0] rounded-xl p-4">
                    <div className="font-syne font-bold text-sm text-[#1A1612]">{item.food}</div>
                    <div className="text-xs text-[#7A6F63] mt-0.5">{item.donor}</div>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-[#7A6F63]">{item.quantity} plates listed</span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#FDEAEA] text-[#B03232] border border-[#EDBBBB]">
                        Reduce {item.reduce_by}
                      </span>
                    </div>
                    <div className="mt-2 h-1.5 bg-[#F0EDE6] rounded-full overflow-hidden">
                      <div className="h-full bg-[#9A5700] rounded-full" style={{width:'70%'}}/>
                    </div>
                    <div className="text-[10px] text-[#9A5700] mt-1">Consistently unsold on {day}s</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action plan */}
          <div className="bg-white border border-[#E2DAD0] rounded-2xl p-5">
            <div className="font-syne text-sm font-bold uppercase tracking-wider text-[#B5AA9E] mb-4">
              Tonight's action plan
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon:'🍛', title:`Make 15% more ${data.high_demand[0]}`, body:`Demand peaks 8–10 PM on ${day}s. You ran out early last 3 weeks.`, bg:'#E6F5ED', border:'#C2E8D0', tc:'#1D7A45' },
                { icon:'⬇', title:`Reduce ${data.low_demand[0]} prep`, body:`Consistently oversupplied on ${day}s. List excess early for NGO pickup.`, bg:'#FDEAEA', border:'#EDBBBB', tc:'#B03232' },
                { icon:'⏰', title:'Cut prep batches after 9:30 PM', body:'Footfall drops 60% after 9:30. Smaller batches = zero end-of-night waste.', bg:'#FEF2DC', border:'#F0D8A0', tc:'#9A5700' },
                { icon:'📊', title:'List surplus at 9 PM sharp', body:'NGOs have max availability 9–10 PM. Early listing = guaranteed pickup.', bg:'#EDE8FA', border:'#C8B8F0', tc:'#5B3FA0' },
              ].map((r, i) => (
                <div key={i} className="rounded-xl p-4 border" style={{ background: r.bg, borderColor: r.border }}>
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0"
                      style={{ background: 'rgba(255,255,255,0.6)' }}>{r.icon}</div>
                    <div>
                      <div className="text-sm font-medium text-[#1A1612]" style={{ color: r.tc }}>{r.title}</div>
                      <div className="text-xs text-[#7A6F63] mt-1 leading-relaxed">{r.body}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

"use client";
import { useState, useEffect, useCallback } from "react";

type Doctor  = { id: string; name: string; initials: string };
type DayData = {
  available: string[];
  booked: string[];
  blocked: string[];
  bookingDetails?: Record<string, { patientName: string; sessionType: string; patientType: string }>;
};
type WeekData = Record<string, DayData>;

const TIMES = ["9:00 AM","10:30 AM","12:00 PM","1:30 PM","3:00 PM","4:30 PM"];
const DAY_ABBR   = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const MONTH_ABBR = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function fmt(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}
function getMonday(d: Date) {
  const day = d.getDay();
  const m   = new Date(d);
  m.setDate(d.getDate() - (day === 0 ? 6 : day - 1));
  m.setHours(0,0,0,0);
  return m;
}
function weekDates(mon: Date): Date[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(mon);
    d.setDate(mon.getDate() + i);
    return d;
  });
}

export default function SlotsClient({ doctors }: { doctors: Doctor[] }) {
  const [doctorId,  setDoctorId ] = useState(doctors[0]?.id ?? "");
  const [weekStart, setWeekStart] = useState(() => getMonday(new Date()));
  const [weekData,  setWeekData ] = useState<WeekData>({});
  const [loading,   setLoading  ] = useState(false);
  const [toggling,  setToggling ] = useState<string | null>(null);

  const days  = weekDates(weekStart);
  const today = fmt(new Date());

  const loadWeek = useCallback(async (docId: string, ws: Date) => {
    setLoading(true);
    const results = await Promise.all(
      weekDates(ws).map(d =>
        fetch(`/api/bookings?doctorId=${docId}&date=${fmt(d)}`)
          .then(r => r.json())
          .then(data => ({ date: fmt(d), data }))
          .catch(() => ({ date: fmt(d), data: { available:[], booked:[], blocked:[] } }))
      )
    );
    const map: WeekData = {};
    results.forEach(({ date, data }) => { map[date] = data; });
    setWeekData(map);
    setLoading(false);
  }, []);

  useEffect(() => { loadWeek(doctorId, weekStart); }, [doctorId, weekStart, loadWeek]);

  async function toggleSlot(date: string, time: string) {
    const key       = `${date}|${time}`;
    const isBlocked = weekData[date]?.blocked?.includes(time);
    setToggling(key);
    await fetch("/api/slots", {
      method: isBlocked ? "DELETE" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ doctorId, date, time, reason: "blocked" }),
    });
    const fresh = await fetch(`/api/bookings?doctorId=${doctorId}&date=${date}`).then(r => r.json());
    setWeekData(p => ({ ...p, [date]: fresh }));
    setToggling(null);
  }

  async function blockDay(date: string) {
    const label = new Date(date+"T12:00:00").toLocaleDateString("en-US",{weekday:"long",month:"short",day:"numeric"});
    if (!confirm(`Block all available slots on ${label}?`)) return;
    const toBlock = TIMES.filter(t => !weekData[date]?.booked?.includes(t) && !weekData[date]?.blocked?.includes(t));
    await Promise.all(toBlock.map(t => fetch("/api/slots",{ method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({doctorId,date,time:t,reason:"holiday"}) })));
    const fresh = await fetch(`/api/bookings?doctorId=${doctorId}&date=${date}`).then(r => r.json());
    setWeekData(p => ({ ...p, [date]: fresh }));
  }

  async function clearDay(date: string) {
    const label = new Date(date+"T12:00:00").toLocaleDateString("en-US",{weekday:"long",month:"short",day:"numeric"});
    if (!confirm(`Unblock all blocked slots on ${label}?`)) return;
    const toUnblock = weekData[date]?.blocked ?? [];
    await Promise.all(toUnblock.map(t => fetch("/api/slots",{ method:"DELETE", headers:{"Content-Type":"application/json"}, body:JSON.stringify({doctorId,date,time:t}) })));
    const fresh = await fetch(`/api/bookings?doctorId=${doctorId}&date=${date}`).then(r => r.json());
    setWeekData(p => ({ ...p, [date]: fresh }));
  }

  function shiftWeek(n: number) {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + n * 7);
    setWeekStart(d);
  }

  const weekEnd  = days[6];
  const sameMon  = weekStart.getMonth() === weekEnd.getMonth();
  const weekLabel = `${MONTH_ABBR[weekStart.getMonth()]} ${weekStart.getDate()} – ${sameMon ? "" : MONTH_ABBR[weekEnd.getMonth()]+" "}${weekEnd.getDate()}, ${weekEnd.getFullYear()}`;

  const totalAvail   = days.reduce((s,d) => s + (weekData[fmt(d)]?.available?.length ?? 0), 0);
  const totalBooked  = days.reduce((s,d) => s + (weekData[fmt(d)]?.booked?.length  ?? 0), 0);
  const totalBlocked = days.reduce((s,d) => s + (weekData[fmt(d)]?.blocked?.length ?? 0), 0);

  return (
    <div>
      {/* Doctor tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {doctors.map(d => (
          <button key={d.id} onClick={() => setDoctorId(d.id)}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
              doctorId === d.id
                ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-600"
            }`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
              doctorId === d.id ? "bg-white/20" : "bg-blue-100 text-blue-700"
            }`}>{d.initials}</div>
            {d.name}
          </button>
        ))}
      </div>

      {/* Weekly summary stats */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        {[
          { label:"Available", value:totalAvail,   dot:"bg-emerald-500", bg:"bg-emerald-50 border-emerald-100 text-emerald-800" },
          { label:"Booked",    value:totalBooked,  dot:"bg-blue-500",    bg:"bg-blue-50 border-blue-100 text-blue-800" },
          { label:"Blocked",   value:totalBlocked, dot:"bg-red-500",     bg:"bg-red-50 border-red-100 text-red-800" },
        ].map(s => (
          <div key={s.label} className={`border rounded-xl px-5 py-3 flex items-center gap-3 ${s.bg}`}>
            <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${s.dot}`}/>
            <div>
              <div className="text-xl font-bold leading-none">{s.value}</div>
              <div className="text-xs font-medium opacity-75 mt-0.5">{s.label} this week</div>
            </div>
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        {/* Week navigator */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-100 bg-slate-50">
          <button onClick={() => shiftWeek(-1)}
            className="w-8 h-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center hover:border-blue-300 hover:text-blue-600 text-slate-500 transition-all">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <div className="text-center">
            <p className="font-semibold text-slate-900 text-sm">{weekLabel}</p>
            {loading && <p className="text-[10px] text-blue-500 mt-0.5 flex items-center justify-center gap-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"/>Updating…
            </p>}
          </div>
          <button onClick={() => shiftWeek(1)}
            className="w-8 h-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center hover:border-blue-300 hover:text-blue-600 text-slate-500 transition-all">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse table-fixed" style={{minWidth:"740px"}}>
            <thead>
              <tr className="border-b border-slate-200">
                {/* Time column header */}
                <th className="w-[90px] px-3 py-3 text-left bg-slate-50 border-r border-slate-100" style={{ width: "90px" }}>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Time</span>
                </th>
                {days.map(d => {
                  const ds      = fmt(d);
                  const isToday = ds === today;
                  const isPast  = ds < today;
                  const day     = weekData[ds];
                  const booked  = day?.booked?.length  ?? 0;
                  const blocked = day?.blocked?.length ?? 0;
                  const avail   = day?.available?.length ?? 0;
                  return (
                    <th key={ds} style={{ width: `calc((100% - 90px) / 7)` }} className={`px-2 py-2.5 text-center border-r last:border-r-0 border-slate-100 ${
                      isToday ? "bg-blue-50" : isPast ? "bg-slate-50/60" : "bg-white"
                    }`}>
                      <div className={`text-[10px] font-bold uppercase tracking-wide mb-1 ${isToday ? "text-blue-600" : "text-slate-400"}`}>
                        {DAY_ABBR[d.getDay()]}
                      </div>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto text-sm font-bold mb-2 ${
                        isToday ? "bg-blue-600 text-white" : isPast ? "text-slate-300" : "text-slate-800"
                      }`}>{d.getDate()}</div>
                      {/* Mini pill stats */}
                      <div className="flex flex-col gap-0.5 items-center">
                        {booked  > 0 && <span className="bg-blue-100 text-blue-700 px-1.5 rounded-full font-semibold text-[9px]">{booked} booked</span>}
                        {blocked > 0 && <span className="bg-red-100 text-red-600 px-1.5 rounded-full font-semibold text-[9px]">{blocked} blocked</span>}
                        {avail   > 0 && <span className="bg-emerald-100 text-emerald-700 px-1.5 rounded-full font-semibold text-[9px]">{avail} open</span>}
                      </div>
                      {/* Day-level block / clear buttons */}
                      {!isPast && (
                        <div className="flex justify-center gap-1 mt-1.5">
                          {avail > 0 && (
                            <button onClick={() => blockDay(ds)}
                              className="text-[9px] font-semibold text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 hover:bg-red-50 px-1.5 py-0.5 rounded transition-colors">
                              Block all
                            </button>
                          )}
                          {blocked > 0 && (
                            <button onClick={() => clearDay(ds)}
                              className="text-[9px] font-semibold text-emerald-600 hover:text-emerald-800 border border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50 px-1.5 py-0.5 rounded transition-colors">
                              Clear
                            </button>
                          )}
                        </div>
                      )}
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody>
              {TIMES.map((time, ti) => (
                <tr key={time} className={`border-b border-slate-50 ${ti % 2 === 1 ? "bg-slate-50/30" : ""}`}>
                  <td className="px-3 py-1.5 bg-slate-50 border-r border-slate-100 text-[10px] font-semibold text-slate-400 whitespace-nowrap" style={{ width: "90px" }}>
                    {time}
                  </td>
                  {days.map(d => {
                    const ds        = fmt(d);
                    const isPast    = ds < today;
                    const isBooked  = weekData[ds]?.booked?.includes(time);
                    const isBlocked = weekData[ds]?.blocked?.includes(time);
                    const key       = `${ds}|${time}`;
                    const isBusy    = toggling === key;

                    let cell = { bg:"", icon:"", title:"", click:false };
                    if (isPast) {
                      cell = { bg:"text-slate-200 cursor-default", icon:"–", title:"Past date", click:false };
                    } else if (isBooked) {
                      cell = { bg:"bg-blue-50 border border-blue-100 text-blue-400 cursor-not-allowed", icon:"●", title:"Patient booked", click:false };
                    } else if (isBlocked) {
                      cell = { bg:"bg-red-50 border border-red-200 text-red-500 hover:bg-red-100 cursor-pointer", icon:"✕", title:"Blocked — click to open", click:true };
                    } else {
                      cell = { bg:"bg-emerald-50 border border-emerald-200 text-emerald-600 hover:bg-emerald-100 cursor-pointer", icon:"✓", title:"Open — click to block", click:true };
                    }

                    return (
                      <td key={ds} className="px-1.5 py-1.5 border-r last:border-r-0 border-slate-100 text-center">
                        <div className="relative group/slot">
                          <button
                            onClick={() => cell.click && toggleSlot(ds, time)}
                            disabled={!cell.click || isBusy}
                            className={`w-full h-7 rounded-md text-[11px] font-bold transition-all ${cell.bg} ${isBusy ? "opacity-40" : ""}`}
                          >
                            {isBusy ? <span className="inline-block w-2 h-2 border-2 border-current border-t-transparent rounded-full animate-spin"/> : cell.icon}
                          </button>
                          {isBooked && weekData[ds]?.bookingDetails?.[time] && (
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 z-20 hidden group-hover/slot:block pointer-events-none">
                              <div className="bg-slate-800 text-white text-[10px] px-2.5 py-1.5 rounded-lg shadow-xl whitespace-nowrap">
                                <div className="font-semibold">{weekData[ds].bookingDetails![time].patientName}</div>
                                <div className="text-slate-300 mt-0.5">{weekData[ds].bookingDetails![time].sessionType}</div>
                                <div className="text-slate-400">{weekData[ds].bookingDetails![time].patientType}</div>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center gap-6 flex-wrap text-[11px] text-slate-500">
          <span className="font-semibold text-slate-600 text-xs">Legend</span>
          {[
            { icon:"✓", bg:"bg-emerald-50 border-emerald-200 text-emerald-600", label:"Open — click to block" },
            { icon:"✕", bg:"bg-red-50 border-red-200 text-red-500",             label:"Blocked — click to open" },
            { icon:"●", bg:"bg-blue-50 border-blue-100 text-blue-400",          label:"Booked — cannot edit" },
            { icon:"–", bg:"text-slate-200",                                     label:"Past date" },
          ].map(({ icon, bg, label }) => (
            <span key={label} className="flex items-center gap-1.5">
              <span className={`w-5 h-5 border rounded text-[10px] font-bold flex items-center justify-center ${bg}`}>{icon}</span>
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

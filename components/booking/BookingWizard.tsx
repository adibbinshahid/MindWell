"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type Doctor = {
  id: string; name: string; title: string; role: string;
  initials: string; rating: number; patientCount: number;
  tags: string; availableDays: string; photoUrl?: string;
};

const TIME_SLOTS = ["9:00 AM","10:30 AM","12:00 PM","1:30 PM","3:00 PM","4:30 PM"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAY_NAMES = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

export default function BookingWizard() {
  const { data: session } = useSession();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [availability, setAvailability] = useState<{ available: string[]; booked: string[] }>({ available: [], booked: [] });
  const [patientType, setPatientType] = useState<"New Patient"|"Returning Patient"|"">("");
  const [sessionType, setSessionType] = useState("In-Person");
  const [notes, setNotes] = useState("");
  const [insurance, setInsurance] = useState("");
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState<{ id: string; doctorName: string; date: string; time: string } | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/doctors").then(r => r.json()).then(setDoctors);
  }, []);

  useEffect(() => {
    if (!selectedDoctor || !selectedDate) return;
    fetch(`/api/bookings?doctorId=${selectedDoctor.id}&date=${selectedDate}`)
      .then(r => r.json())
      .then(data => setAvailability(data));
  }, [selectedDoctor, selectedDate]);

  function fmtDate(d: Date) {
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
  }
  function displayDate(s: string) {
    const d = new Date(s + "T12:00:00");
    return d.toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric",year:"numeric"});
  }

  function renderCalendar() {
    const today = new Date();
    const todayStr = fmtDate(today);
    const firstDay = new Date(calYear, calMonth, 1).getDay();
    const daysInMonth = new Date(calYear, calMonth+1, 0).getDate();
    const cells = [];

    for (let i = 0; i < firstDay; i++) cells.push(<div key={`e${i}`}/>);
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(calYear, calMonth, d);
      const ds = fmtDate(date);
      const isPast = ds < todayStr;
      const isSel = ds === selectedDate;
      const isToday = ds === todayStr;
      cells.push(
        <button
          key={ds} type="button"
          onClick={() => { if (!isPast) { setSelectedDate(ds); setSelectedTime(null); }}}
          className={`w-9 h-9 rounded-full text-sm font-medium mx-auto flex items-center justify-center transition-colors
            ${isPast ? "text-slate-300 cursor-not-allowed" : "cursor-pointer hover:bg-blue-50 hover:text-blue-600"}
            ${isSel ? "bg-blue-600 text-white hover:bg-blue-600 hover:text-white" : ""}
            ${isToday && !isSel ? "text-blue-600 font-bold" : ""}
          `}
        >
          {d}
        </button>
      );
    }
    return cells;
  }

  async function handleSubmit() {
    if (!session) { router.push("/login?callbackUrl=/book"); return; }
    if (!selectedDoctor || !selectedDate || !selectedTime || !patientType) return;
    setSubmitting(true);
    setError("");

    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        doctorId: selectedDoctor.id,
        date: selectedDate,
        time: selectedTime,
        sessionType,
        patientType,
        notes: notes || undefined,
        insurance: insurance || undefined,
      }),
    });
    const data = await res.json();
    setSubmitting(false);

    if (!res.ok) {
      setError(data.error ?? "Booking failed.");
      return;
    }
    setConfirmation({ id: data.id, doctorName: selectedDoctor.name, date: selectedDate, time: selectedTime });
    setStep(5);
  }

  if (confirmation && step === 5) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">✓</div>
        <h2 className="text-2xl font-bold text-green-600 mb-2">Booking Confirmed!</h2>
        <p className="text-slate-600 mb-6">Your appointment has been successfully booked.</p>
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 max-w-sm mx-auto mb-8 text-left">
          <div className="flex justify-between py-2.5 border-b border-slate-100 text-sm"><span className="text-slate-500">Confirmation #</span><strong className="text-blue-600">#{confirmation.id.slice(-6).toUpperCase()}</strong></div>
          <div className="flex justify-between py-2.5 border-b border-slate-100 text-sm"><span className="text-slate-500">Doctor</span><strong>{confirmation.doctorName}</strong></div>
          <div className="flex justify-between py-2.5 border-b border-slate-100 text-sm"><span className="text-slate-500">Date & Time</span><strong>{displayDate(confirmation.date)} at {confirmation.time}</strong></div>
          <div className="flex justify-between py-2.5 text-sm"><span className="text-slate-500">Session Type</span><strong>{sessionType}</strong></div>
        </div>
        <div className="flex gap-3 justify-center flex-wrap">
          <a href="/resources#forms" className="btn btn-primary">Complete Intake Forms</a>
          <a href="/dashboard" className="btn btn-outline">View My Appointments</a>
        </div>
      </div>
    );
  }

  const stepLabels = ["Specialist", "Date & Time", "Details", "Confirm"];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 items-start">
      {/* Mobile progress bar */}
      <div className="lg:hidden card p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Step {step} of 4</p>
          <p className="text-xs text-blue-600 font-semibold">{stepLabels[step-1]}</p>
        </div>
        <div className="flex gap-1.5">
          {[1,2,3,4].map(n=>(
            <div key={n} className={`h-1.5 flex-1 rounded-full transition-colors ${n <= step ? "bg-blue-600" : "bg-slate-200"}`}/>
          ))}
        </div>
        {selectedDoctor && <p className="text-xs text-slate-500 mt-2 truncate">👤 {selectedDoctor.name}{selectedDate ? ` · ${displayDate(selectedDate)}` : ""}{selectedTime ? ` · ${selectedTime}` : ""}</p>}
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:block card p-6 sticky top-24">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Your Booking Progress</p>
        {[
          { n: 1, label: "Choose Specialist", value: selectedDoctor?.name },
          { n: 2, label: "Select Date & Time", value: selectedDate ? `${displayDate(selectedDate)}${selectedTime ? " · "+selectedTime : ""}` : "" },
          { n: 3, label: "Patient Details", value: patientType },
          { n: 4, label: "Confirm Booking", value: "" },
        ].map(({ n, label, value }) => (
          <div key={n} className="flex gap-3 py-3 border-b border-slate-100 last:border-0">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors
              ${n === step ? "bg-blue-600 text-white" : n < step ? "bg-green-500 text-white" : "bg-slate-200 text-slate-500"}`}>
              {n < step ? "✓" : n}
            </div>
            <div className="pt-0.5">
              <div className="text-sm font-medium">{label}</div>
              {value && <div className="text-xs text-blue-600 mt-0.5 truncate max-w-[190px]">{value}</div>}
            </div>
          </div>
        ))}
        <div className="mt-4 p-3.5 bg-blue-50 rounded-xl border border-blue-100 text-sm">
          <p className="font-semibold text-blue-700 mb-1">Need help?</p>
          <p className="text-slate-600 text-xs">Call <strong>(212) 555-0100</strong> and we'll book for you.</p>
        </div>
        <div className="mt-3 p-3.5 bg-red-50 rounded-xl border border-red-100 text-xs text-red-700">
          <strong>🆘 Crisis?</strong> Call <strong>988</strong> — don't wait for an appointment.
        </div>
      </div>

      {/* Main panel */}
      <div className="card p-5 sm:p-8">
        {error && (
          <div className="alert alert-error mb-6 text-sm">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="shrink-0"><path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            {error}
          </div>
        )}

        {/* Step 1 */}
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-bold mb-1">Choose Your Specialist</h2>
            <p className="text-slate-500 mb-6">Select the clinician who best matches your needs.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {doctors.map(doc => {
                const tags: string[] = JSON.parse(doc.tags || "[]");
                const days: string[] = JSON.parse(doc.availableDays || "[]");
                return (
                  <div key={doc.id}
                    onClick={() => setSelectedDoctor(doc)}
                    className={`border-2 rounded-2xl p-5 cursor-pointer transition-all flex gap-4 items-start
                      ${selectedDoctor?.id === doc.id ? "border-blue-600 bg-blue-50" : "border-slate-200 hover:border-blue-300 hover:bg-blue-50"}`}
                  >
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-blue-100 shrink-0">
                      {doc.photoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={doc.photoUrl} alt={doc.name} className="w-full h-full object-cover object-top" />
                      ) : (
                        <div className="w-full h-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
                          {doc.initials}
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 text-sm">{doc.name}</h4>
                      <p className="text-blue-600 text-xs mb-1">{doc.title}</p>
                      <p className="text-xs text-slate-500 mb-2">{tags.slice(0,3).join(" · ")}</p>
                      <p className="text-xs text-green-600 font-medium">● {days.join(", ")}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-end mt-8">
              <button onClick={() => setStep(2)} disabled={!selectedDoctor} className="btn btn-primary">Continue →</button>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div>
            <h2 className="text-2xl font-bold mb-1">Select Date & Time</h2>
            <p className="text-slate-500 mb-6">Green slots are available. Grey slots are already booked.</p>
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Calendar */}
              <div className="shrink-0">
                <div className="flex items-center justify-between mb-4">
                  <button onClick={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(y=>y-1); } else setCalMonth(m=>m-1); }} className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:bg-blue-50 transition-colors">‹</button>
                  <h3 className="font-semibold text-sm">{MONTHS[calMonth]} {calYear}</h3>
                  <button onClick={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(y=>y+1); } else setCalMonth(m=>m+1); }} className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:bg-blue-50 transition-colors">›</button>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center">
                  {DAY_NAMES.map(d => <div key={d} className="text-xs text-slate-400 py-1 font-medium">{d}</div>)}
                  {renderCalendar()}
                </div>
              </div>
              {/* Times */}
              <div className="flex-1">
                {selectedDate ? (
                  <>
                    <h4 className="font-semibold mb-3 text-sm">{displayDate(selectedDate)}</h4>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {TIME_SLOTS.map(t => {
                        const isBooked = availability.booked?.includes(t);
                        const isSel = t === selectedTime;
                        return (
                          <button key={t} type="button"
                            onClick={() => !isBooked && setSelectedTime(t)}
                            className={`py-2 px-2 text-xs font-medium rounded-lg border transition-colors
                              ${isBooked ? "border-slate-200 bg-slate-100 text-slate-300 cursor-not-allowed line-through" : ""}
                              ${isSel ? "bg-blue-600 text-white border-blue-600" : ""}
                              ${!isBooked && !isSel ? "border-slate-200 hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50" : ""}
                            `}
                          >{t}</button>
                        );
                      })}
                    </div>
                    <div className="flex gap-4 mt-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-blue-600 inline-block"></span> Selected</span>
                      <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-slate-100 border border-slate-200 inline-block"></span> Booked</span>
                      <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm border border-slate-200 inline-block"></span> Available</span>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-40 text-slate-400 text-sm">Select a date to see available times.</div>
                )}
              </div>
            </div>
            <div className="flex justify-between mt-8 pt-6 border-t border-slate-200">
              <button onClick={() => setStep(1)} className="btn btn-outline">← Back</button>
              <button onClick={() => setStep(3)} disabled={!selectedDate || !selectedTime} className="btn btn-primary">Continue →</button>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div>
            <h2 className="text-2xl font-bold mb-1">Your Details</h2>
            <p className="text-slate-500 mb-6">Tell us about your visit.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {(["New Patient","Returning Patient"] as const).map(t => (
                <div key={t} onClick={() => setPatientType(t)}
                  className={`border-2 rounded-2xl p-5 cursor-pointer text-center transition-all
                    ${patientType === t ? "border-blue-600 bg-blue-50" : "border-slate-200 hover:border-blue-300"}`}
                >
                  <div className="text-3xl mb-2">{t === "New Patient" ? "🌱" : "🔄"}</div>
                  <h4 className="font-semibold">{t}</h4>
                  <p className="text-xs text-slate-500 mt-1">{t === "New Patient" ? "First visit to MindWell" : "I have visited before"}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Session Type</label>
                <select value={sessionType} onChange={e => setSessionType(e.target.value)} className="form-control">
                  <option>In-Person</option>
                  <option>Telehealth (Video)</option>
                </select>
              </div>
              <div>
                <label className="form-label">Insurance Provider</label>
                <input value={insurance} onChange={e => setInsurance(e.target.value)} className="form-control" placeholder="e.g. Blue Cross, or Self-Pay"/>
              </div>
              <div className="col-span-full">
                <label className="form-label">Reason for Visit <span className="text-slate-400 font-normal">(optional)</span></label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} className="form-control" placeholder="Briefly describe what brings you to MindWell — helps your specialist prepare."/>
              </div>
            </div>

            {!session && (
              <div className="alert alert-info mt-5 text-sm">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="shrink-0"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                You'll need to <a href="/login?callbackUrl=/book" className="font-semibold underline">sign in</a> or <a href="/register" className="font-semibold underline">create an account</a> to confirm your booking.
              </div>
            )}

            <div className="flex justify-between mt-8 pt-6 border-t border-slate-200">
              <button onClick={() => setStep(2)} className="btn btn-outline">← Back</button>
              <button onClick={() => setStep(4)} disabled={!patientType} className="btn btn-primary">Review →</button>
            </div>
          </div>
        )}

        {/* Step 4 */}
        {step === 4 && selectedDoctor && selectedDate && selectedTime && (
          <div>
            <h2 className="text-2xl font-bold mb-1">Confirm Your Booking</h2>
            <p className="text-slate-500 mb-6">Please review before confirming.</p>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-6">
              {[
                ["Doctor", selectedDoctor.name],
                ["Specialty", selectedDoctor.title],
                ["Date & Time", `${displayDate(selectedDate)} at ${selectedTime}`],
                ["Session Type", sessionType],
                ["Patient Type", patientType],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between py-3 border-b border-slate-200 last:border-0 text-sm">
                  <span className="text-slate-500">{label}</span>
                  <strong className="text-slate-900">{value}</strong>
                </div>
              ))}
            </div>

            <div className="alert alert-info mb-5 text-sm">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="shrink-0"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              <div><strong>Next steps:</strong> You'll receive confirmation in your patient dashboard. A reminder will be sent 24 hours before. Cancel or reschedule up to 24 hours in advance.</div>
            </div>

            <div className="flex justify-between pt-6 border-t border-slate-200">
              <button onClick={() => setStep(3)} className="btn btn-outline">← Back</button>
              <button onClick={handleSubmit} disabled={submitting} className="btn btn-primary btn-lg">
                {submitting ? "Confirming…" : "✓ Confirm Appointment"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

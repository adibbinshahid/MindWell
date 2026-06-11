"use client";
import { useEffect, useState, useCallback } from "react";
import ImageUpload from "@/components/admin/ImageUpload";

type DoctorFull = {
  id: string; name: string; title: string; credentials: string;
  bio: string; initials: string; photoUrl: string | null;
  availableDays: string; rating: number;
};
type SiteImage = { key: string; label: string; section: string; value: string };

const SITE_IMAGE_SLOTS: Omit<SiteImage, "value">[] = [
  { key: "hero_main",       label: "Homepage Hero Background",   section: "Homepage" },
  { key: "hero_panel",      label: "Homepage Right Panel Image", section: "Homepage" },
  { key: "about_hero",      label: "About Page Hero",            section: "About" },
  { key: "clinic_exterior", label: "Clinic Exterior Photo",      section: "About" },
  { key: "clinic_interior", label: "Clinic Interior / Waiting",  section: "About" },
  { key: "services_hero",   label: "Services Page Banner",       section: "Services" },
  { key: "contact_map",     label: "Contact Page Map/Photo",     section: "Contact" },
];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// ── Password modal state lives at page level ──────────────────────────────────

function PasswordModal({
  pwModal,
  setPwModal,
  pwInput,
  setPwInput,
  pwError,
  setPwError,
  confirmSave,
}: {
  pwModal: { label: string; action: () => Promise<void> } | null;
  setPwModal: (v: null) => void;
  pwInput: string;
  setPwInput: (v: string) => void;
  pwError: boolean;
  setPwError: (v: boolean) => void;
  confirmSave: () => Promise<void>;
}) {
  if (!pwModal) return null;
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
        <h3 className="font-bold text-lg mb-1">Admin Verification</h3>
        <p className="text-sm text-slate-500 mb-4">
          Enter save password to apply changes to <strong>{pwModal.label}</strong>
        </p>
        <input
          type="password"
          value={pwInput}
          onChange={e => { setPwInput(e.target.value); setPwError(false); }}
          onKeyDown={e => e.key === "Enter" && confirmSave()}
          placeholder="Enter password"
          autoFocus
          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {pwError && <p className="text-red-500 text-xs mb-2">Incorrect password. Try again.</p>}
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => setPwModal(null)}
            className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={confirmSave}
            className="px-4 py-2 text-sm bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
          >
            Confirm Save
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Doctor card ───────────────────────────────────────────────────────────────

function DoctorCard({
  doctor,
  triggerSave,
}: {
  doctor: DoctorFull;
  triggerSave: (label: string, action: () => Promise<void>) => void;
}) {
  const [photoUrl, setPhotoUrl] = useState(doctor.photoUrl ?? "");
  const [name, setName] = useState(doctor.name);
  const [title, setTitle] = useState(doctor.title);
  const [credentials, setCredentials] = useState(doctor.credentials);
  const [bio, setBio] = useState(doctor.bio);
  const [activeDays, setActiveDays] = useState<string[]>(() => {
    try { return JSON.parse(doctor.availableDays || "[]"); } catch { return []; }
  });
  const [photoPreview, setPhotoPreview] = useState(doctor.photoUrl ?? "");
  const [saved, setSaved] = useState(false);

  function toggleDay(day: string) {
    setActiveDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  }

  function handleSave() {
    triggerSave(`Dr. ${name}`, async () => {
      await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctorId: doctor.id,
          photoUrl,
          name,
          title,
          credentials,
          bio,
          availableDays: JSON.stringify(activeDays),
        }),
      });
      setPhotoPreview(photoUrl);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    });
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-4">
      {/* Header row */}
      <div className="flex items-center gap-3">
        <div className="w-14 h-14 rounded-full bg-blue-100 border-2 border-blue-200 overflow-hidden shrink-0 flex items-center justify-center">
          {photoPreview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photoPreview} alt={name} className="w-full h-full object-cover" onError={() => setPhotoPreview("")} />
          ) : (
            <span className="text-blue-700 font-bold text-sm">{doctor.initials}</span>
          )}
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-slate-800 truncate">{name || doctor.name}</p>
          <p className="text-xs text-slate-400">{title || doctor.title}</p>
          <div className="flex items-center gap-1 mt-0.5">
            <svg width="12" height="12" fill="#f59e0b" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            <span className="text-xs text-slate-500">{doctor.rating.toFixed(1)}</span>
          </div>
        </div>
      </div>

      {/* Photo URL */}
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">Photo</label>
        <ImageUpload
          value={photoUrl}
          onChange={v => { setPhotoUrl(v); setPhotoPreview(v); }}
          placeholder="https://images.unsplash.com/…"
          previewClass="w-full h-24 object-cover rounded-lg border border-slate-200 mt-2"
        />
      </div>

      {/* Name + Title */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Title / Specialty</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Credentials */}
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">Credentials</label>
        <input
          type="text"
          value={credentials}
          onChange={e => setCredentials(e.target.value)}
          placeholder="MD, PhD, FACP…"
          className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Bio */}
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">Bio</label>
        <textarea
          value={bio}
          onChange={e => setBio(e.target.value)}
          rows={3}
          className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>

      {/* Available Days */}
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-2">Available Days</label>
        <div className="flex flex-wrap gap-1.5">
          {DAYS.map(day => (
            <button
              key={day}
              type="button"
              onClick={() => toggleDay(day)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all border ${
                activeDays.includes(day)
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-slate-500 border-slate-200 hover:border-blue-300 hover:text-blue-600"
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {/* Save button */}
      <button
        onClick={handleSave}
        className={`w-full py-2 rounded-xl text-sm font-semibold transition-all ${
          saved
            ? "bg-green-50 text-green-700 border border-green-200"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        {saved ? "Saved ✓" : "Save All Changes"}
      </button>
    </div>
  );
}

// ── Site image row ────────────────────────────────────────────────────────────

function ImageRow({
  label,
  imageKey,
  section,
  initialValue,
  triggerSave,
}: {
  label: string;
  imageKey: string;
  section: string;
  initialValue: string;
  triggerSave: (label: string, action: () => Promise<void>) => void;
}) {
  const [url, setUrl] = useState(initialValue);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    triggerSave(label, async () => {
      await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: imageKey, value: url, label, section }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    });
  }

  return (
    <div className="py-4 border-b border-slate-100 last:border-0">
      <p className="text-sm font-medium text-slate-700 mb-2">{label}</p>
      <div className="flex gap-2 items-start">
        <div className="flex-1 min-w-0">
          <ImageUpload
            value={url}
            onChange={v => setUrl(v)}
            placeholder="https://images.unsplash.com/…"
            previewClass="w-full h-20 object-cover rounded-lg border border-slate-200 mt-2"
          />
        </div>
        <button
          onClick={handleSave}
          className={`shrink-0 mt-0.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
            saved ? "bg-green-50 text-green-700 border border-green-200" : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {saved ? "✓" : "Save"}
        </button>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ContentManagementPage() {
  const [doctors, setDoctors] = useState<DoctorFull[]>([]);
  const [siteContent, setSiteContent] = useState<SiteImage[]>([]);
  const [loading, setLoading] = useState(true);

  // Password modal state
  const [pwModal, setPwModal] = useState<{ label: string; action: () => Promise<void> } | null>(null);
  const [pwInput, setPwInput] = useState("");
  const [pwError, setPwError] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch("/api/content");
    if (!res.ok) return;
    const data = await res.json();
    setDoctors(data.doctors ?? []);
    setSiteContent(data.siteContent ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  function triggerSave(label: string, action: () => Promise<void>) {
    setPwModal({ label, action });
    setPwInput("");
    setPwError(false);
  }

  async function confirmSave() {
    if (pwInput !== "2342") { setPwError(true); return; }
    const action = pwModal!.action;
    setPwModal(null);
    await action();
  }

  function getSiteValue(key: string) {
    return siteContent.find(s => s.key === key)?.value ?? "";
  }

  const sections = Array.from(new Set(SITE_IMAGE_SLOTS.map(s => s.section)));

  return (
    <>
      <PasswordModal
        pwModal={pwModal}
        setPwModal={setPwModal}
        pwInput={pwInput}
        setPwInput={setPwInput}
        pwError={pwError}
        setPwError={setPwError}
        confirmSave={confirmSave}
      />

      <header className="bg-white border-b border-slate-200 pl-16 pr-4 lg:px-7 h-16 flex items-center gap-3 sticky top-0 z-10">
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="text-blue-600 shrink-0">
          <rect x="3" y="3" width="18" height="18" rx="2"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <polyline points="21,15 16,10 5,21"/>
        </svg>
        <div className="min-w-0">
          <h1 className="font-semibold text-lg leading-tight">Content Management</h1>
          <p className="text-xs text-slate-400 leading-tight">All saves require password verification</p>
        </div>
      </header>

      <div className="p-4 sm:p-7 max-w-5xl">
        {loading ? (
          <div className="flex items-center gap-2 text-slate-400 text-sm py-10">
            <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin inline-block"/>
            Loading…
          </div>
        ) : (
          <>
            {/* Doctor Profiles */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-1">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="text-blue-600">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
                <h2 className="font-semibold text-slate-800 text-base">Doctor Profiles</h2>
              </div>
              <p className="text-xs text-slate-400 ml-6 mb-4">Edit photo, bio, credentials, and availability for each doctor.</p>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {doctors.map(d => (
                  <DoctorCard key={d.id} doctor={d} triggerSave={triggerSave} />
                ))}
              </div>
            </div>

            {/* Site Images by section */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-1">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="text-blue-600">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21,15 16,10 5,21"/>
                </svg>
                <h2 className="font-semibold text-slate-800 text-base">Site Images</h2>
              </div>
              <p className="text-xs text-slate-400 ml-6 mb-4">Paste public image URLs from Unsplash, Pexels, or any public source.</p>
              <div className="flex flex-col gap-4">
                {sections.map(section => (
                  <div key={section} className="bg-white border border-slate-200 rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">{section}</span>
                    </div>
                    <div>
                      {SITE_IMAGE_SLOTS.filter(s => s.section === section).map(slot => (
                        <ImageRow
                          key={slot.key}
                          imageKey={slot.key}
                          label={slot.label}
                          section={slot.section}
                          initialValue={getSiteValue(slot.key)}
                          triggerSave={triggerSave}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Help note */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-700">
              <strong>How to find free images:</strong> Visit{" "}
              <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer" className="underline">unsplash.com</a> or{" "}
              <a href="https://pexels.com" target="_blank" rel="noopener noreferrer" className="underline">pexels.com</a>,
              right-click any image → "Copy image address" and paste the URL above.
            </div>
          </>
        )}
      </div>
    </>
  );
}

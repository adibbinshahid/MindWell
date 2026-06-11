"use client";
import { useState } from "react";
import Link from "next/link";

const CONDITIONS = [
  {
    category: "Mood Disorders",
    items: [
      { name: "Depression", desc: "Major depressive disorder, persistent depressive disorder, and seasonal affective disorder. Symptoms include persistent sadness, loss of interest, fatigue, and difficulty concentrating.", treatments: ["CBT","Medication","Mindfulness-Based Therapy"] },
      { name: "Bipolar Disorder", desc: "Characterised by extreme shifts in mood, energy, and activity levels — from depressive lows to manic or hypomanic highs.", treatments: ["Mood Stabilisers","CBT","Psychoeducation"] },
      { name: "Dysthymia", desc: "A chronic, low-grade depressive mood lasting two or more years. Often goes unrecognised but significantly impacts quality of life.", treatments: ["CBT","Medication","Talk Therapy"] },
    ],
  },
  {
    category: "Anxiety Disorders",
    items: [
      { name: "Generalised Anxiety Disorder (GAD)", desc: "Excessive, hard-to-control worry about multiple aspects of daily life, accompanied by physical symptoms such as tension, irritability, and sleep disturbance.", treatments: ["CBT","ACT","Medication"] },
      { name: "Panic Disorder", desc: "Recurrent, unexpected panic attacks — sudden surges of intense fear with physical symptoms like pounding heart, shortness of breath, and dizziness.", treatments: ["CBT","Exposure Therapy","SSRI"] },
      { name: "Social Anxiety", desc: "Intense fear of social situations and of being judged negatively by others, leading to avoidance that disrupts work, school, and relationships.", treatments: ["CBT","Exposure Therapy","Medication"] },
      { name: "Specific Phobias", desc: "Intense, irrational fear of a specific object or situation (e.g. heights, needles, animals) that triggers immediate anxiety.", treatments: ["Exposure Therapy","CBT"] },
    ],
  },
  {
    category: "Trauma & Stress",
    items: [
      { name: "PTSD", desc: "Post-Traumatic Stress Disorder develops after experiencing or witnessing traumatic events. Symptoms include flashbacks, nightmares, hypervigilance, and emotional numbness.", treatments: ["EMDR","Trauma-Focused CBT","Medication"] },
      { name: "Acute Stress Reaction", desc: "Short-term distress response following a traumatic event, lasting up to one month. Early intervention can prevent the development of PTSD.", treatments: ["Talk Therapy","Crisis Support","CBT"] },
      { name: "Complex Trauma (C-PTSD)", desc: "Results from prolonged, repeated trauma — often in childhood. Characterised by emotional dysregulation, negative self-concept, and difficulties in relationships.", treatments: ["DBT","EMDR","Schema Therapy"] },
    ],
  },
  {
    category: "Neurodevelopmental",
    items: [
      { name: "ADHD / ADD", desc: "Attention-Deficit/Hyperactivity Disorder involves persistent inattention, hyperactivity, and impulsivity. Affects children and adults, often impacting work and relationships.", treatments: ["Stimulant Medication","CBT","Coaching"] },
      { name: "Autism Spectrum (ASD)", desc: "A developmental condition affecting social communication and characterised by restricted, repetitive behaviours. Severity varies widely across the spectrum.", treatments: ["Social Skills Training","CBT","Support Therapy"] },
    ],
  },
  {
    category: "Obsessive-Compulsive",
    items: [
      { name: "OCD", desc: "Obsessive-Compulsive Disorder involves recurrent, unwanted thoughts (obsessions) and repetitive behaviours (compulsions) performed to reduce anxiety.", treatments: ["ERP","CBT","SSRIs"] },
      { name: "Body Dysmorphic Disorder", desc: "Preoccupation with perceived flaws in appearance that are not noticeable to others. Leads to significant distress and repetitive behaviours.", treatments: ["CBT","ERP","Medication"] },
    ],
  },
  {
    category: "Eating & Body",
    items: [
      { name: "Anorexia Nervosa", desc: "Restriction of food intake, intense fear of gaining weight, and distorted body image. A serious condition requiring specialised, multidisciplinary care.", treatments: ["FBT","CBT","Nutritional Support"] },
      { name: "Bulimia Nervosa", desc: "Cycles of binge eating followed by purging behaviours. Often accompanied by feelings of shame and a distorted relationship with food.", treatments: ["CBT","DBT","Medication"] },
      { name: "Binge Eating Disorder", desc: "Recurrent episodes of eating large amounts of food rapidly and without physical hunger, followed by distress but not purging.", treatments: ["CBT","DBT","Mindfulness"] },
    ],
  },
];

export default function ConditionsPage() {
  const [active, setActive] = useState<string | null>(null);
  const [filter, setFilter] = useState("All");

  const CATEGORY_ICONS: Record<string, JSX.Element> = {
    "Mood Disorders": (
      <div className="w-9 h-9 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
        </svg>
      </div>
    ),
    "Anxiety Disorders": (
      <div className="w-9 h-9 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
          <polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2"/>
        </svg>
      </div>
    ),
    "Trauma & Stress": (
      <div className="w-9 h-9 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
      </div>
    ),
    "Neurodevelopmental": (
      <div className="w-9 h-9 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
          <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
        </svg>
      </div>
    ),
    "Obsessive-Compulsive": (
      <div className="w-9 h-9 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
          <polyline points="23,4 23,11 16,11"/>
          <polyline points="1,20 1,13 8,13"/>
          <path d="M3.51 9a9 9 0 0114.85-3.36L23 11M1 13l4.64 4.36A9 9 0 0020.49 15"/>
        </svg>
      </div>
    ),
    "Eating & Body": (
      <div className="w-9 h-9 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
        </svg>
      </div>
    ),
  };

  const shown = filter === "All" ? CONDITIONS : CONDITIONS.filter(c => c.category === filter);

  return (
    <>
      <div className="page-hero">
        <div className="max-w-6xl mx-auto px-6">
          <h1>Conditions We Treat</h1>
          <p>We provide evidence-based care for a wide range of mental health conditions. Select a condition to learn more.</p>
        </div>
      </div>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap mb-10">
            {["All", ...CONDITIONS.map(c=>c.category)].map(cat=>(
              <button key={cat} onClick={()=>setFilter(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                  filter===cat ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-600 border-slate-200 hover:border-blue-300"
                }`}>
                {cat}
              </button>
            ))}
          </div>

          {shown.map(group=>(
            <div key={group.category} className="mb-12">
              <div className="flex items-center gap-3 mb-5">
                {CATEGORY_ICONS[group.category] ?? null}
                <h2 className="text-xl font-bold">{group.category}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {group.items.map(item=>(
                  <button key={item.name} onClick={()=>setActive(active===item.name ? null : item.name)}
                    className="card p-5 text-left cursor-pointer hover:border-blue-300 hover:shadow-md transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-slate-900 text-sm">{item.name}</h3>
                      <span className="text-slate-400 text-lg">{active===item.name ? "−" : "+"}</span>
                    </div>
                    {active===item.name && (
                      <div className="mt-3 border-t border-slate-100 pt-3">
                        <p className="text-slate-600 text-xs leading-relaxed mb-3">{item.desc}</p>
                        <div className="flex gap-1.5 flex-wrap">
                          {item.treatments.map(t=>(
                            <span key={t} className="bg-blue-50 text-blue-600 text-xs px-2.5 py-1 rounded-full font-medium">{t}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* CTA */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-10 text-center text-white mt-6">
            <h2 className="text-2xl font-bold mb-3">Don't see your condition listed?</h2>
            <p className="text-blue-100 mb-7 max-w-xl mx-auto">Our specialists work with many conditions not listed here. Contact us or book a consultation to discuss your specific needs.</p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/book" className="btn btn-white">Book a Consultation</Link>
              <Link href="/contact" className="btn border-2 border-white/40 text-white hover:bg-white/10">Contact Us</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

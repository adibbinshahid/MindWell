import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Admin user
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@mindwellclinic.com";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "Admin@Mindwell2024";

  const hashedAdminPw = await bcrypt.hash(adminPassword, 12);
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { password: hashedAdminPw },
    create: {
      email: adminEmail,
      password: hashedAdminPw,
      firstName: "Admin",
      lastName: "MindWell",
      role: "ADMIN",
    },
  });

  // Demo patient
  await prisma.user.upsert({
    where: { email: "patient@demo.com" },
    update: {},
    create: {
      email: "patient@demo.com",
      password: await bcrypt.hash("Patient@123", 12),
      firstName: "Jane",
      lastName: "Smith",
      phone: "(212) 555-0200",
      role: "PATIENT",
    },
  });

  // Doctors
  const doctors = [
    {
      id: "doctor_1",
      name: "Dr. Sarah Mitchell",
      photoUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&h=600&fit=crop&crop=face",
      title: "Clinical Psychologist, PhD",
      role: "Psychologist",
      initials: "SM",
      credentials: "PhD, Columbia University",
      bio: "Dr. Mitchell specialises in cognitive-behavioural therapy (CBT) for anxiety, depression, and trauma. She completed her PhD at Columbia University and has 12 years of clinical experience.",
      languages: JSON.stringify(["English", "Spanish"]),
      specialties: JSON.stringify(["Anxiety", "Depression", "CBT", "Trauma", "OCD"]),
      tags: JSON.stringify(["Anxiety", "Depression", "CBT", "Trauma"]),
      availableDays: JSON.stringify(["Mon", "Wed", "Fri"]),
      rating: 4.9,
      patientCount: 200,
    },
    {
      id: "doctor_2",
      name: "Dr. James Okafor",
      photoUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&h=600&fit=crop&crop=face",
      title: "Psychiatrist, MD",
      role: "Psychiatrist",
      initials: "JO",
      credentials: "MD, Johns Hopkins",
      bio: "Dr. Okafor is a board-certified psychiatrist specialising in medication management for ADHD, bipolar disorder, and schizophrenia. He trained at Johns Hopkins and brings 14 years of experience.",
      languages: JSON.stringify(["English", "French"]),
      specialties: JSON.stringify(["ADHD", "Bipolar", "Medication Management", "Schizophrenia"]),
      tags: JSON.stringify(["ADHD", "Bipolar", "Medication"]),
      availableDays: JSON.stringify(["Tue", "Thu", "Sat"]),
      rating: 4.8,
      patientCount: 150,
    },
    {
      id: "doctor_3",
      name: "Dr. Priya Nair",
      photoUrl: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=600&h=600&fit=crop&crop=face",
      title: "Psychologist, PsyD",
      role: "Psychologist",
      initials: "PN",
      credentials: "PsyD, NYU",
      bio: "Dr. Nair specialises in trauma-informed therapy, PTSD, and couples counselling using DBT and EMDR techniques. She earned her PsyD from NYU and has worked extensively with survivors of complex trauma.",
      languages: JSON.stringify(["English", "Hindi"]),
      specialties: JSON.stringify(["PTSD", "Trauma", "Couples", "DBT", "EMDR"]),
      tags: JSON.stringify(["PTSD", "Trauma", "Couples", "DBT"]),
      availableDays: JSON.stringify(["Mon", "Tue", "Wed", "Thu", "Fri"]),
      rating: 5.0,
      patientCount: 180,
    },
    {
      id: "doctor_4",
      name: "Dr. Alex Turner",
      photoUrl: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=600&h=600&fit=crop&crop=face",
      title: "Psychiatrist, MD",
      role: "Psychiatrist",
      initials: "AT",
      credentials: "MD, Yale School of Medicine",
      bio: "Dr. Turner is a psychiatrist with a focus on mood disorders, OCD, and adolescent psychiatry. He trained at Yale School of Medicine and specialises in integrative approaches.",
      languages: JSON.stringify(["English"]),
      specialties: JSON.stringify(["OCD", "Mood Disorders", "Adolescents", "Bipolar"]),
      tags: JSON.stringify(["OCD", "Mood Disorders", "Adolescents"]),
      availableDays: JSON.stringify(["Wed", "Fri"]),
      rating: 4.9,
      patientCount: 120,
    },
  ];

  for (const doc of doctors) {
    await prisma.doctor.upsert({
      where: { id: doc.id },
      update: doc,
      create: doc,
    });
  }

  // Blog posts
  const posts = [
    {
      title: "5 Coping Strategies for Managing Anxiety",
      slug: "5-coping-strategies-anxiety",
      category: "Anxiety",
      excerpt: "Practical, evidence-based techniques to help you manage anxiety in daily life — from breathing exercises to cognitive reframing.",
      body: `<p>Anxiety affects millions of people, but there are effective, evidence-based strategies you can start using today.</p><h3>1. Diaphragmatic Breathing</h3><p>Slow, deep belly breathing activates the parasympathetic nervous system. Try breathing in for 4 counts, holding for 4, and exhaling for 6.</p><h3>2. Cognitive Reframing</h3><p>Anxiety often involves catastrophic thinking. CBT teaches us to challenge these thoughts: "What's the evidence? What's the most likely outcome?"</p><h3>3. Grounding Techniques</h3><p>The 5-4-3-2-1 technique brings you into the present moment: name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, 1 you can taste.</p><h3>4. Progressive Muscle Relaxation</h3><p>Systematically tensing and releasing muscle groups reduces physical tension that anxiety builds up in the body.</p><h3>5. Scheduled Worry Time</h3><p>Set 15 minutes aside to write your worries. Outside that time, remind yourself: "I'll think about this during worry time."</p>`,
      author: "Dr. Sarah Mitchell",
      published: true,
    },
    {
      title: "Understanding Depression: More Than Just Sadness",
      slug: "understanding-depression",
      category: "Depression",
      excerpt: "A closer look at what depression really is, why it happens, and how modern treatment can help you feel like yourself again.",
      body: `<p>Depression is one of the most misunderstood mental health conditions. It's often dismissed as "just being sad" — but major depressive disorder is a serious medical condition.</p><h3>What Depression Actually Feels Like</h3><p>Beyond sadness, depression involves pervasive emptiness, loss of interest, cognitive changes, physical symptoms like fatigue, and often a sense that things will never improve.</p><h3>The Biology of Depression</h3><p>Neuroimaging studies show real, measurable changes in the depressed brain — particularly in the prefrontal cortex and amygdala.</p><h3>Treatment Works</h3><p>The combination of CBT and medication has the strongest evidence base. Most patients see significant improvement within 8–12 weeks.</p>`,
      author: "Dr. James Okafor",
      published: true,
    },
    {
      title: "What to Expect at Your First Therapy Session",
      slug: "first-therapy-session",
      category: "General",
      excerpt: "A guide for new patients — what happens in an initial consultation, what to bring, and how to get the most out of it.",
      body: `<p>Taking the step to book your first therapy session is brave. Here's what you can expect.</p><h3>Before You Arrive</h3><p>Complete your intake forms online beforehand. You don't need to prepare a speech — just come as you are.</p><h3>The First 10 Minutes</h3><p>Your therapist will introduce themselves, explain confidentiality, and describe how sessions typically work.</p><h3>The Main Session</h3><p>Your therapist will ask about your current concerns, history, and goals. You don't have to share everything at once.</p>`,
      author: "Dr. Priya Nair",
      published: true,
    },
    {
      title: "The Science Behind CBT: How It Rewires Your Brain",
      slug: "science-behind-cbt",
      category: "Therapy",
      excerpt: "Cognitive Behavioural Therapy is one of the most researched treatments in psychology. Here's why it works.",
      body: `<p>CBT is built on a simple but powerful insight: the way we think shapes the way we feel and behave.</p><h3>The Cognitive Triangle</h3><p>Thoughts, feelings, and behaviours are all interconnected. A negative thought creates a negative feeling which drives unhelpful behaviour. CBT intervenes at the thought level.</p><h3>What the Research Shows</h3><p>Over 400 meta-analyses support CBT for anxiety, depression, OCD, PTSD, and more.</p>`,
      author: "Dr. Sarah Mitchell",
      published: true,
    },
  ];

  for (const post of posts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: post,
      create: post,
    });
  }

  // Hero image
  await prisma.siteContent.upsert({
    where: { key: "hero_main" },
    update: {},
    create: {
      key: "hero_main",
      value: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1920&h=1080&fit=crop",
      label: "Homepage Hero Background",
      section: "Homepage",
    },
  });

  // Demo patients
  const patientHash = await bcrypt.hash("Patient@123", 12);
  const demoPatients = [
    { email: "alice.johnson@email.com", firstName: "Alice", lastName: "Johnson", phone: "(212) 555-0101" },
    { email: "brian.tucker@email.com", firstName: "Brian", lastName: "Tucker", phone: "(212) 555-0102" },
    { email: "carmen.reyes@email.com", firstName: "Carmen", lastName: "Reyes", phone: "(212) 555-0103" },
    { email: "david.kim@email.com", firstName: "David", lastName: "Kim", phone: "(212) 555-0104" },
    { email: "elena.morris@email.com", firstName: "Elena", lastName: "Morris", phone: "(212) 555-0105" },
    { email: "frank.nguyen@email.com", firstName: "Frank", lastName: "Nguyen", phone: "(212) 555-0106" },
    { email: "grace.patel@email.com", firstName: "Grace", lastName: "Patel", phone: "(212) 555-0107" },
    { email: "henry.walker@email.com", firstName: "Henry", lastName: "Walker", phone: "(212) 555-0108" },
    { email: "isabelle.chen@email.com", firstName: "Isabelle", lastName: "Chen", phone: "(212) 555-0109" },
    { email: "james.okonkwo@email.com", firstName: "James", lastName: "Okonkwo", phone: "(212) 555-0110" },
  ];

  const userIdMap = new Map<string, string>();

  for (const p of demoPatients) {
    const u = await prisma.user.upsert({
      where: { email: p.email },
      update: {},
      create: { email: p.email, password: patientHash, firstName: p.firstName, lastName: p.lastName, phone: p.phone, role: "PATIENT" },
    });
    userIdMap.set(p.email, u.id);
  }

  // Also grab patient@demo.com userId
  const demoPatientUser = await prisma.user.findUnique({ where: { email: "patient@demo.com" } });
  if (demoPatientUser) userIdMap.set("patient@demo.com", demoPatientUser.id);

  // 40 appointments
  const apptEmails = [
    "patient@demo.com",
    "alice.johnson@email.com",
    "brian.tucker@email.com",
    "carmen.reyes@email.com",
    "david.kim@email.com",
    "elena.morris@email.com",
    "frank.nguyen@email.com",
    "grace.patel@email.com",
    "henry.walker@email.com",
    "isabelle.chen@email.com",
    "james.okonkwo@email.com",
  ];
  const times = ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"];
  const sessionTypes = ["In-Person", "Telehealth (Video)"];
  const patientTypes = ["New Patient", "Returning Patient"];
  const appointments = [
    { id: "appt_01", email: "patient@demo.com",           doctorId: "doctor_1", date: "2026-04-03", time: "9:00 AM",  sessionType: "In-Person",           patientType: "New Patient",       status: "COMPLETED" },
    { id: "appt_02", email: "alice.johnson@email.com",    doctorId: "doctor_2", date: "2026-04-07", time: "10:30 AM", sessionType: "Telehealth (Video)",   patientType: "New Patient",       status: "COMPLETED" },
    { id: "appt_03", email: "brian.tucker@email.com",     doctorId: "doctor_3", date: "2026-04-10", time: "10:30 AM", sessionType: "In-Person",           patientType: "Returning Patient", status: "COMPLETED" },
    { id: "appt_04", email: "carmen.reyes@email.com",     doctorId: "doctor_4", date: "2026-04-15", time: "1:30 PM",  sessionType: "Telehealth (Video)",   patientType: "New Patient",       status: "COMPLETED" },
    { id: "appt_05", email: "david.kim@email.com",        doctorId: "doctor_1", date: "2026-04-18", time: "3:00 PM",  sessionType: "In-Person",           patientType: "Returning Patient", status: "COMPLETED" },
    { id: "appt_06", email: "elena.morris@email.com",     doctorId: "doctor_2", date: "2026-04-22", time: "3:00 PM",  sessionType: "Telehealth (Video)",   patientType: "New Patient",       status: "CANCELLED" },
    { id: "appt_07", email: "frank.nguyen@email.com",     doctorId: "doctor_3", date: "2026-04-25", time: "4:30 PM",  sessionType: "In-Person",           patientType: "Returning Patient", status: "CANCELLED" },
    { id: "appt_08", email: "grace.patel@email.com",      doctorId: "doctor_4", date: "2026-04-29", time: "9:00 AM",  sessionType: "In-Person",           patientType: "New Patient",       status: "COMPLETED" },
    { id: "appt_09", email: "henry.walker@email.com",     doctorId: "doctor_1", date: "2026-05-02", time: "10:30 AM", sessionType: "Telehealth (Video)",   patientType: "Returning Patient", status: "CANCELLED" },
    { id: "appt_10", email: "isabelle.chen@email.com",    doctorId: "doctor_2", date: "2026-05-06", time: "10:30 AM", sessionType: "In-Person",           patientType: "New Patient",       status: "COMPLETED" },
    { id: "appt_11", email: "james.okonkwo@email.com",    doctorId: "doctor_3", date: "2026-05-09", time: "1:30 PM",  sessionType: "Telehealth (Video)",   patientType: "Returning Patient", status: "COMPLETED" },
    { id: "appt_12", email: "patient@demo.com",           doctorId: "doctor_4", date: "2026-05-13", time: "3:00 PM",  sessionType: "In-Person",           patientType: "Returning Patient", status: "COMPLETED" },
    { id: "appt_13", email: "alice.johnson@email.com",    doctorId: "doctor_1", date: "2026-05-16", time: "3:00 PM",  sessionType: "Telehealth (Video)",   patientType: "New Patient",       status: "CANCELLED" },
    { id: "appt_14", email: "brian.tucker@email.com",     doctorId: "doctor_2", date: "2026-05-20", time: "4:30 PM",  sessionType: "In-Person",           patientType: "Returning Patient", status: "CANCELLED" },
    { id: "appt_15", email: "carmen.reyes@email.com",     doctorId: "doctor_3", date: "2026-05-23", time: "9:00 AM",  sessionType: "In-Person",           patientType: "New Patient",       status: "COMPLETED" },
    { id: "appt_16", email: "david.kim@email.com",        doctorId: "doctor_4", date: "2026-05-27", time: "10:30 AM", sessionType: "Telehealth (Video)",   patientType: "Returning Patient", status: "CANCELLED" },
    { id: "appt_17", email: "elena.morris@email.com",     doctorId: "doctor_1", date: "2026-05-30", time: "12:00 PM", sessionType: "In-Person",           patientType: "New Patient",       status: "COMPLETED" },
    { id: "appt_18", email: "frank.nguyen@email.com",     doctorId: "doctor_2", date: "2026-06-03", time: "1:30 PM",  sessionType: "Telehealth (Video)",   patientType: "Returning Patient", status: "CANCELLED" },
    { id: "appt_19", email: "grace.patel@email.com",      doctorId: "doctor_3", date: "2026-06-05", time: "3:00 PM",  sessionType: "In-Person",           patientType: "New Patient",       status: "CANCELLED" },
    { id: "appt_20", email: "henry.walker@email.com",     doctorId: "doctor_4", date: "2026-06-09", time: "3:00 PM",  sessionType: "Telehealth (Video)",   patientType: "Returning Patient", status: "COMPLETED" },
    { id: "appt_21", email: "isabelle.chen@email.com",    doctorId: "doctor_1", date: "2026-06-11", time: "9:00 AM",  sessionType: "In-Person",           patientType: "New Patient",       status: "CONFIRMED" },
    { id: "appt_22", email: "james.okonkwo@email.com",    doctorId: "doctor_2", date: "2026-06-13", time: "10:30 AM", sessionType: "Telehealth (Video)",   patientType: "Returning Patient", status: "CONFIRMED" },
    { id: "appt_23", email: "patient@demo.com",           doctorId: "doctor_3", date: "2026-06-16", time: "12:00 PM", sessionType: "In-Person",           patientType: "New Patient",       status: "CONFIRMED" },
    { id: "appt_24", email: "alice.johnson@email.com",    doctorId: "doctor_4", date: "2026-06-18", time: "1:30 PM",  sessionType: "Telehealth (Video)",   patientType: "Returning Patient", status: "CONFIRMED" },
    { id: "appt_25", email: "brian.tucker@email.com",     doctorId: "doctor_1", date: "2026-06-20", time: "3:00 PM",  sessionType: "In-Person",           patientType: "New Patient",       status: "CONFIRMED" },
    { id: "appt_26", email: "carmen.reyes@email.com",     doctorId: "doctor_2", date: "2026-06-23", time: "3:00 PM",  sessionType: "Telehealth (Video)",   patientType: "Returning Patient", status: "CONFIRMED" },
    { id: "appt_27", email: "david.kim@email.com",        doctorId: "doctor_3", date: "2026-06-25", time: "4:30 PM",  sessionType: "In-Person",           patientType: "New Patient",       status: "CONFIRMED" },
    { id: "appt_28", email: "elena.morris@email.com",     doctorId: "doctor_4", date: "2026-06-27", time: "9:00 AM",  sessionType: "Telehealth (Video)",   patientType: "Returning Patient", status: "CONFIRMED" },
    { id: "appt_29", email: "frank.nguyen@email.com",     doctorId: "doctor_1", date: "2026-07-01", time: "10:30 AM", sessionType: "In-Person",           patientType: "New Patient",       status: "CONFIRMED" },
    { id: "appt_30", email: "grace.patel@email.com",      doctorId: "doctor_2", date: "2026-07-04", time: "12:00 PM", sessionType: "Telehealth (Video)",   patientType: "Returning Patient", status: "CONFIRMED" },
    { id: "appt_31", email: "henry.walker@email.com",     doctorId: "doctor_3", date: "2026-07-08", time: "1:30 PM",  sessionType: "In-Person",           patientType: "New Patient",       status: "CONFIRMED" },
    { id: "appt_32", email: "isabelle.chen@email.com",    doctorId: "doctor_4", date: "2026-07-11", time: "3:00 PM",  sessionType: "Telehealth (Video)",   patientType: "Returning Patient", status: "CONFIRMED" },
    { id: "appt_33", email: "james.okonkwo@email.com",    doctorId: "doctor_1", date: "2026-07-15", time: "3:00 PM",  sessionType: "In-Person",           patientType: "New Patient",       status: "CONFIRMED" },
    { id: "appt_34", email: "patient@demo.com",           doctorId: "doctor_2", date: "2026-07-18", time: "4:30 PM",  sessionType: "Telehealth (Video)",   patientType: "Returning Patient", status: "CONFIRMED" },
    { id: "appt_35", email: "alice.johnson@email.com",    doctorId: "doctor_3", date: "2026-07-22", time: "9:00 AM",  sessionType: "In-Person",           patientType: "New Patient",       status: "CONFIRMED" },
    { id: "appt_36", email: "brian.tucker@email.com",     doctorId: "doctor_4", date: "2026-07-25", time: "10:30 AM", sessionType: "Telehealth (Video)",   patientType: "Returning Patient", status: "CONFIRMED" },
    { id: "appt_37", email: "carmen.reyes@email.com",     doctorId: "doctor_1", date: "2026-07-29", time: "12:00 PM", sessionType: "In-Person",           patientType: "New Patient",       status: "CONFIRMED" },
    { id: "appt_38", email: "david.kim@email.com",        doctorId: "doctor_2", date: "2026-08-01", time: "1:30 PM",  sessionType: "Telehealth (Video)",   patientType: "Returning Patient", status: "CONFIRMED" },
    { id: "appt_39", email: "elena.morris@email.com",     doctorId: "doctor_3", date: "2026-08-05", time: "3:00 PM",  sessionType: "In-Person",           patientType: "New Patient",       status: "CONFIRMED" },
    { id: "appt_40", email: "frank.nguyen@email.com",     doctorId: "doctor_4", date: "2026-08-30", time: "3:00 PM",  sessionType: "Telehealth (Video)",   patientType: "Returning Patient", status: "CONFIRMED" },
    { id: "june_01", email: "alice.johnson@email.com",  doctorId: "doctor_1", date: "2026-06-01", time: "9:00 AM",  sessionType: "In-Person",         patientType: "New Patient",       status: "CONFIRMED" },
    { id: "june_02", email: "brian.tucker@email.com",   doctorId: "doctor_1", date: "2026-06-01", time: "10:30 AM", sessionType: "Telehealth (Video)", patientType: "Returning Patient", status: "CONFIRMED" },
    { id: "june_03", email: "carmen.reyes@email.com",   doctorId: "doctor_1", date: "2026-06-02", time: "9:00 AM",  sessionType: "In-Person",         patientType: "New Patient",       status: "CONFIRMED" },
    { id: "june_04", email: "david.kim@email.com",      doctorId: "doctor_1", date: "2026-06-03", time: "10:30 AM", sessionType: "Telehealth (Video)", patientType: "Returning Patient", status: "CONFIRMED" },
    { id: "june_05", email: "elena.morris@email.com",   doctorId: "doctor_1", date: "2026-06-04", time: "12:00 PM", sessionType: "In-Person",         patientType: "New Patient",       status: "CONFIRMED" },
    { id: "june_06", email: "frank.nguyen@email.com",   doctorId: "doctor_1", date: "2026-06-06", time: "9:00 AM",  sessionType: "Telehealth (Video)", patientType: "Returning Patient", status: "CONFIRMED" },
    { id: "june_07", email: "grace.patel@email.com",    doctorId: "doctor_1", date: "2026-06-08", time: "10:30 AM", sessionType: "In-Person",         patientType: "New Patient",       status: "CONFIRMED" },
    { id: "june_08", email: "henry.walker@email.com",   doctorId: "doctor_1", date: "2026-06-10", time: "9:00 AM",  sessionType: "Telehealth (Video)", patientType: "Returning Patient", status: "CONFIRMED" },
    { id: "june_09", email: "isabelle.chen@email.com",  doctorId: "doctor_1", date: "2026-06-11", time: "10:30 AM", sessionType: "In-Person",         patientType: "New Patient",       status: "CONFIRMED" },
    { id: "june_10", email: "james.okonkwo@email.com",  doctorId: "doctor_1", date: "2026-06-12", time: "1:30 PM",  sessionType: "Telehealth (Video)", patientType: "Returning Patient", status: "CONFIRMED" },
    { id: "june_11", email: "patient@demo.com",         doctorId: "doctor_1", date: "2026-06-14", time: "9:00 AM",  sessionType: "In-Person",         patientType: "New Patient",       status: "CONFIRMED" },
    { id: "june_12", email: "alice.johnson@email.com",  doctorId: "doctor_1", date: "2026-06-15", time: "3:00 PM",  sessionType: "Telehealth (Video)", patientType: "Returning Patient", status: "CONFIRMED" },
    { id: "june_13", email: "brian.tucker@email.com",   doctorId: "doctor_1", date: "2026-06-17", time: "10:30 AM", sessionType: "In-Person",         patientType: "New Patient",       status: "CONFIRMED" },
    { id: "june_14", email: "carmen.reyes@email.com",   doctorId: "doctor_1", date: "2026-06-19", time: "9:00 AM",  sessionType: "Telehealth (Video)", patientType: "Returning Patient", status: "CONFIRMED" },
    { id: "june_15", email: "david.kim@email.com",      doctorId: "doctor_1", date: "2026-06-20", time: "10:30 AM", sessionType: "In-Person",         patientType: "New Patient",       status: "CONFIRMED" },
    { id: "june_16", email: "elena.morris@email.com",   doctorId: "doctor_1", date: "2026-06-21", time: "1:30 PM",  sessionType: "Telehealth (Video)", patientType: "Returning Patient", status: "CONFIRMED" },
    { id: "june_17", email: "frank.nguyen@email.com",   doctorId: "doctor_1", date: "2026-06-22", time: "9:00 AM",  sessionType: "In-Person",         patientType: "New Patient",       status: "CONFIRMED" },
    { id: "june_18", email: "grace.patel@email.com",    doctorId: "doctor_1", date: "2026-06-24", time: "4:30 PM",  sessionType: "Telehealth (Video)", patientType: "Returning Patient", status: "CONFIRMED" },
    { id: "june_19", email: "henry.walker@email.com",   doctorId: "doctor_1", date: "2026-06-26", time: "12:00 PM", sessionType: "In-Person",         patientType: "New Patient",       status: "CONFIRMED" },
    { id: "june_20", email: "isabelle.chen@email.com",  doctorId: "doctor_1", date: "2026-06-28", time: "9:00 AM",  sessionType: "Telehealth (Video)", patientType: "Returning Patient", status: "CONFIRMED" },
    { id: "june_21", email: "james.okonkwo@email.com",  doctorId: "doctor_2", date: "2026-06-01", time: "1:30 PM",  sessionType: "In-Person",         patientType: "New Patient",       status: "CONFIRMED" },
    { id: "june_22", email: "patient@demo.com",         doctorId: "doctor_2", date: "2026-06-02", time: "10:30 AM", sessionType: "Telehealth (Video)", patientType: "Returning Patient", status: "CONFIRMED" },
    { id: "june_23", email: "alice.johnson@email.com",  doctorId: "doctor_2", date: "2026-06-03", time: "9:00 AM",  sessionType: "In-Person",         patientType: "New Patient",       status: "CONFIRMED" },
    { id: "june_24", email: "brian.tucker@email.com",   doctorId: "doctor_2", date: "2026-06-05", time: "12:00 PM", sessionType: "Telehealth (Video)", patientType: "Returning Patient", status: "CONFIRMED" },
    { id: "june_25", email: "carmen.reyes@email.com",   doctorId: "doctor_2", date: "2026-06-07", time: "9:00 AM",  sessionType: "In-Person",         patientType: "New Patient",       status: "CONFIRMED" },
    { id: "june_26", email: "david.kim@email.com",      doctorId: "doctor_2", date: "2026-06-08", time: "3:00 PM",  sessionType: "Telehealth (Video)", patientType: "Returning Patient", status: "CONFIRMED" },
    { id: "june_27", email: "elena.morris@email.com",   doctorId: "doctor_2", date: "2026-06-10", time: "1:30 PM",  sessionType: "In-Person",         patientType: "New Patient",       status: "CONFIRMED" },
    { id: "june_28", email: "frank.nguyen@email.com",   doctorId: "doctor_2", date: "2026-06-12", time: "9:00 AM",  sessionType: "Telehealth (Video)", patientType: "Returning Patient", status: "CONFIRMED" },
    { id: "june_29", email: "grace.patel@email.com",    doctorId: "doctor_2", date: "2026-06-13", time: "9:00 AM",  sessionType: "In-Person",         patientType: "New Patient",       status: "CONFIRMED" },
    { id: "june_30", email: "henry.walker@email.com",   doctorId: "doctor_2", date: "2026-06-14", time: "4:30 PM",  sessionType: "Telehealth (Video)", patientType: "Returning Patient", status: "CONFIRMED" },
    { id: "june_31", email: "isabelle.chen@email.com",  doctorId: "doctor_2", date: "2026-06-16", time: "10:30 AM", sessionType: "In-Person",         patientType: "New Patient",       status: "CONFIRMED" },
    { id: "june_32", email: "james.okonkwo@email.com",  doctorId: "doctor_2", date: "2026-06-17", time: "1:30 PM",  sessionType: "Telehealth (Video)", patientType: "Returning Patient", status: "CONFIRMED" },
    { id: "june_33", email: "patient@demo.com",         doctorId: "doctor_2", date: "2026-06-18", time: "9:00 AM",  sessionType: "In-Person",         patientType: "New Patient",       status: "CONFIRMED" },
    { id: "june_34", email: "alice.johnson@email.com",  doctorId: "doctor_2", date: "2026-06-19", time: "12:00 PM", sessionType: "Telehealth (Video)", patientType: "Returning Patient", status: "CONFIRMED" },
    { id: "june_35", email: "brian.tucker@email.com",   doctorId: "doctor_2", date: "2026-06-21", time: "3:00 PM",  sessionType: "In-Person",         patientType: "New Patient",       status: "CONFIRMED" },
    { id: "june_36", email: "carmen.reyes@email.com",   doctorId: "doctor_2", date: "2026-06-22", time: "10:30 AM", sessionType: "Telehealth (Video)", patientType: "Returning Patient", status: "CONFIRMED" },
    { id: "june_37", email: "david.kim@email.com",      doctorId: "doctor_2", date: "2026-06-23", time: "9:00 AM",  sessionType: "In-Person",         patientType: "New Patient",       status: "CONFIRMED" },
    { id: "june_38", email: "elena.morris@email.com",   doctorId: "doctor_2", date: "2026-06-24", time: "1:30 PM",  sessionType: "Telehealth (Video)", patientType: "Returning Patient", status: "CONFIRMED" },
    { id: "june_39", email: "frank.nguyen@email.com",   doctorId: "doctor_2", date: "2026-06-26", time: "9:00 AM",  sessionType: "In-Person",         patientType: "New Patient",       status: "CONFIRMED" },
    { id: "june_40", email: "grace.patel@email.com",    doctorId: "doctor_2", date: "2026-06-28", time: "10:30 AM", sessionType: "Telehealth (Video)", patientType: "Returning Patient", status: "CONFIRMED" },
    { id: "june_41", email: "henry.walker@email.com",   doctorId: "doctor_3", date: "2026-06-01", time: "10:30 AM", sessionType: "In-Person",         patientType: "New Patient",       status: "CONFIRMED" },
    { id: "june_42", email: "isabelle.chen@email.com",  doctorId: "doctor_3", date: "2026-06-02", time: "3:00 PM",  sessionType: "Telehealth (Video)", patientType: "Returning Patient", status: "CONFIRMED" },
    { id: "june_43", email: "james.okonkwo@email.com",  doctorId: "doctor_3", date: "2026-06-04", time: "9:00 AM",  sessionType: "In-Person",         patientType: "New Patient",       status: "CONFIRMED" },
    { id: "june_44", email: "patient@demo.com",         doctorId: "doctor_3", date: "2026-06-05", time: "9:00 AM",  sessionType: "Telehealth (Video)", patientType: "Returning Patient", status: "CONFIRMED" },
    { id: "june_45", email: "alice.johnson@email.com",  doctorId: "doctor_3", date: "2026-06-06", time: "12:00 PM", sessionType: "In-Person",         patientType: "New Patient",       status: "CONFIRMED" },
    { id: "june_46", email: "brian.tucker@email.com",   doctorId: "doctor_3", date: "2026-06-07", time: "10:30 AM", sessionType: "Telehealth (Video)", patientType: "Returning Patient", status: "CONFIRMED" },
    { id: "june_47", email: "carmen.reyes@email.com",   doctorId: "doctor_3", date: "2026-06-09", time: "9:00 AM",  sessionType: "In-Person",         patientType: "New Patient",       status: "CONFIRMED" },
    { id: "june_48", email: "david.kim@email.com",      doctorId: "doctor_3", date: "2026-06-10", time: "4:30 PM",  sessionType: "Telehealth (Video)", patientType: "Returning Patient", status: "CONFIRMED" },
    { id: "june_49", email: "elena.morris@email.com",   doctorId: "doctor_3", date: "2026-06-11", time: "1:30 PM",  sessionType: "In-Person",         patientType: "New Patient",       status: "CONFIRMED" },
    { id: "june_50", email: "frank.nguyen@email.com",   doctorId: "doctor_3", date: "2026-06-12", time: "10:30 AM", sessionType: "Telehealth (Video)", patientType: "Returning Patient", status: "CONFIRMED" },
    { id: "june_51", email: "grace.patel@email.com",    doctorId: "doctor_3", date: "2026-06-14", time: "3:00 PM",  sessionType: "In-Person",         patientType: "New Patient",       status: "CONFIRMED" },
    { id: "june_52", email: "henry.walker@email.com",   doctorId: "doctor_3", date: "2026-06-15", time: "9:00 AM",  sessionType: "Telehealth (Video)", patientType: "Returning Patient", status: "CONFIRMED" },
    { id: "june_53", email: "isabelle.chen@email.com",  doctorId: "doctor_3", date: "2026-06-16", time: "9:00 AM",  sessionType: "In-Person",         patientType: "New Patient",       status: "CONFIRMED" },
    { id: "june_54", email: "james.okonkwo@email.com",  doctorId: "doctor_3", date: "2026-06-17", time: "10:30 AM", sessionType: "Telehealth (Video)", patientType: "Returning Patient", status: "CONFIRMED" },
    { id: "june_55", email: "patient@demo.com",         doctorId: "doctor_3", date: "2026-06-19", time: "1:30 PM",  sessionType: "In-Person",         patientType: "New Patient",       status: "CONFIRMED" },
    { id: "june_56", email: "alice.johnson@email.com",  doctorId: "doctor_3", date: "2026-06-21", time: "9:00 AM",  sessionType: "Telehealth (Video)", patientType: "Returning Patient", status: "CONFIRMED" },
    { id: "june_57", email: "brian.tucker@email.com",   doctorId: "doctor_3", date: "2026-06-22", time: "3:00 PM",  sessionType: "In-Person",         patientType: "New Patient",       status: "CONFIRMED" },
    { id: "june_58", email: "carmen.reyes@email.com",   doctorId: "doctor_3", date: "2026-06-24", time: "10:30 AM", sessionType: "Telehealth (Video)", patientType: "Returning Patient", status: "CONFIRMED" },
    { id: "june_59", email: "david.kim@email.com",      doctorId: "doctor_3", date: "2026-06-25", time: "9:00 AM",  sessionType: "In-Person",         patientType: "New Patient",       status: "CONFIRMED" },
    { id: "june_60", email: "elena.morris@email.com",   doctorId: "doctor_3", date: "2026-06-28", time: "12:00 PM", sessionType: "Telehealth (Video)", patientType: "Returning Patient", status: "CONFIRMED" },
    { id: "june_61", email: "frank.nguyen@email.com",   doctorId: "doctor_4", date: "2026-06-01", time: "9:00 AM",  sessionType: "In-Person",         patientType: "New Patient",       status: "CONFIRMED" },
    { id: "june_62", email: "grace.patel@email.com",    doctorId: "doctor_4", date: "2026-06-02", time: "10:30 AM", sessionType: "Telehealth (Video)", patientType: "Returning Patient", status: "CONFIRMED" },
    { id: "june_63", email: "henry.walker@email.com",   doctorId: "doctor_4", date: "2026-06-04", time: "12:00 PM", sessionType: "In-Person",         patientType: "New Patient",       status: "CONFIRMED" },
    { id: "june_64", email: "isabelle.chen@email.com",  doctorId: "doctor_4", date: "2026-06-06", time: "9:00 AM",  sessionType: "Telehealth (Video)", patientType: "Returning Patient", status: "CONFIRMED" },
    { id: "june_65", email: "james.okonkwo@email.com",  doctorId: "doctor_4", date: "2026-06-07", time: "3:00 PM",  sessionType: "In-Person",         patientType: "New Patient",       status: "CONFIRMED" },
    { id: "june_66", email: "patient@demo.com",         doctorId: "doctor_4", date: "2026-06-08", time: "10:30 AM", sessionType: "Telehealth (Video)", patientType: "Returning Patient", status: "CONFIRMED" },
    { id: "june_67", email: "alice.johnson@email.com",  doctorId: "doctor_4", date: "2026-06-09", time: "9:00 AM",  sessionType: "In-Person",         patientType: "New Patient",       status: "CONFIRMED" },
    { id: "june_68", email: "brian.tucker@email.com",   doctorId: "doctor_4", date: "2026-06-11", time: "12:00 PM", sessionType: "Telehealth (Video)", patientType: "Returning Patient", status: "CONFIRMED" },
    { id: "june_69", email: "carmen.reyes@email.com",   doctorId: "doctor_4", date: "2026-06-13", time: "1:30 PM",  sessionType: "In-Person",         patientType: "New Patient",       status: "CONFIRMED" },
    { id: "june_70", email: "david.kim@email.com",      doctorId: "doctor_4", date: "2026-06-15", time: "10:30 AM", sessionType: "Telehealth (Video)", patientType: "Returning Patient", status: "CONFIRMED" },
    { id: "june_71", email: "elena.morris@email.com",   doctorId: "doctor_4", date: "2026-06-17", time: "9:00 AM",  sessionType: "In-Person",         patientType: "New Patient",       status: "CONFIRMED" },
    { id: "june_72", email: "frank.nguyen@email.com",   doctorId: "doctor_4", date: "2026-06-18", time: "9:00 AM",  sessionType: "Telehealth (Video)", patientType: "Returning Patient", status: "CONFIRMED" },
    { id: "june_73", email: "grace.patel@email.com",    doctorId: "doctor_4", date: "2026-06-20", time: "4:30 PM",  sessionType: "In-Person",         patientType: "New Patient",       status: "CONFIRMED" },
    { id: "june_74", email: "henry.walker@email.com",   doctorId: "doctor_4", date: "2026-06-22", time: "9:00 AM",  sessionType: "Telehealth (Video)", patientType: "Returning Patient", status: "CONFIRMED" },
    { id: "june_75", email: "isabelle.chen@email.com",  doctorId: "doctor_4", date: "2026-06-24", time: "3:00 PM",  sessionType: "In-Person",         patientType: "New Patient",       status: "CONFIRMED" },
    { id: "june_76", email: "james.okonkwo@email.com",  doctorId: "doctor_4", date: "2026-06-26", time: "10:30 AM", sessionType: "Telehealth (Video)", patientType: "Returning Patient", status: "CONFIRMED" },
    { id: "june_77", email: "patient@demo.com",         doctorId: "doctor_4", date: "2026-06-27", time: "10:30 AM", sessionType: "In-Person",         patientType: "New Patient",       status: "CONFIRMED" },
    { id: "june_78", email: "alice.johnson@email.com",  doctorId: "doctor_4", date: "2026-06-29", time: "9:00 AM",  sessionType: "Telehealth (Video)", patientType: "Returning Patient", status: "CONFIRMED" },
  ];

  for (const appt of appointments) {
    const uid = userIdMap.get(appt.email);
    if (!uid) continue;
    await prisma.appointment.upsert({
      where: { id: appt.id },
      update: { userId: uid, doctorId: appt.doctorId, date: appt.date, time: appt.time, sessionType: appt.sessionType, patientType: appt.patientType, status: appt.status },
      create: { id: appt.id, userId: uid, doctorId: appt.doctorId, date: appt.date, time: appt.time, sessionType: appt.sessionType, patientType: appt.patientType, status: appt.status },
    });
  }

  // 10 contact messages
  const contactMessages = [
    { id: "msg_01", name: "Lena Hartman",    email: "lena.hartman@email.com",    phone: "(212) 555-0201", topic: "General Inquiry",        message: "Hi, I was wondering what mental health services you offer for young adults. I've been struggling with anxiety and looking for a good fit.", read: true  },
    { id: "msg_02", name: "Marco Delgado",   email: "marco.delgado@email.com",   phone: null,             topic: "Appointment / Booking",  message: "I'd like to book an initial consultation with Dr. Nair. I saw her profile and think her approach aligns with what I need. Please let me know her availability.", read: false },
    { id: "msg_03", name: "Sophie Laurent",  email: "sophie.laurent@email.com",  phone: "(212) 555-0203", topic: "Insurance Question",      message: "Does MindWell accept Aetna insurance? I'd like to confirm coverage before booking an appointment so there are no surprises.", read: true  },
    { id: "msg_04", name: "Ethan Brooks",    email: "ethan.brooks@email.com",    phone: "(212) 555-0204", topic: "General Inquiry",        message: "I'm a parent looking for adolescent psychiatry services for my 16-year-old son. Can you tell me more about how you handle patients his age?", read: false },
    { id: "msg_05", name: "Nadia Osei",      email: "nadia.osei@email.com",      phone: null,             topic: "Appointment / Booking",  message: "I need to reschedule my appointment that was set for next Tuesday. Is it possible to move it to Thursday afternoon instead?", read: true  },
    { id: "msg_06", name: "Tyler Watts",     email: "tyler.watts@email.com",     phone: "(212) 555-0206", topic: "Insurance Question",      message: "I currently have UnitedHealthcare and want to know if you are in-network. Also, what is the typical out-of-pocket cost per session if not?", read: false },
    { id: "msg_07", name: "Amara Singh",     email: "amara.singh@email.com",     phone: "(212) 555-0207", topic: "General Inquiry",        message: "Do you offer telehealth sessions for patients who live outside of New York? I'm based in New Jersey and prefer video appointments.", read: false },
    { id: "msg_08", name: "Rachel Foster",   email: "rachel.foster@email.com",   phone: null,             topic: "Appointment / Booking",  message: "I'd like to book a couples counselling session with Dr. Nair. My partner and I are both available on weekday evenings. Do you have slots available?", read: true  },
    { id: "msg_09", name: "Daniel Yoon",     email: "daniel.yoon@email.com",     phone: "(212) 555-0209", topic: "General Inquiry",        message: "I was referred to MindWell by my GP for PTSD treatment. I wanted to reach out before booking to understand what the intake process looks like.", read: false },
    { id: "msg_10", name: "Priscilla Mack",  email: "priscilla.mack@email.com",  phone: "(212) 555-0210", topic: "Insurance Question",      message: "I have Cigna through my employer. I want to confirm whether any of your psychiatrists are in-network before scheduling a medication management consultation.", read: true  },
  ];

  for (const msg of contactMessages) {
    await prisma.contactMessage.upsert({
      where: { id: msg.id },
      update: { name: msg.name, email: msg.email, phone: msg.phone ?? undefined, topic: msg.topic, message: msg.message, read: msg.read },
      create: { id: msg.id, name: msg.name, email: msg.email, phone: msg.phone ?? undefined, topic: msg.topic, message: msg.message, read: msg.read },
    });
  }

  console.log("Seed complete.");
  console.log("Admin:", adminEmail, "/", adminPassword);
  console.log("Patient: patient@demo.com / Patient@123");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

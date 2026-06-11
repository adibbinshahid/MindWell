import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <>
      <div className="page-hero">
        <div className="max-w-6xl mx-auto px-6">
          <h1>Privacy Policy</h1>
          <p>Last updated: January 1, 2025. MindWell Psychiatrist & Psychologist Clinic.</p>
        </div>
      </div>

      <section className="py-16">
        <div className="max-w-3xl mx-auto px-6">
          <div className="alert alert-info mb-8">
            <span>🔒</span>
            <span><strong>HIPAA Notice:</strong> MindWell is a covered entity under the Health Insurance Portability and Accountability Act (HIPAA). We protect your health information as required by law.</span>
          </div>

          {[
            {
              title: "1. Information We Collect",
              body: `We collect information you provide directly, including:

• **Identity & Contact:** Name, date of birth, email address, phone number, and mailing address.
• **Health Information (PHI):** Medical history, symptoms, diagnoses, treatment records, prescriptions, and session notes. This is Protected Health Information under HIPAA.
• **Insurance & Billing:** Insurance provider, member ID, billing address, and payment method (credit/debit card via encrypted processor — we do not store full card numbers).
• **Website Usage:** IP address, browser type, pages visited, and session duration via cookies (see Section 7).
• **Communications:** Messages sent through our contact form, appointment booking notes, and support enquiries.`
            },
            {
              title: "2. How We Use Your Information",
              body: `Your information is used exclusively for:

• Providing, coordinating, and improving your mental health care.
• Appointment scheduling, confirmations, and reminders.
• Billing and insurance processing.
• Communicating with you about your care (with your consent).
• Legal and regulatory compliance.
• Internal analytics to improve our services (anonymised and aggregated).

We never sell, rent, or trade your personal information to third parties.`
            },
            {
              title: "3. HIPAA & Protected Health Information",
              body: `As a HIPAA-covered entity, we maintain strict safeguards for your Protected Health Information (PHI):

• **Minimum Necessary:** We access and share only the minimum PHI necessary for each purpose.
• **Business Associates:** Third-party vendors (e.g., billing, telehealth platform) sign HIPAA Business Associate Agreements (BAAs).
• **Authorisation:** We will not disclose your PHI for purposes beyond treatment, payment, and healthcare operations without your written authorisation, except as required by law.
• **Telehealth:** All video sessions are conducted on HIPAA-compliant, end-to-end encrypted platforms.
• **Exceptions Required by Law:** We may disclose PHI without consent to prevent serious harm to you or others, or as required by court order, public health reporting, or law enforcement subpoena.`
            },
            {
              title: "4. How We Share Your Information",
              body: `We share your information only with:

• **Treating Clinicians:** Your care team within MindWell.
• **Authorised Referrals:** Other healthcare providers when you request a referral and provide written authorisation.
• **Insurance & Billing:** Your insurer and billing service to process claims.
• **Technology Vendors:** Our HIPAA BAA-covered EHR, telehealth, and scheduling platforms.
• **Legal Obligations:** Courts, regulatory bodies, or law enforcement when legally required.

We do not share your information with advertisers, data brokers, or social media platforms.`
            },
            {
              title: "5. Data Security",
              body: `We employ industry-standard technical and administrative safeguards:

• All data transmitted to/from our website is encrypted via TLS (HTTPS).
• PHI is stored in encrypted, access-controlled systems with audit logging.
• Employee access to PHI is role-based and on a need-to-know basis.
• We conduct regular security risk assessments as required by HIPAA.
• Passwords are hashed using bcrypt with a high work factor.
• In the event of a breach affecting your PHI, we will notify you and the relevant authorities as required by the HIPAA Breach Notification Rule.`
            },
            {
              title: "6. Your Rights Under HIPAA",
              body: `You have the following rights regarding your PHI:

• **Right to Access:** Request a copy of your medical records within 30 days of request.
• **Right to Amend:** Request corrections to inaccurate or incomplete records.
• **Right to Restriction:** Request restrictions on certain uses or disclosures of your PHI.
• **Right to Accounting:** Receive a list of disclosures of your PHI made in the past 6 years.
• **Right to Confidential Communications:** Request communications via a specific method or address.
• **Right to Complain:** File a complaint with us or with the U.S. Department of Health and Human Services (HHS) if you believe your rights have been violated — without fear of retaliation.

To exercise any of these rights, contact our Privacy Officer at privacy@mindwellclinic.com.`
            },
            {
              title: "7. Cookies & Website Analytics",
              body: `Our website uses cookies for:

• **Essential Cookies:** Session management and authentication (cannot be disabled without breaking functionality).
• **Analytics Cookies:** Aggregated, anonymised usage data to improve the site (e.g., which pages are most visited). No health information is included.

We do not use advertising or tracking cookies. You may disable non-essential cookies via your browser settings.`
            },
            {
              title: "8. Children's Privacy",
              body: `MindWell does not knowingly collect personal information from children under 13 without verifiable parental consent. For patients under 18, consent is managed through a parent or legal guardian as required by applicable law. Therapist-patient confidentiality for minors varies by state — our clinicians will explain applicable limits at the start of treatment.`
            },
            {
              title: "9. Retention",
              body: `We retain medical records for a minimum of 7 years from the date of service, or 7 years after a minor reaches the age of 18, as required by New York State law. Financial records are retained for 7 years for tax and audit purposes. Website usage logs are retained for 12 months.`
            },
            {
              title: "10. Changes to This Policy",
              body: `We may update this Privacy Policy periodically. Changes will be posted on this page with an updated "Last updated" date. For material changes affecting your PHI, we will notify you by email or during your next appointment.`
            },
            {
              title: "11. Contact & Privacy Officer",
              body: `Questions, complaints, or requests regarding this policy or your rights:

**Privacy Officer**
MindWell Psychiatrist & Psychologist Clinic
123 Healing Lane, Suite 400, New York, NY 10001
Email: privacy@mindwellclinic.com
Phone: (212) 555-0100

**U.S. Department of Health & Human Services (HHS)**
If you believe we have violated your privacy rights, you may also file a complaint with the Office for Civil Rights at hhs.gov/ocr. We will not retaliate against you for filing a complaint.`
            },
          ].map(section=>(
            <div key={section.title} className="mb-10">
              <h2 className="text-xl font-bold text-slate-900 mb-4">{section.title}</h2>
              <div className="prose prose-slate prose-sm max-w-none">
                {section.body.split("\n").map((line,i)=>{
                  if (!line.trim()) return <br key={i}/>;
                  const rendered = line.replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>");
                  if (line.startsWith("•")) return <p key={i} className="flex gap-2 my-1 text-slate-700 text-sm leading-relaxed" dangerouslySetInnerHTML={{__html:"<span>•</span><span>"+rendered.slice(1).trim()+"</span>"}}/>;
                  return <p key={i} className="text-slate-700 text-sm leading-relaxed" dangerouslySetInnerHTML={{__html:rendered}}/>;
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

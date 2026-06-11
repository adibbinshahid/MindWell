import BookingWizard from "@/components/booking/BookingWizard";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Book Appointment" };

export default function BookPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Compact header — half the normal page-hero height */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 py-6 text-white text-center">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-xl sm:text-2xl font-extrabold text-white">Book an Appointment</h1>
          <p className="text-blue-100 mt-1 text-sm">Choose your specialist, pick a time, and confirm — done in minutes.</p>
        </div>
      </div>
      {/* Wizard fills remaining viewport */}
      <section className="flex-1 py-8 sm:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-full">
          <BookingWizard />
        </div>
      </section>
    </div>
  );
}

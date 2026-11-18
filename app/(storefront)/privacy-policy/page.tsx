export const metadata = {
  title: "Privacy Policy | Royal Shine Jewellery",
  description: "Privacy policy and client data protection guidelines of Royal Shine Jewellery.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="border-b border-[#EAE4D9] pb-6 mb-8">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-[#C5A265]">
          Client Discretion
        </span>
        <h1 className="font-serif text-3xl font-bold text-[#1A1A1A] mt-1">
          Privacy & Confidentiality Policy
        </h1>
        <p className="text-xs text-zinc-500 mt-2">Effective Date: November 2026</p>
      </div>

      <div className="prose prose-zinc text-xs sm:text-sm text-zinc-700 leading-relaxed space-y-6 font-light">
        <p>
          At Royal Shine Jewellery, we uphold the highest standards of discretion and client
          confidentiality. This Privacy Policy details how we collect, safeguard, and use your personal
          information when you interact with our catalogue and concierge services.
        </p>

        <h2 className="font-serif text-lg font-bold text-[#1A1A1A] pt-4">
          1. Information We Collect
        </h2>
        <p>
          When you submit an enquiry, book a private appointment, or contact our concierge via WhatsApp
          or telephone, we collect your name, contact telephone number, email address, preferred communication
          channel, and details regarding your jewellery preferences.
        </p>

        <h2 className="font-serif text-lg font-bold text-[#1A1A1A] pt-4">
          2. Purpose of Collection
        </h2>
        <p>
          Your information is utilized solely to:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Provide personalized jewellery consultation and quotations.</li>
          <li>Coordinate private showroom viewing appointments.</li>
          <li>Facilitate bespoke design alterations and sizing.</li>
          <li>Provide transit documentation for insured shipping.</li>
        </ul>

        <h2 className="font-serif text-lg font-bold text-[#1A1A1A] pt-4">
          3. Absolute Non-Disclosure
        </h2>
        <p>
          We will never sell, rent, lease, or distribute your personal information or purchase history
          to third-party advertisers or external data brokers. All client records are maintained within
          secure, encrypted database environments.
        </p>

        <h2 className="font-serif text-lg font-bold text-[#1A1A1A] pt-4">
          4. Contact Our Privacy Officer
        </h2>
        <p>
          Should you wish to update, review, or delete your client contact profile from our systems,
          kindly contact our privacy officer at <a href="mailto:privacy@royalshinejewellery.com" className="text-[#C5A265] underline">privacy@royalshinejewellery.com</a>.
        </p>
      </div>
    </div>
  );
}

export const metadata = {
  title: "Terms & Conditions | Royal Shine Jewellery",
  description: "Terms and conditions governing the catalogue, certification, and bespoke enquiries of Royal Shine Jewellery.",
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="border-b border-[#EAE4D9] pb-6 mb-8">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-[#C5A265]">
          Legal Terms
        </span>
        <h1 className="font-serif text-3xl font-bold text-[#1A1A1A] mt-1">
          Terms & Conditions of Service
        </h1>
        <p className="text-xs text-zinc-500 mt-2">Effective Date: November 2026</p>
      </div>

      <div className="prose prose-zinc text-xs sm:text-sm text-zinc-700 leading-relaxed space-y-6 font-light">
        <p>
          Welcome to Royal Shine Jewellery. By browsing our digital catalogue and submitting consultation
          enquiries, you agree to comply with the terms and conditions outlined below.
        </p>

        <h2 className="font-serif text-lg font-bold text-[#1A1A1A] pt-4">
          1. Catalogue & Enquiry Platform Nature
        </h2>
        <p>
          Royal Shine Jewellery is an exclusive catalogue and bespoke enquiry platform. Products displayed
          represent our handcrafted repertoire. Due to the handcrafted nature of precious metals and
          natural gemstones, slight natural variations in gross weight, stone carat weight, and dimensions
          may occur. Exact final weights and values are confirmed via formal tax invoice upon consultation.
        </p>

        <h2 className="font-serif text-lg font-bold text-[#1A1A1A] pt-4">
          2. Gold & Gemstone Pricing
        </h2>
        <p>
          Jewellery pricing is subject to fluctuating international daily bullion rates (24K, 22K, 18K)
          and certified diamond cut/carat indices. Prices indicated on this website are indicative and will
          be confirmed by our concierge at the time of final design finalization.
        </p>

        <h2 className="font-serif text-lg font-bold text-[#1A1A1A] pt-4">
          3. Hallmarking & Certifications
        </h2>
        <p>
          All 22K and 18K gold creations are guaranteed with genuine Bureau of Indian Standards (BIS)
          hallmarking with registered HUID stamps. Diamonds are accompanied by original GIA or IGI laboratory
          grading cards.
        </p>

        <h2 className="font-serif text-lg font-bold text-[#1A1A1A] pt-4">
          4. Intellectual Property
        </h2>
        <p>
          All jewellery designs, imagery, photography, brand identity, and written narratives on this
          domain are the exclusive intellectual property of Royal Shine Jewellery. Unauthorized reproduction
          or commercial usage is strictly prohibited.
        </p>
      </div>
    </div>
  );
}

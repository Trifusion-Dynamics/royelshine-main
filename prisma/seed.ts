import { PrismaClient, Role, EnquiryStatus, PreferredContactMethod, BannerPosition } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌟 Seeding Royal Shine Jewellery database...");

  // 1. Seed Website Settings
  await prisma.websiteSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      brandName: "Royal Shine Jewellery",
      tagLine: "Timeless Elegance & Exquisite Craftsmanship",
      logoUrl: "/images/Royal-Shine-Logo.png",
      faviconUrl: "/favicon.ico",
      contactEmail: "enquiries@royalshinejewellery.com",
      phone: "+91 98765 43210",
      whatsappNumber: "+919876543210",
      showroomAddress: "Royal Shine Flagship Boutique, Luxury Diamond Souk, Bandra West, Mumbai 400050, India",
      businessHours: "Monday – Saturday: 10:30 AM – 8:30 PM | Sunday: By Private Appointment",
      instagramUrl: "https://instagram.com/royalshinejewellery",
      facebookUrl: "https://facebook.com/royalshinejewellery",
      youtubeUrl: "https://youtube.com/@royalshinejewellery",
      defaultCurrency: "INR",
      defaultSeoTitle: "Royal Shine Jewellery — Handcrafted Luxury Diamond & Gold Jewellery",
      defaultSeoDescription:
        "Explore Royal Shine Jewellery: an exclusive catalogue of handcrafted 22K gold, certified natural diamonds, bridal polki, and 925 sterling silver heirlooms.",
    },
  });

  // 2. Seed Super Admin User
  const adminEmail = process.env.INITIAL_ADMIN_EMAIL || "admin@royalshine.com";
  const adminPassword = process.env.INITIAL_ADMIN_PASSWORD || "RoyalShineAdmin2026!";
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash,
      fullName: process.env.INITIAL_ADMIN_NAME || "Royal Shine Administrator",
      role: Role.SUPER_ADMIN,
      isActive: true,
    },
    create: {
      email: adminEmail,
      passwordHash,
      fullName: process.env.INITIAL_ADMIN_NAME || "Royal Shine Administrator",
      role: Role.SUPER_ADMIN,
      isActive: true,
    },
  });
  console.log(`✅ Super Admin created / updated: ${adminEmail}`);

  // 3. Seed Categories
  const categoriesData = [
    {
      name: "Necklaces & Pendants",
      slug: "necklaces",
      description: "Majestic rani haars, diamond tennis chokers, temple necklaces and ethereal gemstone pendants.",
      image: "/images/necjlace/royal-shine-necklace-collection-hero.webp",
      heroBanner: "/images/necjlace/royal-shine-necklace-collection-hero.webp",
      displayOrder: 1,
    },
    {
      name: "Bangles & Bracelets",
      slug: "bangles-bracelets",
      description: "Intricately carved kundan kadas, diamond tennis bracelets, and daily wear delicate bangles.",
      image: "/images/Braclets/royal-shine-bangles-bracelets-collection-hero.webp",
      heroBanner: "/images/Braclets/royal-shine-bangles-bracelets-collection-hero.webp",
      displayOrder: 2,
    },
    {
      name: "Rings",
      slug: "rings",
      description: "Solitaire engagement rings, couple eternity wedding bands, and regal cocktail navratna rings.",
      image: "/images/Rings/royal-shine-rings-collection-hero.webp",
      heroBanner: "/images/Rings/royal-shine-ring-collection-banner.png.png",
      displayOrder: 3,
    },
    {
      name: "Earrings",
      slug: "earrings",
      description: "Traditional temple jhumkas, modern solitaires, chandelier drops, and opulent chandbalis.",
      image: "/images/Earing/royal-shine-earrings-collection-hero.webp",
      heroBanner: "/images/Earing/royal-shine-earrings-collection-hero.webp",
      displayOrder: 4,
    },
    {
      name: "Bridal Jewellery",
      slug: "bridal-jewellery",
      description: "Grand bridal polki sets, matha pattis, haath phools, bajubands and royal bridal heirlooms.",
      image: "/images/Bridal-jewellery/royal-shine-bridal-jewellery-collection-hero.webp",
      heroBanner: "/images/Bridal-jewellery/royal-shine-bridal-jewellery-collection-hero.webp",
      displayOrder: 5,
    },
    {
      name: "Mangalsutra",
      slug: "mangalsutra",
      description: "Sacred bond reimagined: heritage long black beads and contemporary diamond daily wear designs.",
      image: "/images/Mangalsutra/royal-shine-mangalsutra-collection-hero.webp",
      heroBanner: "/images/Mangalsutra/royal-shine-mangalsutra-collection-hero.webp",
      displayOrder: 6,
    },
    {
      name: "Anklets & Payal",
      slug: "anklets-payal",
      description: "Harmonious silver ghungroo payals, gold heart charm anklets, and ornate bridal payals.",
      image: "/images/Anklets-Payal/royal-shine-anklets-payal-collection-hero.webp",
      heroBanner: "/images/Anklets-Payal/royal-shine-anklets-payal-collection-hero.webp",
      displayOrder: 7,
    },
    {
      name: "Nose Pins & Rings",
      slug: "nose-pins",
      description: "Graceful bridal naths, sparkling diamond nose studs, clip-ons, and delicate hoop rings.",
      image: "/images/Nose-Pin/royal-shine-nose-pin-collection-hero.webp",
      heroBanner: "/images/Nose-Pin/royal-shine-nose-pin-collection-hero.webp",
      displayOrder: 8,
    },
    {
      name: "Hair Accessories",
      slug: "hair-accessories",
      description: "Kundan maang tikkas, Mughal inspired jhoomar passas, and regal hair adornments.",
      image: "/images/Hair-Accessories/royal-shine-hair-accessories-collection-hero.webp",
      heroBanner: "/images/Hair-Accessories/royal-shine-hair-accessories-collection-hero.webp",
      displayOrder: 9,
    },
    {
      name: "Silver Jewellery",
      slug: "silver-jewellery",
      description: "Hallmarked 925 sterling silver jewelry, tribal oxidised collections, and divine pooja artifacts.",
      image: "/images/Silver Jewellery/royal-shine-luxury-silver-jewellery-collection-hero.webp",
      heroBanner: "/images/Silver Jewellery/royal-shine-luxury-silver-jewellery-collection-hero.webp",
      displayOrder: 10,
    },
  ];

  const categoryMap = new Map<string, string>();
  for (const cat of categoriesData) {
    const record = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
    categoryMap.set(cat.slug, record.id);
  }
  console.log(`✅ ${categoriesData.length} Categories seeded.`);

  // 4. Seed Collections
  const collectionsData = [
    {
      name: "The Imperial Bridal Heritage",
      slug: "imperial-bridal-heritage",
      description: "Heirloom bridal jewellery sets handcrafted in 22K gold, adorned with syndicate uncut polki and Basra pearls.",
      bannerImage: "/images/Bridal-jewellery/royal-shine-bridal-jewellery-collection-hero.webp",
      isFeatured: true,
      displayOrder: 1,
    },
    {
      name: "Royal Solitaire Symphony",
      slug: "royal-solitaire-symphony",
      description: "Certified natural diamonds of pristine color and clarity, crafted into timeless rings, tennis necklaces and studs.",
      bannerImage: "/images/Rings/royal-shine-rings-collection-hero.webp",
      isFeatured: true,
      displayOrder: 2,
    },
    {
      name: "Temple Antiquities",
      slug: "temple-antiquities",
      description: "Sacred South Indian temple jewellery portraying Goddess Lakshmi, peacock motifs and divine benediction.",
      bannerImage: "/images/necjlace/royal-shine-necklace-collection-hero.webp",
      isFeatured: true,
      displayOrder: 3,
    },
    {
      name: "925 Pure Sterling Grace",
      slug: "sterling-grace",
      description: "Modern elegance and oxidised tribal heirlooms forged in hallmarked 925 sterling silver.",
      bannerImage: "/images/Silver Jewellery/royal-shine-luxury-silver-jewellery-collection-hero.webp",
      isFeatured: true,
      displayOrder: 4,
    },
  ];

  const collectionMap = new Map<string, string>();
  for (const col of collectionsData) {
    const record = await prisma.collection.upsert({
      where: { slug: col.slug },
      update: col,
      create: col,
    });
    collectionMap.set(col.slug, record.id);
  }
  console.log(`✅ ${collectionsData.length} Collections seeded.`);

  // 5. Seed Products
  const productsData = [
    // Necklaces
    {
      name: "Royal Antique Gold Rani Haar with Ruby & Emerald",
      slug: "royal-antique-gold-rani-haar-ruby-emerald",
      sku: "RS-NK-001",
      categorySlug: "necklaces",
      shortDescription: "Majestic 22K multi-strand royal rani haar adorned with carved Zambian emeralds and Burmese rubies.",
      description: "An authentic tribute to royal Indian royalty, this magnificent Rani Haar is forged in hallmarked 22K antique gold. Featuring meticulous Nakshi craftsmanship, each medallion is encrusted with natural untreated rubies, rich cabochon emeralds, and finished with delicate Basra seed pearl clusters.",
      price: 485000,
      discountedPrice: 460000,
      material: "22K Antique Yellow Gold",
      purity: "22K (916 BIS Hallmarked)",
      weight: "68.50 grams",
      stoneDetails: "Natural Burmese Rubies, Zambian Emerald Cabochons, Basra Seed Pearls",
      dimensions: "Necklace Length: 24 inches adjustable with Dori",
      mainImage: "/images/necjlace/royal-shine-antique-gold-rani-haar-ruby-emerald-original.png",
      isFeatured: true,
      isNewArrival: false,
      collections: ["imperial-bridal-heritage", "temple-antiquities"],
    },
    {
      name: "Royal Double Strand Freshwater Pearl & Gold Necklace",
      slug: "royal-double-strand-freshwater-pearl-gold-necklace",
      sku: "RS-NK-002",
      categorySlug: "necklaces",
      shortDescription: "Luminous double-strand AA+ quality natural pearls with an 18K gold clasp.",
      description: "Radiating timeless poise, this double-strand necklace features hand-selected cultured freshwater pearls with exceptional luster, secured with an intricate 18K yellow gold filigree safety clasp.",
      price: 145000,
      material: "18K Yellow Gold Clasp & Natural Pearls",
      purity: "18K (750 Hallmarked)",
      weight: "32.00 grams gross",
      stoneDetails: "AA+ Lustrous Natural Cultured Freshwater Pearls (7.5mm - 8.0mm)",
      dimensions: "Inner strand: 16 inches, Outer strand: 18 inches",
      mainImage: "/images/necjlace/royal-shine-double-strand-freshwater-pearl-gold-necklace-original.png",
      isFeatured: false,
      isNewArrival: true,
      collections: ["royal-solitaire-symphony"],
    },
    {
      name: "Royal Emerald Pendant & Diamond Earring Suite",
      slug: "royal-emerald-pendant-diamond-earring-suite",
      sku: "RS-NK-003",
      categorySlug: "necklaces",
      shortDescription: "Exquisite Colombian emerald surrounded by a brilliant diamond halo with matching earrings.",
      description: "Crafted in 18K white gold, the suite spotlights an untreated vivid green Colombian emerald embraced by a micro-pavé and round-brilliant diamond halo. Accompanied by coordinating diamond drop earrings.",
      price: 320000,
      discountedPrice: 295000,
      material: "18K White Gold",
      purity: "18K (750 Hallmarked)",
      weight: "24.50 grams",
      stoneDetails: "Vivid Green Emerald 3.20 Carats, VVS-VS Diamonds 1.85 Carats TW",
      dimensions: "Pendant Height: 32mm; Chain Length: 18 inches",
      mainImage: "/images/necjlace/royal-shine-emerald-pendant-diamond-earring-set-original.png.png",
      isFeatured: true,
      isNewArrival: false,
      collections: ["royal-solitaire-symphony"],
    },
    {
      name: "Royal Gold Diamond Tennis Choker",
      slug: "royal-gold-diamond-tennis-choker",
      sku: "RS-NK-004",
      categorySlug: "necklaces",
      shortDescription: "Continuous stream of certified brilliant cut diamonds in an 18K yellow gold four-prong setting.",
      description: "A showstopping diamond tennis necklace designed to drape seamlessly along the collarbone. Each diamond is precision hand-set in a low-profile four-prong basket to maximize light refraction and fire.",
      price: 590000,
      material: "18K Yellow Gold",
      purity: "18K (750 Hallmarked)",
      weight: "38.20 grams",
      stoneDetails: "5.50 Carats Total Weight, Round Brilliant Diamonds (Color: E-F, Clarity: VVS)",
      dimensions: "Length: 16 inches with dual safety lock",
      mainImage: "/images/necjlace/royal-shine-gold-diamond-tennis-choker-original.png.png",
      isFeatured: true,
      isNewArrival: true,
      collections: ["royal-solitaire-symphony"],
    },
    {
      name: "Royal Lakshmi Peacock Temple Heritage Necklace",
      slug: "royal-lakshmi-peacock-temple-necklace",
      sku: "RS-NK-005",
      categorySlug: "necklaces",
      shortDescription: "Divine Goddess Lakshmi central idol flanked by ornate peacocks in 22K yellow gold.",
      description: "Sculpted with historic South Indian temple art techniques, this necklace honors Goddess Lakshmi seated on a lotus, flanked by dancers and twin peacocks. Features cabochon rubies and golden hanging beads.",
      price: 520000,
      material: "22K Traditional Yellow Gold",
      purity: "22K (916 BIS Hallmarked)",
      weight: "82.00 grams",
      stoneDetails: "Natural Uncut Polki Diamonds & Natural Ruby Cabochons",
      dimensions: "Choker Width: 45mm, Length: 15-18 inches adjustable",
      mainImage: "/images/necjlace/royal-shine-gold-lakshmi-peacock-temple-necklace-original.png",
      isFeatured: false,
      isNewArrival: false,
      collections: ["temple-antiquities", "imperial-bridal-heritage"],
    },
    {
      name: "Royal Kundan Polki Bridal Choker Set",
      slug: "royal-kundan-polki-bridal-choker-set",
      sku: "RS-NK-006",
      categorySlug: "necklaces",
      shortDescription: "Grand Rajasthan bridal choker complete with matching jhumkas and maang tikka.",
      description: "The epitome of bridal grandeur. Pure syndicate uncut polki diamonds set in 22K gold foil with green meenakari enamel work on the reverse side. Strung with fine emerald beads and cultured pearls.",
      price: 780000,
      discountedPrice: 740000,
      material: "22K Gold & Pure Silver Foil",
      purity: "22K (916 BIS Hallmarked)",
      weight: "115.00 grams",
      stoneDetails: "Syndicate Uncut Polki Diamonds, Zambian Emerald Beads, Seed Pearls",
      dimensions: "Choker Height: 60mm; Includes matching Jhumkas & Maang Tikka",
      mainImage: "/images/necjlace/royal-shine-kundan-polki-bridal-choker-jhumka-maang-tikka-original.png",
      isFeatured: true,
      isNewArrival: false,
      collections: ["imperial-bridal-heritage"],
    },

    // Rings
    {
      name: "Royal Solitaire Diamond Ring (1.50ct)",
      slug: "royal-solitaire-diamond-ring",
      sku: "RS-RG-001",
      categorySlug: "rings",
      shortDescription: "Certified 1.50 Carat Round Brilliant Solitaire Diamond in a classic 6-prong platinum & gold mount.",
      description: "A testament to purest love. An exceptional GIA-certified 1.50-carat round brilliant cut diamond graded D Color and VVS1 Clarity, mounted on an ergonomic 18K white gold tapered shank.",
      price: 620000,
      material: "18K White Gold",
      purity: "18K (750 Hallmarked)",
      weight: "4.80 grams",
      stoneDetails: "1.50 Carat Natural Solitaire Diamond (Color: D, Clarity: VVS1, Triple Excellent Cut)",
      dimensions: "Band width: 2.2mm, Ring Size: Customizable",
      mainImage: "/images/Rings/royal-shine-solitaire-diamond-ring-original.png.png",
      isFeatured: true,
      isNewArrival: true,
      collections: ["royal-solitaire-symphony"],
    },
    {
      name: "Royal Oval Halo Pave Engagement Ring",
      slug: "royal-oval-halo-pave-engagement-ring",
      sku: "RS-RG-002",
      categorySlug: "rings",
      shortDescription: "Mesmerizing 2.0ct oval diamond enhanced with a delicate micro-pavé halo and diamond shank.",
      description: "Engineered to elongate the finger and capture optimal light, the central oval diamond is encircled by a hidden halo and seamless pavé diamonds flowing halfway along the 18K rose gold band.",
      price: 540000,
      discountedPrice: 499000,
      material: "18K Rose Gold",
      purity: "18K (750 Hallmarked)",
      weight: "5.20 grams",
      stoneDetails: "Center: 2.00ct Oval Cut (E / VS1), Accent Diamonds: 0.45ct TW",
      dimensions: "Center stone: 9.8mm x 7.1mm",
      mainImage: "/images/Rings/royal-shine-oval-halo-pave-engagement-ring-original.png",
      isFeatured: true,
      isNewArrival: false,
      collections: ["royal-solitaire-symphony"],
    },
    {
      name: "Royal Navratna Emerald Statement Cocktail Ring",
      slug: "royal-navratna-emerald-statement-cocktail-ring",
      sku: "RS-RG-003",
      categorySlug: "rings",
      shortDescription: "Nine astrological sacred gemstones crowned by a vivid natural emerald.",
      description: "Harmonizing ancient cosmic vitality with contemporary jewellery aesthetics, this large cocktail ring features the nine sacred Navratna gems symmetrically set around a faceted green emerald.",
      price: 195000,
      material: "22K Yellow Gold",
      purity: "22K (916 BIS Hallmarked)",
      weight: "9.60 grams",
      stoneDetails: "Ruby, Pearl, Coral, Emerald, Yellow Sapphire, Diamond, Blue Sapphire, Hessonite, Cat's Eye",
      dimensions: "Cocktail Top Diameter: 24mm",
      mainImage: "/images/Rings/royal-shine-gold-navratna-emerald-gemstone-rings-original.png",
      isFeatured: false,
      isNewArrival: false,
      collections: ["temple-antiquities"],
    },
    {
      name: "Royal Eternal Love Couple Wedding Bands",
      slug: "royal-eternal-love-couple-wedding-bands",
      sku: "RS-RG-004",
      categorySlug: "rings",
      shortDescription: "Pair of matching two-tone 18K gold and platinum wedding bands with channel-set diamonds.",
      description: "Designed for a lifetime of devotion. His band features a brushed platinum center with high-polish rose gold beveled edges; her band sparkles with a channel of brilliant natural diamonds.",
      price: 185000,
      material: "18K Rose Gold & 950 Platinum",
      purity: "18K (750) & Platinum 950",
      weight: "12.40 grams total pair",
      stoneDetails: "Natural Brilliant Diamonds 0.35 Carats TW on Bride's Band",
      dimensions: "Groom: 5.5mm width; Bride: 3.8mm width",
      mainImage: "/images/Rings/royal-shine-gold-silver-couple-wedding-bands-original.png",
      isFeatured: false,
      isNewArrival: true,
      collections: ["royal-solitaire-symphony"],
    },
    {
      name: "Royal Men's Signet Gold Ring",
      slug: "royal-mens-signet-gold-ring",
      sku: "RS-RG-005",
      categorySlug: "rings",
      shortDescription: "Bold 22K yellow gold signet ring with geometric channel detailing.",
      description: "A commanding statement piece for the discerning gentleman. Cast in solid 22K gold with a refined satin-brushed face and mirror-polished borders.",
      price: 125000,
      material: "22K Solid Yellow Gold",
      purity: "22K (916 BIS Hallmarked)",
      weight: "14.20 grams",
      stoneDetails: "Subtle Princess Cut Diamond Accent 0.12ct",
      dimensions: "Face: 14mm x 12mm",
      mainImage: "/images/Rings/royal-shine-mens-gold-silver-premium-rings-original.png",
      isFeatured: false,
      isNewArrival: false,
      collections: [],
    },

    // Bangles & Bracelets
    {
      name: "Royal Kundan Meenakari Bridal Bangles (Pair)",
      slug: "royal-kundan-meenakari-bridal-bangles",
      sku: "RS-BG-001",
      categorySlug: "bangles-bracelets",
      shortDescription: "Heritage pair of 22K gold bangles with uncut polki on top and intricate peacock meenakari inside.",
      description: "Handcrafted by hereditary master artisans in Jaipur, this pair of bridal bangles features uncut polki stones set in pure gold foil, complemented by floral red and green enamel on the interior contour.",
      price: 580000,
      material: "22K Yellow Gold",
      purity: "22K (916 BIS Hallmarked)",
      weight: "74.00 grams (Pair)",
      stoneDetails: "Uncut Syndicate Polki Diamonds, Fine Jaipur Meenakari Enamel",
      dimensions: "Size: 2.6 (Custom sizing available)",
      mainImage: "/images/Braclets/royal-shine-gold-kundan-meenakari-bridal-bangles-original.png",
      isFeatured: true,
      isNewArrival: false,
      collections: ["imperial-bridal-heritage"],
    },
    {
      name: "Royal Diamond Tennis Bracelet (4.20ct)",
      slug: "royal-diamond-tennis-bracelet",
      sku: "RS-BG-002",
      categorySlug: "bangles-bracelets",
      shortDescription: "Iconic line bracelet of 4.20 carats round brilliant diamonds in 18K white gold.",
      description: "The hallmark of effortless modern luxury. A fluid line of 52 precisely matched round diamonds individually held in four-prong settings with an invisible safety clasp.",
      price: 390000,
      discountedPrice: 365000,
      material: "18K White Gold",
      purity: "18K (750 Hallmarked)",
      weight: "18.50 grams",
      stoneDetails: "4.20 Carats Total Weight, Round Brilliant Cut (Color: F-G, Clarity: VS)",
      dimensions: "Length: 7.0 inches (17.8 cm)",
      mainImage: "/images/Braclets/royal-shine-gold-white-gold-tennis-diamond-bracelets-original.png",
      isFeatured: true,
      isNewArrival: true,
      collections: ["royal-solitaire-symphony"],
    },
    {
      name: "Royal Traditional Gold Kada Bracelet",
      slug: "royal-traditional-gold-kada-bracelet",
      sku: "RS-BG-003",
      categorySlug: "bangles-bracelets",
      shortDescription: "Substantial 22K solid gold kada with screw lock and elephant head finials.",
      description: "A symbol of strength and nobility, this heavy handcrafted kada features antique matte-finish detailing with intricately sculpted elephant finials signifying royal prosperity.",
      price: 360000,
      material: "22K Antique Yellow Gold",
      purity: "22K (916 BIS Hallmarked)",
      weight: "48.00 grams",
      stoneDetails: "Solid Gold Sculpted Motif with Ruby Eyes",
      dimensions: "Inner diameter: 62mm with screw open mechanism",
      mainImage: "/images/Braclets/royal-shine-gold-silver-traditional-kada-bracelets-original.png",
      isFeatured: false,
      isNewArrival: false,
      collections: ["temple-antiquities"],
    },

    // Earrings
    {
      name: "Royal Bahubali Temple Gold Jhumka",
      slug: "royal-bahubali-temple-gold-jhumka",
      sku: "RS-ER-001",
      categorySlug: "earrings",
      shortDescription: "Opulent tiered temple jhumkas with ruby cabochons and natural pearl clusters.",
      description: "An iconic statement earring featuring a floral stud, bell-shaped tiered jhumki dome, and cascading natural seed pearls that sway gently with every step.",
      price: 275000,
      material: "22K Traditional Yellow Gold",
      purity: "22K (916 BIS Hallmarked)",
      weight: "36.50 grams",
      stoneDetails: "Natural Ruby Cabochons, Basra Seed Pearl drops",
      dimensions: "Height: 68mm, Dome Width: 28mm",
      mainImage: "/images/Earing/royal-shine-bahubali-temple-gold-silver-jhumka-original.png",
      isFeatured: true,
      isNewArrival: false,
      collections: ["temple-antiquities", "imperial-bridal-heritage"],
    },
    {
      name: "Royal Chandelier Diamond Waterfall Earrings",
      slug: "royal-chandelier-diamond-waterfall-earrings",
      sku: "RS-ER-002",
      categorySlug: "earrings",
      shortDescription: "Dazzling 3.40ct diamond chandeliers with pear and marquise shaped drops.",
      description: "Designed for gala evenings and grand receptions, these multi-tier chandelier earrings sparkle with hand-set pear and marquise cut diamonds mounted in 18K white gold.",
      price: 380000,
      discountedPrice: 350000,
      material: "18K White Gold",
      purity: "18K (750 Hallmarked)",
      weight: "22.40 grams",
      stoneDetails: "3.40 Carats Total Weight, Natural Diamonds (Color: E-F, Clarity: VVS-VS)",
      dimensions: "Drop Length: 55mm",
      mainImage: "/images/Earing/royal-shine-chandeliers-gold-silver-earrings-original.png",
      isFeatured: true,
      isNewArrival: true,
      collections: ["royal-solitaire-symphony"],
    },
    {
      name: "Royal Traditional Chandbali Earrings",
      slug: "royal-traditional-chandbali-earrings",
      sku: "RS-ER-003",
      categorySlug: "earrings",
      shortDescription: "Crescent moon shaped polki chandbalis with emerald bead fringe.",
      description: "Reminiscent of royal Awadhi courts, these crescent moon chandbalis are encrusted with flat-cut polki diamonds, fringed with emerald tumble beads and seed pearls.",
      price: 230000,
      material: "22K Yellow Gold",
      purity: "22K (916 BIS Hallmarked)",
      weight: "28.00 grams",
      stoneDetails: "Polki Uncut Diamonds, Emerald Beads, Pearls",
      dimensions: "Diameter: 42mm",
      mainImage: "/images/Earing/royal-shine-traditional-gold-silver-chandbali-earrings-original.png",
      isFeatured: false,
      isNewArrival: false,
      collections: ["imperial-bridal-heritage"],
    },

    // Bridal Jewellery
    {
      name: "Royal Imperial Kundan Polki Complete Bridal Set",
      slug: "royal-imperial-kundan-polki-complete-bridal-set",
      sku: "RS-BD-001",
      categorySlug: "bridal-jewellery",
      shortDescription: "The ultimate heirloom bridal treasure: Choker, Rani Haar, Matha Patti, Earrings, Haath Phool & Nath.",
      description: "An unmatched bridal trousseau suite created over 400 artisan hours. Incorporates pure 22K gold, certified syndicate polki, cabochon rubies, and untreated emerald strands. A true family heirloom designed to be cherished for generations.",
      price: 1850000,
      discountedPrice: 1750000,
      material: "22K Yellow Gold & Pure Silver Foil",
      purity: "22K (916 BIS Hallmarked)",
      weight: "320.00 grams complete set",
      stoneDetails: "Certified Syndicate Polki, Carved Zambian Emeralds, Burmese Rubies, Basra Pearls",
      dimensions: "Includes: Choker, Long Haar, Matha Patti, Jhumkas, Haath Phool Pair, Bridal Nath",
      mainImage: "/images/Bridal-jewellery/royal-shine-gold-kundan-polki-complete-bridal-jewellery-set-original.png",
      isFeatured: true,
      isNewArrival: false,
      collections: ["imperial-bridal-heritage"],
    },
    {
      name: "Royal Bridal Matha Patti",
      slug: "royal-bridal-matha-patti",
      sku: "RS-BD-002",
      categorySlug: "bridal-jewellery",
      shortDescription: "Triple-strand polki forehead band crowned with an ornate crescent center tikka.",
      description: "Framing the bride's face with celestial radiance, this matha patti features three strands of delicate polki florets and a central crescent tikka strung with south sea pearls.",
      price: 340000,
      material: "22K Yellow Gold",
      purity: "22K (916 BIS Hallmarked)",
      weight: "52.00 grams",
      stoneDetails: "Uncut Polki Diamonds, South Sea Seed Pearls",
      dimensions: "Headband length: 11 inches each side; Tikka length: 3 inches",
      mainImage: "/images/Bridal-jewellery/royal-shine-gold-kundan-pearl-bridal-matha-patti-original.png",
      isFeatured: false,
      isNewArrival: false,
      collections: ["imperial-bridal-heritage"],
    },
    {
      name: "Royal Bridal Kundan Haath Phool (Pair)",
      slug: "royal-bridal-kundan-haath-phool",
      sku: "RS-BD-003",
      categorySlug: "bridal-jewellery",
      shortDescription: "Delicate bridal hand harness connecting ring to wrist with floral polki medallions.",
      description: "Accentuating the bride's henna-adorned hands, this pair of haath phools features intricate floral polki center medallions linked to an adjustable ring and a filigree wrist bangle.",
      price: 290000,
      material: "22K Yellow Gold",
      purity: "22K (916 BIS Hallmarked)",
      weight: "45.00 grams (Pair)",
      stoneDetails: "Syndicate Polki, Pearl drops",
      dimensions: "Adjustable ring & wrist closure",
      mainImage: "/images/Bridal-jewellery/royal-shine-gold-kundan-polki-bridal-haath-phool-original.png",
      isFeatured: false,
      isNewArrival: false,
      collections: ["imperial-bridal-heritage"],
    },

    // Mangalsutra
    {
      name: "Royal Traditional Long Black Beads Mangalsutra",
      slug: "royal-traditional-long-black-beads-mangalsutra",
      sku: "RS-MS-001",
      categorySlug: "mangalsutra",
      shortDescription: "22K gold auspicious double-strand black beads chain with handcrafted floral wati pendant.",
      description: "Honoring enduring matrimonial traditions, this authentic 22K gold mangalsutra pairs auspicious black onyx and gold beads with dual hand-carved floral wati cups.",
      price: 195000,
      material: "22K Yellow Gold",
      purity: "22K (916 BIS Hallmarked)",
      weight: "28.50 grams",
      stoneDetails: "Auspicious Black Onyx Beads & 22K Solid Gold Pendant",
      dimensions: "Length: 30 inches",
      mainImage: "/images/Mangalsutra/royal-shine-gold-black-beads-traditional-mangalsutra-original.png",
      isFeatured: true,
      isNewArrival: false,
      collections: [],
    },
    {
      name: "Royal Modern Diamond Solitaire Mangalsutra",
      slug: "royal-modern-diamond-solitaire-mangalsutra",
      sku: "RS-MS-002",
      categorySlug: "mangalsutra",
      shortDescription: "Contemporary 0.75ct certified diamond pendant with subtle black bead chain in 18K rose gold.",
      description: "Designed for the modern professional woman. A stunning 0.75-carat round brilliant diamond bezel-set on a delicate 18K rose gold chain with minimalist black bead accents.",
      price: 165000,
      discountedPrice: 152000,
      material: "18K Rose Gold",
      purity: "18K (750 Hallmarked)",
      weight: "12.00 grams",
      stoneDetails: "0.75 Carat Natural Diamond (Color: F, Clarity: VS1) & Onyx Beads",
      dimensions: "Length: 18 inches adjustable",
      mainImage: "/images/Mangalsutra/royal-shine-diamond-solitaire-gold-mangalsutra-original.png",
      isFeatured: false,
      isNewArrival: true,
      collections: ["royal-solitaire-symphony"],
    },

    // Anklets & Payal
    {
      name: "Royal 22K Gold Heart Charm Twisted Rope Anklet",
      slug: "royal-22k-gold-heart-charm-twisted-rope-anklet",
      sku: "RS-AP-001",
      categorySlug: "anklets-payal",
      shortDescription: "Dainty 22K gold twisted rope anklet decorated with dangling high-polish heart charms.",
      description: "A playful yet luxurious accent for delicate ankles, crafted from resilient 22K gold twisted rope links adorned with dangling micro heart charms.",
      price: 110000,
      material: "22K Yellow Gold",
      purity: "22K (916 BIS Hallmarked)",
      weight: "18.00 grams",
      stoneDetails: "Solid Gold Charms",
      dimensions: "Length: 10 inches with 1-inch extension loop",
      mainImage: "/images/Anklets-Payal/royal-shine-22k-gold-heart-charm-twisted-rope-anklets-original.png",
      isFeatured: false,
      isNewArrival: true,
      collections: [],
    },
    {
      name: "Royal Bridal Kundan Payal with Pearl Ghungroo",
      slug: "royal-bridal-kundan-payal-pearl-ghungroo",
      sku: "RS-AP-002",
      categorySlug: "anklets-payal",
      shortDescription: "Magnificent bridal payal pair with kundan links and sweet resonant silver ghungroos.",
      description: "An essential component of the bride's Solah Shringar. Wide articulated panels with floral kundan stones and clusters of hand-soldered silver ghungroos producing a melodious chime.",
      price: 240000,
      material: "Silver with 22K Gold Foil",
      purity: "925 Silver & 22K Gold Plated",
      weight: "85.00 grams (Pair)",
      stoneDetails: "Kundan Stones, Cultured Seed Pearls, Silver Bells",
      dimensions: "Length: 10.5 inches each",
      mainImage: "/images/Anklets-Payal/royal-shine-gold-silver-kundan-bridal-payal-pearl-ghungroo-original.png",
      isFeatured: true,
      isNewArrival: false,
      collections: ["imperial-bridal-heritage"],
    },

    // Nose Pins & Rings
    {
      name: "Royal Bridal Kundan Pearl Floral Nath",
      slug: "royal-bridal-kundan-pearl-floral-nath",
      sku: "RS-NP-001",
      categorySlug: "nose-pins",
      shortDescription: "Traditional bridal nose ring with ruby floret, pearl cluster and delicate hair chain.",
      description: "Accentuating Indian bridal allure, this royal nath features a crescent gold ring with a ruby and polki flower, fringed with tiny freshwater pearls and accompanied by an embellished gold connecting chain.",
      price: 68000,
      material: "22K Yellow Gold",
      purity: "22K (916 BIS Hallmarked)",
      weight: "8.50 grams",
      stoneDetails: "Natural Ruby, Polki Kundan, Basra Seed Pearls",
      dimensions: "Ring Diameter: 32mm; Chain Length: 7.5 inches",
      mainImage: "/images/Nose-Pin/royal-shine-gold-ruby-pearl-silver-floral-bridal-nath-original.png",
      isFeatured: false,
      isNewArrival: false,
      collections: ["imperial-bridal-heritage"],
    },

    // Hair Accessories
    {
      name: "Royal Heritage Jhoomar Passa",
      slug: "royal-heritage-jhoomar-passa",
      sku: "RS-HA-001",
      categorySlug: "hair-accessories",
      shortDescription: "Imperial side-head ornament with fan-shaped polki motifs and emerald droplet fringes.",
      description: "Inspired by royal Mughal and Nawabi dynasties, this opulent jhoomar passa is worn on the side of the head. Features fan-shaped openwork filigree set with uncut polki diamonds and emerald tumble drops.",
      price: 260000,
      material: "22K Gold & Silver Foil",
      purity: "22K (916 BIS Hallmarked)",
      weight: "38.00 grams",
      stoneDetails: "Uncut Polki, Natural Emerald Drops, Seed Pearls",
      dimensions: "Length: 5.5 inches, Width: 3.2 inches",
      mainImage: "/images/Hair-Accessories/royal-shine-gold-kundan-polki-bridal-jhoomar-passa-original.png",
      isFeatured: true,
      isNewArrival: false,
      collections: ["imperial-bridal-heritage"],
    },

    // Silver Jewellery
    {
      name: "Royal 925 Sterling Silver Elegance Set",
      slug: "royal-925-sterling-silver-elegance-set",
      sku: "RS-SJ-001",
      categorySlug: "silver-jewellery",
      shortDescription: "4-piece jewelry set (Pendant, Earrings, Ring, Bracelet) in hallmarked 925 sterling silver.",
      description: "Handcrafted in pure 925 sterling silver and coated with triple rhodium anti-tarnish plating. Sparkling with precision-cut Swiss cubic zirconia, this versatile set transitions seamlessly from day to evening.",
      price: 38000,
      discountedPrice: 34500,
      material: "925 Sterling Silver (Rhodium Plated)",
      purity: "925 Hallmarked Sterling Silver",
      weight: "28.00 grams total",
      stoneDetails: "Hand-set Swiss Zirconia (Diamond-Simulant)",
      dimensions: "Pendant: 20mm; Earrings: 15mm; Ring Size: Adjustable",
      mainImage: "/images/Silver Jewellery/royal-shine-925-sterling-silver-pendant-studs-ring-bracelet-set-original.png",
      isFeatured: true,
      isNewArrival: true,
      collections: ["sterling-grace"],
    },
    {
      name: "Royal Oxidised Silver Tribal Heritage Choker",
      slug: "royal-oxidised-silver-tribal-heritage-choker",
      sku: "RS-SJ-002",
      categorySlug: "silver-jewellery",
      shortDescription: "Antique oxidised 925 silver choker with geometric motifs and matching jhumkis.",
      description: "Celebrating age-old nomadic silversmithing, this heavy oxidised choker features etched geometric medallions, fringe chains, and matching tribal jhumkis with a rich vintage patina.",
      price: 45000,
      material: "925 Oxidised Sterling Silver",
      purity: "925 Hallmarked Silver",
      weight: "92.00 grams",
      stoneDetails: "Pure Silver Hand-embossed with Black Patina",
      dimensions: "Choker Width: 38mm; Length: 14-16 inches adjustable",
      mainImage: "/images/Silver Jewellery/royal-shine-oxidised-silver-tribal-necklace-jhumka-bangle-ring-original.png",
      isFeatured: false,
      isNewArrival: false,
      collections: ["sterling-grace"],
    },
    {
      name: "Royal Pure Silver Lakshmi Ganesh Pooja Coins & Diya Suite",
      slug: "royal-pure-silver-lakshmi-ganesh-pooja-suite",
      sku: "RS-SJ-003",
      categorySlug: "silver-jewellery",
      shortDescription: "Sacred 999 fine silver embossed coins and ceremonial peacock diya in a velvet gift casket.",
      description: "An auspicious blessing for festivals, weddings, and housewarmings. Includes 999 purity certified silver Lakshmi & Ganesh coins, accompanied by a solid silver engraved peacock diya presented in a royal velvet box.",
      price: 32000,
      material: "999 Fine Silver",
      purity: "999 Pure Silver (Certified)",
      weight: "150.00 grams total silver",
      stoneDetails: "None (Solid 999 Fine Silver)",
      dimensions: "Coins: 38mm diameter; Diya: 75mm height",
      mainImage: "/images/Silver Jewellery/royal-shine-silver-lakshmi-ganesh-pooja-items-coins-diya-original.png",
      isFeatured: true,
      isNewArrival: false,
      collections: ["sterling-grace"],
    },
  ];

  for (const item of productsData) {
    const categoryId = categoryMap.get(item.categorySlug);
    if (!categoryId) {
      console.warn(`Category slug not found: ${item.categorySlug}`);
      continue;
    }

    const { categorySlug, collections, ...productFields } = item;

    const product = await prisma.product.upsert({
      where: { slug: item.slug },
      update: {
        ...productFields,
        categoryId,
      },
      create: {
        ...productFields,
        categoryId,
      },
    });

    // Add main product image to gallery
    await prisma.productImage.deleteMany({
      where: { productId: product.id },
    });

    await prisma.productImage.create({
      data: {
        productId: product.id,
        url: item.mainImage,
        alt: item.name,
        sortOrder: 0,
        isThumbnail: true,
      },
    });

    // Connect to collections
    if (collections && collections.length > 0) {
      for (const colSlug of collections) {
        const collectionId = collectionMap.get(colSlug);
        if (collectionId) {
          await prisma.collectionProduct.upsert({
            where: {
              collectionId_productId: {
                collectionId,
                productId: product.id,
              },
            },
            update: {},
            create: {
              collectionId,
              productId: product.id,
              sortOrder: 0,
            },
          });
        }
      }
    }
  }
  console.log(`✅ ${productsData.length} Products seeded with galleries and collection mappings.`);

  // 6. Seed Hero Banners
  const bannersData = [
    {
      title: "The Royal Symphony of Fine Jewels",
      subtitle: "Discover bespoke 22K gold, certified diamonds and heirloom bridal masterpieces crafted for royalty.",
      linkUrl: "/collections/imperial-bridal-heritage",
      imageUrl: "/images/Bridal-jewellery/royal-shine-bridal-jewellery-collection-hero.webp",
      position: BannerPosition.HERO,
      displayOrder: 1,
      isActive: true,
    },
    {
      title: "Solitaires of Pure Brilliance",
      subtitle: "GIA-certified natural diamonds curated to commemorate life's most precious milestones.",
      linkUrl: "/collections/royal-solitaire-symphony",
      imageUrl: "/images/Rings/royal-shine-rings-collection-hero.webp",
      position: BannerPosition.HERO,
      displayOrder: 2,
      isActive: true,
    },
    {
      title: "Sacred South Indian Temple Artistry",
      subtitle: "Timeless Nakshi hand-carvings paying homage to divinity and heritage.",
      linkUrl: "/collections/temple-antiquities",
      imageUrl: "/images/necjlace/royal-shine-necklace-collection-hero.webp",
      position: BannerPosition.HERO,
      displayOrder: 3,
      isActive: true,
    },
  ];

  for (let i = 0; i < bannersData.length; i++) {
    const b = bannersData[i];
    const existing = await prisma.banner.findFirst({ where: { title: b.title } });
    if (!existing) {
      await prisma.banner.create({ data: b });
    }
  }
  console.log(`✅ ${bannersData.length} Banners seeded.`);

  // 7. Seed Testimonials
  const testimonialsData = [
    {
      customerName: "Maharani Gayatri Devi Estate Trust",
      location: "Jaipur, Rajasthan",
      quote:
        "Royal Shine Jewellery delivered an heirloom bridal set of transcendent magnificence. The polki precision and emerald hues exceeded our highest expectations.",
      rating: 5,
      isPublished: true,
      displayOrder: 1,
    },
    {
      customerName: "Dr. Ananya Singhania",
      location: "South Mumbai",
      quote:
        "My 2-carat solitaire engagement ring from Royal Shine is simply breathtaking. The fire, clarity and customer service was truly world-class.",
      rating: 5,
      isPublished: true,
      displayOrder: 2,
    },
    {
      customerName: "Vikramaditya & Radhika Mittal",
      location: "New Delhi",
      quote:
        "From our initial WhatsApp enquiry to customising our wedding bands and temple necklace, Royal Shine showed exemplary transparency, hallmark certifications, and integrity.",
      rating: 5,
      isPublished: true,
      displayOrder: 3,
    },
  ];

  for (const t of testimonialsData) {
    const existing = await prisma.testimonial.findFirst({ where: { customerName: t.customerName } });
    if (!existing) {
      await prisma.testimonial.create({ data: t });
    }
  }
  console.log(`✅ ${testimonialsData.length} Testimonials seeded.`);

  // 8. Seed Initial Sample Enquiries
  const sampleEnquiries = [
    {
      customerName: "Pooja Malhotra",
      email: "pooja.malhotra@gmail.com",
      phone: "+91 98201 12345",
      message:
        "I am looking for the Royal Imperial Kundan Polki Complete Bridal Set for my wedding in December. Could you please share customization options and appointment availability at your Mumbai boutique?",
      status: EnquiryStatus.NEW,
      preferredMethod: PreferredContactMethod.WHATSAPP,
      internalNotes: "High-value prospective bride. Wedding date in Dec. Schedule VIP consultation.",
      productSlug: "royal-imperial-kundan-polki-complete-bridal-set",
    },
    {
      customerName: "Rajeshwar Rao",
      email: "r.rao@hyderabadestate.in",
      phone: "+91 98490 67890",
      message:
        "Interested in the Royal Lakshmi Peacock Temple Heritage Necklace. Can this be customized in 24K gold foil setting with certified Colombian emeralds?",
      status: EnquiryStatus.CONTACTED,
      preferredMethod: PreferredContactMethod.PHONE,
      internalNotes: "Spoke on 18 Nov. Customer requested custom weight breakdown. Sent via WhatsApp.",
      productSlug: "royal-lakshmi-peacock-temple-necklace",
    },
  ];

  for (const enq of sampleEnquiries) {
    const prod = await prisma.product.findUnique({ where: { slug: enq.productSlug } });
    const existing = await prisma.enquiry.findFirst({ where: { email: enq.email } });
    if (!existing) {
      await prisma.enquiry.create({
        data: {
          customerName: enq.customerName,
          email: enq.email,
          phone: enq.phone,
          message: enq.message,
          status: enq.status,
          preferredMethod: enq.preferredMethod,
          internalNotes: enq.internalNotes,
          productId: prod?.id,
        },
      });
    }
  }
  console.log(`✅ Initial Enquiries seeded.`);

  console.log("💎 Royal Shine database seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

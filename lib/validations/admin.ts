import { z } from "zod";

export const adminLoginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

export const productSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters."),
  slug: z.string().min(2, "Slug must be at least 2 characters."),
  sku: z.string().min(2, "SKU is required."),
  categoryId: z.string().min(1, "Please select a category."),
  shortDescription: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  price: z.coerce.number().optional().nullable(),
  discountedPrice: z.coerce.number().optional().nullable(),
  currency: z.string().default("INR"),
  mainImage: z.string().min(1, "Main product image is required."),
  galleryImages: z.array(z.string()).optional(),
  material: z.string().optional().nullable(),
  purity: z.string().optional().nullable(),
  weight: z.string().optional().nullable(),
  stoneDetails: z.string().optional().nullable(),
  dimensions: z.string().optional().nullable(),
  inStock: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  isNewArrival: z.boolean().default(false),
  isPublished: z.boolean().default(true),
  collectionIds: z.array(z.string()).optional(),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
});

export const categorySchema = z.object({
  name: z.string().min(2, "Category name is required."),
  slug: z.string().min(2, "Slug is required."),
  description: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  heroBanner: z.string().optional().nullable(),
  displayOrder: z.coerce.number().default(0),
  isVisible: z.boolean().default(true),
});

export const collectionSchema = z.object({
  name: z.string().min(2, "Collection name is required."),
  slug: z.string().min(2, "Slug is required."),
  description: z.string().optional().nullable(),
  bannerImage: z.string().optional().nullable(),
  isFeatured: z.boolean().default(false),
  isPublished: z.boolean().default(true),
  displayOrder: z.coerce.number().default(0),
  productIds: z.array(z.string()).optional(),
});

export const enquiryUpdateSchema = z.object({
  status: z.enum(["NEW", "CONTACTED", "FOLLOW_UP", "RESOLVED", "CLOSED", "SPAM"]),
  internalNotes: z.string().optional().nullable(),
});

export const bannerSchema = z.object({
  title: z.string().min(2, "Title is required."),
  subtitle: z.string().optional().nullable(),
  linkUrl: z.string().optional().nullable(),
  imageUrl: z.string().min(1, "Image URL is required."),
  position: z.enum(["HERO", "PROMO_STRIP", "COLLECTION_FEATURE"]).default("HERO"),
  displayOrder: z.coerce.number().default(0),
  isActive: z.boolean().default(true),
});

export const testimonialSchema = z.object({
  customerName: z.string().min(2, "Customer name is required."),
  location: z.string().optional().nullable(),
  quote: z.string().min(5, "Quote is required."),
  rating: z.coerce.number().min(1).max(5).default(5),
  isPublished: z.boolean().default(true),
  displayOrder: z.coerce.number().default(0),
});

export const websiteSettingsSchema = z.object({
  brandName: z.string().min(2),
  tagLine: z.string().optional().nullable(),
  logoUrl: z.string().optional().nullable(),
  contactEmail: z.string().email(),
  phone: z.string().min(5),
  whatsappNumber: z.string().min(5),
  showroomAddress: z.string().min(5),
  businessHours: z.string().min(5),
  instagramUrl: z.string().optional().nullable(),
  facebookUrl: z.string().optional().nullable(),
  youtubeUrl: z.string().optional().nullable(),
  defaultCurrency: z.string().default("INR"),
  defaultSeoTitle: z.string().min(5),
  defaultSeoDescription: z.string().min(10),
});

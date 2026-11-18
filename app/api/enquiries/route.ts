import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { enquirySchema } from "@/lib/validations/enquiry";
import { EnquiryStatus, PreferredContactMethod } from "@prisma/client";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Check honeypot for bots
    if (body.honeypot && body.honeypot.trim() !== "") {
      return NextResponse.json({ success: true, message: "Enquiry submitted successfully." });
    }

    const validationResult = enquirySchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          errors: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { customerName, email, phone, message, preferredMethod, productId, sourceUrl } =
      validationResult.data;

    const enquiry = await prisma.enquiry.create({
      data: {
        customerName,
        email,
        phone,
        message,
        preferredMethod: preferredMethod as PreferredContactMethod,
        productId: productId || null,
        sourceUrl: sourceUrl || null,
        status: EnquiryStatus.NEW,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            sku: true,
          },
        },
      },
    });

    // Record activity log
    await prisma.activityLog.create({
      data: {
        action: "ENQUIRY_CREATED",
        entityType: "Enquiry",
        entityId: enquiry.id,
        details: `Customer ${customerName} submitted an enquiry${
          enquiry.product ? ` for ${enquiry.product.name} (${enquiry.product.sku})` : ""
        }.`,
      },
    });

    // Record analytics event
    await prisma.analyticsEvent.create({
      data: {
        eventType: "ENQUIRY_SUBMIT",
        entityId: enquiry.id,
        path: sourceUrl || "/contact",
        metadata: JSON.stringify({
          productId: enquiry.productId,
          preferredMethod,
        }),
      },
    });

    return NextResponse.json(
      {
        success: true,
        enquiryId: enquiry.id,
        message: "Thank you for reaching out to Royal Shine Jewellery. Our private jewellery concierge will contact you shortly.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to process enquiry:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred while processing your enquiry. Please try again or reach us directly on WhatsApp.",
      },
      { status: 500 }
    );
  }
}

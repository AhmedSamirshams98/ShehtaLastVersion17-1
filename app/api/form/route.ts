import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const {
      customer_name,
      phone_number,
      car_brand,
      car_model,
      car_description,
    } = await request.json();

    // Validation
    if (!customer_name || !phone_number || !car_brand || !car_model) {
      return NextResponse.json(
        { error: "جميع الحقول مطلوبة" },
        { status: 400 }
      );
    }

    // Create independent order (no relations)
    const order = await prisma.forms.create({
      data: {
        customer_name,
        phone_number,
        car_brand,
        car_model,
        car_description,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "تم إرسال طلبك بنجاح",
        order,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء إرسال الطلب" },
      { status: 500 }
    );
  }
}


export async function GET() {
  try {
    // First get all forms
    const forms = await prisma.forms.findMany({
      orderBy: {
        created_at: 'desc'
      }
    });

    // Then sort manually: pending first, completed last
    const sortedForms = forms.sort((a, b) => {
      if (a.status === 'completed' && b.status !== 'completed') {
        return 1; // a comes after b
      }
      if (a.status !== 'completed' && b.status === 'completed') {
        return -1; // a comes before b
      }
      // If same status, keep the original order (newest first)
      return 0;
    });

    return NextResponse.json({ forms: sortedForms });
  } catch (error) {
    console.error("Error fetching forms:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب الطلبات" },
      { status: 500 }
    );
  }
}

// PUT تحديث حالة الطلب - 
export async function PUT(request: NextRequest) {
  try {
    const { id, status } = await request.json();

    if (!id || !status) {
      return NextResponse.json(
        { error: "معرف الطلب والحالة مطلوبان" },
        { status: 400 }
      );
    }

    const updatedForm = await prisma.forms.update({
      where: { id: parseInt(id) },
      data: { status }
    });

    return NextResponse.json({
      success: true,
      message: "تم تحديث حالة الطلب بنجاح",
      form: updatedForm
    });
  } catch (error) {
    console.error("Error updating form:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء تحديث الطلب" },
      { status: 500 }
    );
  }
}
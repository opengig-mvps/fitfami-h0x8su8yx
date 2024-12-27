import { NextResponse } from 'next/server';
import { razorpayCheckout } from '@/modules/razorpay';
import prisma from '@/lib/prisma';

type CreateOrderRequestBody = {
  amount: number;
  receipt: string;
  notes: Record<string, string>;
};

export async function POST(request: Request) {
  try {
    const body: CreateOrderRequestBody = await request.json();
    const { amount, receipt, notes } = body;

    const order = await razorpayCheckout.createOrder({
      amount,
      receipt,
      notes,
    });

    // Assuming userId is fetched from session or context
    const userId = ''; // Replace with actual user ID fetching logic

    await prisma.payment.create({
      data: {
        amount,
        paymentStatus: 'created',
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Razorpay order created successfully',
        data: { orderId: order.id },
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 },
    );
  }
}
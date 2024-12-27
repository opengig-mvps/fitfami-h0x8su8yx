import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { stripeCheckout } from '@/modules/stripe';

type StripeSessionRequestBody = {
  priceId: string;
  successUrl: string;
  cancelUrl: string;
  mode: 'payment';
};

export async function POST(request: Request) {
  try {
    const body: StripeSessionRequestBody = await request.json();
    const { priceId, successUrl, cancelUrl, mode } = body;

    if (!priceId || !successUrl || !cancelUrl || !mode) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const session = await stripeCheckout.createOneTimePaymentSession({
      amount: 2000,
      successUrl,
      cancelUrl,
    });

    // Replace 'user_id_placeholder' with the actual user ID logic
    const userId = 'user_id_placeholder';

    await prisma.payment.create({
      data: {
        amount: 2000,
        paymentStatus: 'pending',
        userId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Stripe payment session created successfully',
        data: {
          sessionId: session.id,
          sessionUrl: session.url,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating Stripe session:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
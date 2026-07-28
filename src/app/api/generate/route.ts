import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { vibe, premium } = body;

    if (!vibe) {
      return NextResponse.json({ error: 'Vibe parameter is required' }, { status: 400 });
    }

    // Official x402 Micropayment Interception Spec
    // Returns HTTP 402 with headers describing merchant destination and price
    if (premium) {
      return NextResponse.json(
        {
          error: 'Payment Required',
          paymentRequired: true,
          priceInSol: 0.003,
          merchantWallet: 'BLUeAI402zK2fQ4uK5X9wPqZsT7gXnLv9yR2K9dF3s',
          reason: 'Deep itinerary optimization AI compute cost',
          invoiceId: Math.random().toString(36).substring(2, 11)
        },
        { 
          status: 402,
          headers: {
            'X-402-Payment-To': 'BLUeAI402zK2fQ4uK5X9wPqZsT7gXnLv9yR2K9dF3s',
            'X-402-Amount-SOL': '0.003',
            'X-402-Reason': 'Deep route optimization'
          }
        }
      );
    }

    // Standard fallback response
    return NextResponse.json({
      success: true,
      message: 'Standard route generated successfully',
      vibe
    });
  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


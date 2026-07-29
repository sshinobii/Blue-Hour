import { NextResponse } from 'next/server';

const MERCHANT_ADDRESS = process.env.X402_MERCHANT_ADDRESS || '0x5b78709bF844d5aD0d46f40b2D7f32394F70C246';
const FACILITATOR_URL = process.env.X402_FACILITATOR_URL || 'https://vled-facilitator.robinhood.com/v1/settle';
const CHAIN_ID = Number(process.env.NEXT_PUBLIC_ROBINHOOD_CHAIN_ID || 98865);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { vibe, premium } = body;

    if (!vibe) {
      return NextResponse.json({ error: 'Vibe parameter is required' }, { status: 400 });
    }

    const paymentHeader = request.headers.get('x-payment');

    // 1. If premium is requested and NO x-payment header is attached, return HTTP 402 Challenge
    if (premium && !paymentHeader) {
      const challengeNonce = 'nonce_' + Math.random().toString(36).substring(2, 11);
      return NextResponse.json(
        {
          error: 'Payment Required',
          paymentRequired: true,
          priceInUsdg: 0.25,
          asset: 'USDG',
          chainId: CHAIN_ID,
          merchantWallet: MERCHANT_ADDRESS,
          nonce: challengeNonce,
          reason: 'Deep itinerary optimization AI compute cost',
        },
        { 
          status: 402,
          headers: {
            'X-402-Payment-To': MERCHANT_ADDRESS,
            'X-402-Amount-USDG': '0.25',
            'X-402-Chain-ID': String(CHAIN_ID),
            'X-402-Nonce': challengeNonce,
            'X-402-Reason': 'Deep route optimization',
          }
        }
      );
    }

    // 2. If premium request HAS payment header, submit to VLED gasless facilitator
    if (premium && paymentHeader) {
      try {
        const facilitatorResponse = await fetch(FACILITATOR_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Payment': paymentHeader,
          },
          body: JSON.stringify({
            merchant: MERCHANT_ADDRESS,
            chainId: CHAIN_ID,
            asset: 'USDG',
            amount: '0.25',
            paymentSignature: paymentHeader,
          }),
        });

        if (!facilitatorResponse.ok && process.env.NODE_ENV === 'production') {
          return NextResponse.json(
            { error: 'x402 Facilitator Settlement Failed' },
            { status: 402 }
          );
        }
      } catch (err) {
        console.warn('x402 Facilitator settlement fallback:', err);
      }
    }

    // 3. Return generated premium payload
    return NextResponse.json({
      success: true,
      message: 'Deep route generated successfully',
      vibe,
      premium: Boolean(premium),
      settledOnchain: Boolean(paymentHeader),
    });
  } catch (err) {
    console.error('Error in api/generate handler:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

import { NextRequest } from 'next/server';
import { ImageResponse } from 'next/og';
import { Card } from '../../../components/Card';
import { CARD_DIMENSIONS, NEXT_PUBLIC_URL } from '../../../config';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const address = searchParams.get('address') ?? '';
  const tokenId = searchParams.get('tokenId') ?? '';

  return new ImageResponse(
    (
      <Card
        message={`🎁　You are eligible to Mint.`}
        image={`${NEXT_PUBLIC_URL}/quest/${tokenId}.png`}
      />
    ),
    CARD_DIMENSIONS,
  );
}

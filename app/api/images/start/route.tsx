import { ImageResponse } from 'next/og';
import { Card } from '../../../components/Card';
import { CARD_DIMENSIONS, NEXT_PUBLIC_URL } from '../../../config';

export async function GET() {
  return new ImageResponse(
    (
      <Card
        message="Build your web3 cities from your wallet activities"
        image={`${NEXT_PUBLIC_URL}/phi-start.png`}
      />
    ),
    CARD_DIMENSIONS,
  );
}

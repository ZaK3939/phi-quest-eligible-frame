import { ImageResponse } from 'next/og';
import { Card } from '../../../components/Card';
import { CARD_DIMENSIONS, NEXT_PUBLIC_URL } from '../../../config';

export async function GET() {
  return new ImageResponse(
    <Card message="Something went wrong. Try again later." image={`${NEXT_PUBLIC_URL}/phi.png`} />,
    CARD_DIMENSIONS,
  );
}

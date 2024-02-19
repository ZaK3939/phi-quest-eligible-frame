import { ImageResponse } from 'next/og';
import { Card } from '../../../components/Card';
import { CARD_DIMENSIONS, NEXT_PUBLIC_URL } from '../../../config';

export async function GET() {
  return new ImageResponse(
    <Card message="Your eligible check is in the queue." image={`${NEXT_PUBLIC_URL}/phi404.png`} />,
    CARD_DIMENSIONS,
  );
}

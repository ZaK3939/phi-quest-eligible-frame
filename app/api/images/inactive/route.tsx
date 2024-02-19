import { ImageResponse } from 'next/og';
import { Card } from '../../../components/Card';
import { CARD_DIMENSIONS, NEXT_PUBLIC_URL } from '../../../config';

export async function GET() {
  return new ImageResponse(
    (
      <Card
        message="Sorry, you don't have any completed quests. Check out the list of quests below."
        image={`${NEXT_PUBLIC_URL}/Dotty.png`}
      />
    ),
    CARD_DIMENSIONS,
  );
}

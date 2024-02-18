import { NextRequest } from 'next/server';
import { ImageResponse } from 'next/og';
import { Card } from '../../../components/Card';
import { CARD_DIMENSIONS } from '../../../config';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const address = searchParams.get('address') ?? '';
  const tokenId = searchParams.get('tokenId') ?? '';

  return new ImageResponse(<Card message={`Mint ${tokenId} to ${address}?`} />, CARD_DIMENSIONS);
}

import { NextResponse } from 'next/server';
import { NEXT_PUBLIC_URL } from '../config';
import { getFrameHtml } from './getFrameHtml';

export function errorResponse() {
  return new NextResponse(
    getFrameHtml({
      image: `${NEXT_PUBLIC_URL}/api/images/error`,
    }),
  );
}

export async function mintResponse() {
  return new NextResponse(
    getFrameHtml({
      buttons: [
        {
          label: 'Mint',
          action: 'mint',
          target: `eip155:137:0xc6E5240054DBE92BDe25546cF0C72dC499c41Ca8:101502`,
        },
      ],
      image: `${NEXT_PUBLIC_URL}/api/images/inactive`,
    }),
  );
}

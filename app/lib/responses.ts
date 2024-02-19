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

export function No_Verified_accounts(fid: number) {
  return new NextResponse(
    getFrameHtml({
      buttons: [
        {
          label: 'Verify Account',
          action: 'link',
          target: `https://verify.warpcast.com/verify/${fid}`,
        },
      ],
      image: `${NEXT_PUBLIC_URL}/api/images/verify`,
    }),
  );
}

export async function mintResponse() {
  return new NextResponse(
    getFrameHtml({
      buttons: [
        {
          label: 'Phi Quest',
          action: 'link',
          target: 'https://quest.philand.xyz/',
        },
      ],
      image: `${NEXT_PUBLIC_URL}/api/images/inactive`,
    }),
  );
}

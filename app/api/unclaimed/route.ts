import { FrameRequest, getFrameMessage, FrameValidationData } from '@coinbase/onchainkit';
import { NextRequest, NextResponse } from 'next/server';
import { NEXT_PUBLIC_URL, queryForClaimDirect } from '../../config';
import { getAddresses } from '../../lib/addresses';
import { allowedOrigin } from '../../lib/origin';
import { getFrameHtml } from '../../lib/getFrameHtml';
import { mintResponse } from '../../lib/responses';

function validButton(message?: FrameValidationData) {
  return message?.button && message?.button > 0 && message?.button < 5;
}

async function getResponse(req: NextRequest): Promise<NextResponse> {
  const body: FrameRequest = await req.json();
  const { isValid, message } = await getFrameMessage(body, {
    neynarApiKey: process.env.NEYNAR_API_KEY,
  });

  if (isValid && validButton(message) && allowedOrigin(message)) {
    const address = message.interactor.verified_accounts[0].toLowerCase();
    const result = await queryForClaimDirect(address);
    if (result) {
      const addresses = getAddresses(message.interactor);
      const address = addresses[message.button - 1];
      const tokenId = result[0];
      return new NextResponse(
        getFrameHtml({
          buttons: [
            {
              action: 'link',
              label: '✅ Mint',
              target: `https://quest.philand.xyz/items/0x3D8C06e65ebf06A9d40F313a35353be06BD46038/${tokenId}`,
            },
          ],
          image: `${NEXT_PUBLIC_URL}/api/images/confirm?address=${address}&tokenId=${tokenId}`,
        }),
      );
    } else {
      return mintResponse();
    }
  } else return new NextResponse('Unauthorized', { status: 401 });
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';

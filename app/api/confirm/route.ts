import { FrameRequest, getFrameMessage, FrameValidationData } from '@coinbase/onchainkit';
import { NextRequest, NextResponse } from 'next/server';
import { NEXT_PUBLIC_URL, PHI_GRAPH, queryForClaim, queryForLand } from '../../config';
import { getAddresses } from '../../lib/addresses';
import { allowedOrigin } from '../../lib/origin';
import { getFrameHtml } from '../../lib/getFrameHtml';
import { mintResponse } from '../../lib/responses';
import { retryableApiPost } from '../../lib/retry';
import { ClaimedStatusResponse, LandResponse } from '../../lib/types';

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
    const result = await retryableApiPost<ClaimedStatusResponse>(PHI_GRAPH, {
      query: queryForClaim(address),
    });
    console.log(result);
    if (result.data && result.data.claimedStatus.data) {
      const addresses = getAddresses(message.interactor);
      const address = addresses[message.button - 1];

      return new NextResponse(
        getFrameHtml({
          buttons: [{ label: '⬅️ Back' }, { label: '✅ Mint' }],
          image: `${NEXT_PUBLIC_URL}/api/images/confirm?address=${address}`,
          post_url: `${NEXT_PUBLIC_URL}/api/relay`,
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

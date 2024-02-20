import { FrameRequest, getFrameMessage } from '@coinbase/onchainkit';
import { NextRequest, NextResponse } from 'next/server';

import { NEXT_PUBLIC_URL, PHI_GRAPH, conditionTrigger, queryForClaimDirect } from '../../config';
import { getAddressButtons } from '../../lib/addresses';
import { allowedOrigin } from '../../lib/origin';
import { getFrameHtml } from '../../lib/getFrameHtml';
import { TriggerResponse } from '../../lib/types';
import { No_Verified_accounts, errorResponse } from '../../lib/responses';
import { retryableApiPost } from '../../lib/retry';
import { createCacheBustedImageUrl } from '../../lib/timestamp';

async function getResponse(req: NextRequest): Promise<NextResponse> {
  const body: FrameRequest = await req.json();
  const { isValid, message } = await getFrameMessage(body, {
    neynarApiKey: process.env.NEYNAR_API_KEY,
  });

  if (message?.button === 2 && isValid && allowedOrigin(message)) {
    if (!message?.interactor.verified_accounts)
      return No_Verified_accounts(message?.interactor.fid);
    for (const address of message?.interactor.verified_accounts) {
      if (address) {
        const result = await retryableApiPost<TriggerResponse>(PHI_GRAPH, {
          query: conditionTrigger(address),
        });
        queryForClaimDirect(address); // to create cache
        if (!result.data?.conditionTrigger.success) {
          console.log('conditionTrigger failed', result);
          return errorResponse();
        }
      }
    }

    const buttons = getAddressButtons(message.interactor);
    const post_url = createCacheBustedImageUrl(`${NEXT_PUBLIC_URL}/api/unclaimed`);
    return new NextResponse(
      getFrameHtml({
        buttons,
        image: `${NEXT_PUBLIC_URL}/api/images/unclaimed`,
        post_url,
      }),
    );
  } else return new NextResponse('Unauthorized', { status: 401 });
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';

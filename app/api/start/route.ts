import { FrameRequest, getFrameMessage } from '@coinbase/onchainkit';
import { NextRequest, NextResponse } from 'next/server';

import { NEXT_PUBLIC_URL, PHI_GRAPH, conditionTrigger, queryForLand } from '../../config';
import { getAddressButtons } from '../../lib/addresses';
import { allowedOrigin } from '../../lib/origin';
import { getFrameHtml } from '../../lib/getFrameHtml';
import { TriggerResponse } from '../../lib/types';
import { mintResponse } from '../../lib/responses';
import { retryableApiPost } from '../../lib/retry';

async function getResponse(req: NextRequest): Promise<NextResponse> {
  const body: FrameRequest = await req.json();
  const { isValid, message } = await getFrameMessage(body, {
    neynarApiKey: process.env.NEYNAR_API_KEY,
  });

  if (message?.button === 1 && isValid && allowedOrigin(message)) {
    console.log('message', message);
    const address = message.interactor.verified_accounts[0].toLowerCase();
    const result = await retryableApiPost<TriggerResponse>(PHI_GRAPH, {
      query: conditionTrigger(address),
    });
    console.log('result', result);
    if (result && result.conditionTrigger.success) {
      const fid = message.interactor.fid;

      // if (transactionId) {
      //   // Mint in queue
      //   return new NextResponse(
      //     getFrameHtml({
      //       buttons: [
      //         {
      //           label: '🔄 Check status',
      //         },
      //       ],
      //       image: `${NEXT_PUBLIC_URL}/api/images/check`,
      //       post_url: `${NEXT_PUBLIC_URL}/api/check`,
      //     }),
      //   );
      // } else {
      const buttons = getAddressButtons(message.interactor);
      return new NextResponse(
        getFrameHtml({
          buttons,
          image: `${NEXT_PUBLIC_URL}/api/images/select`,
          post_url: `${NEXT_PUBLIC_URL}/api/confirm`,
        }),
      );
      // }
    } else {
      return mintResponse();
    }
  } else return new NextResponse('Unauthorized', { status: 401 });
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';

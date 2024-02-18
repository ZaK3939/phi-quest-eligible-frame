import { FrameRequest, getFrameMessage } from '@coinbase/onchainkit';
import { NextRequest, NextResponse } from 'next/server';
import { NEXT_PUBLIC_URL, PHI_GRAPH, queryForLand } from '../../config';
import { allowedOrigin } from '../../lib/origin';
import { getFrameHtml } from '../../lib/getFrameHtml';
import { LandResponse } from '../../lib/types';
import { errorResponse } from '../../lib/responses';
import { retryableApiPost } from '../../lib/retry';

async function getResponse(req: NextRequest): Promise<NextResponse> {
  const body: FrameRequest = await req.json();
  const { isValid, message } = await getFrameMessage(body, {
    neynarApiKey: process.env.NEYNAR_API_KEY,
  });

  if (message?.button === 1 && isValid && allowedOrigin(message)) {
    const address = message.interactor.verified_accounts[0].toLowerCase();
    const result = await retryableApiPost<LandResponse>(PHI_GRAPH, {
      query: queryForLand(address),
    });
    if (result.data && result.data.philandList.data) {
      return new NextResponse(
        getFrameHtml({
          buttons: [
            {
              label: '🔄 Check status',
            },
          ],
          post_url: `${NEXT_PUBLIC_URL}/api/check`,
          image: `${NEXT_PUBLIC_URL}/api/images/check`,
        }),
      );
    } else {
      return errorResponse();
    }
  } else return new NextResponse('Unauthorized', { status: 401 });
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';

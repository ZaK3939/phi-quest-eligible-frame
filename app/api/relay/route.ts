import { FrameRequest, getFrameMessage } from '@coinbase/onchainkit';
import { kv } from '@vercel/kv';
import { NextRequest, NextResponse } from 'next/server';
import { NEXT_PUBLIC_URL, PHI_GRAPH, queryForLand } from '../../config';
import { getAddressButtons } from '../../lib/addresses';
import signMintData from '../../lib/signMint';
import { allowedOrigin } from '../../lib/origin';
import { getFrameHtml } from '../../lib/getFrameHtml';
import { errorResponse, mintResponse } from '../../lib/responses';
import { LandResponse, Session } from '../../lib/types';
import { retryableApiPost } from '../../lib/retry';

async function getResponse(req: NextRequest): Promise<NextResponse> {
  const body: FrameRequest = await req.json();
  const { isValid, message } = await getFrameMessage(body, {
    neynarApiKey: process.env.NEYNAR_API_KEY,
  });

  if (isValid && allowedOrigin(message)) {
    if (message.button === 1) {
      const buttons = getAddressButtons(message.interactor);
      return new NextResponse(
        getFrameHtml({
          buttons,
          image: `${NEXT_PUBLIC_URL}/api/images/select`,
          post_url: `${NEXT_PUBLIC_URL}/api/confirm`,
        }),
      );
    }

    const isActive = message.raw.action.interactor.active_status === 'active';
    const fid = message.interactor.fid;
    let session = ((await kv.get(`session:${fid}`)) ?? {}) as Session;
    const address = message.interactor.verified_accounts[0].toLowerCase();
    const result = await retryableApiPost<LandResponse>(PHI_GRAPH, {
      query: queryForLand(address),
    });

    if ((isActive || (result.data && result.data.philandList.data)) && session?.address) {
      const { address } = session;
      const sig = await signMintData({
        to: address,
        tokenId: 1,
        fid,
      });
      // args: [address, 1, fid, sig],
      console.log('body.trustedData', body.trustedData);
      const postBody = JSON.stringify({
        frameTrustedData: body.trustedData.messageBytes,
        contractAddress: process.env.MINER_CONTRACT_ADDRESS,
        functionSignature: 'mint(address to, uint256 tokenId, uint256 fid, bytes calldata sig)',
        args: { to: address, amount: 1, fid: fid, sig: sig },
      });
      // console.log('postBody', postBody);
      const res = await fetch('https://frame.syndicate.io/api/v2/sendTransaction', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${process.env.SYNDICATE_API_KEY}`,
        },
        body: postBody,
        // body: JSON.stringify({
        //   frameTrustedData: body.trustedData.messageBytes,
        //   contractAddress: '0xa4d2e7e997A837e6CB6Cf0C1607D93955C31AF7a',
        //   // contractAddress: process.env.MINER_CONTRACT_ADDRESS,
        //   functionSignature: 'mint(address to)',
        //   args: { to: address },
        // }),
      });
      console.log('response syndicate frame', res);

      if (res.status === 200) {
        const {
          success,
          data: { transactionId },
        } = await res.json();
        if (success) {
          session = { ...session, transactionId };
          await kv.set(`session:${fid}`, session);
          const res = await fetch(
            `https://frame.syndicate.io/api/transaction/${transactionId}/hash`,
            {
              headers: {
                'content-type': 'application/json',
                Authorization: `Bearer ${process.env.SYNDICATE_API_KEY}`,
              },
            },
          );
          if (res.status === 200) {
            console.log(
              'res',
              res,
              `https://frame.syndicate.io/api/transaction/${transactionId}/hash`,
              'go to check',
            );
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
          }
        }
      }
      return errorResponse();
    } else {
      return mintResponse();
    }
  } else return new NextResponse('Unauthorized', { status: 401 });
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';

import { getFrameMetadata } from '@coinbase/onchainkit';
import type { Metadata } from 'next';
import { NEXT_PUBLIC_URL } from './config';

export async function generateMetadata(): Promise<Metadata> {
  const frameMetadata = getFrameMetadata({
    buttons: [
      {
        action: 'link',
        label: 'Whats Philand?',
        target: 'https://philand.xyz/',
      },
      {
        label: 'Check eligibility',
      },
    ],
    image: `${NEXT_PUBLIC_URL}/api/images/start`,
    post_url: `${NEXT_PUBLIC_URL}/api/start`,
  });

  return {
    title: 'Philand',
    description: "Check if you're eligible for a mint",
    openGraph: {
      title: 'Philand',
      description: "Check if you're eligible for a mint",
      images: [`${NEXT_PUBLIC_URL}/api/images/start`],
    },
    other: {
      ...frameMetadata,
      'fc:frame:image:aspect_ratio': '1:1',
    },
  };
}

export default async function Page() {
  return <></>;
}

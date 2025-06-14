//@ts-check
import { withPayload } from '@payloadcms/next/withPayload';
// eslint-disable-next-line @typescript-eslint/no-var-requires
import { composePlugins, withNx } from '@nx/next';

/** @type {import('next').NextConfig & import('@nx/next/plugins/with-nx').WithNxOptions} */
const nextConfig = {
  // Your Next.js config here
  // Use this to set Nx-specific options
  // See: https://nx.dev/recipes/next/next-config-setup
  nx: {},
}

const payloadNextonfig = withPayload(nextConfig, { devBundleServerPackages: false });
//export default payloadNextonfig;

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
];

export default composePlugins(...plugins)(/**@type {import('@nx/next/plugins/with-nx').WithNxOptions}*/(payloadNextonfig));

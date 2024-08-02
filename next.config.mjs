/** @type {import('next').NextConfig} */
import withPWA from 'next-pwa';

const nextConfig = withPWA({
    dest: 'public',
    register: true,
    skipWaiting: true,
});

export default {
    output: 'export',
    experimental: {
        appDir: true,
    },
    images: {
        unoptimized: true,
    },
    pwa: {
        dest: 'public',
    },
    ...nextConfig, // Spread the properties of nextConfig
};
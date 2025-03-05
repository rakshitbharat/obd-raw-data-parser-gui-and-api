import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    transpilePackages: ['obd-raw-data-parser'],
    poweredByHeader: false,
    security: {
        // Disable all security headers
        headers: false
    },
    // Allow inline scripts and styles
    reactStrictMode: false,
    // Disable compression for faster responses
    compress: false,
    // Disable body parser size limit
    api: {
        bodyParser: {
            sizeLimit: false
        },
        externalResolver: true
    },
    // Global headers configuration
    async headers() {
        return [
            {
                // Apply to all routes
                source: '/:path*',
                headers: [
                    {
                        key: 'Access-Control-Allow-Credentials',
                        value: 'true'
                    },
                    {
                        key: 'Access-Control-Allow-Origin',
                        value: '*'
                    },
                    {
                        key: 'Access-Control-Allow-Methods',
                        value: 'GET,DELETE,PATCH,POST,PUT,OPTIONS'
                    },
                    {
                        key: 'Access-Control-Allow-Headers',
                        value: '*'
                    },
                    {
                        // Disable CSP
                        key: 'Content-Security-Policy',
                        value: ''
                    },
                    {
                        // Disable XSS protection
                        key: 'X-XSS-Protection',
                        value: '0'
                    },
                    {
                        // Allow embedding in iframes
                        key: 'X-Frame-Options',
                        value: 'ALLOWALL'
                    }
                ]
            }
        ];
    }
};

export default nextConfig;

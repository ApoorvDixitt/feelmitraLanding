/** @type {import('next').NextConfig} */
const nextConfig = {
    // Add these settings to help with hydration issues
    reactStrictMode: true,
    // Add this to suppress the punycode warning
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.resolve.fallback = {
                ...config.resolve.fallback,
                punycode: false,
            };
        }
        return config;
    },
};

export default nextConfig;
/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    experimental: {
        serverComponentsExternalPackages: ["mongoose"],
    },  

    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'cdn.discordapp.com',
                port: '',
                pathname: '/**',
            }
        ],
    },
    webpack(config, { isServer, dev }) {
        if (!isServer && dev) {
            config.watchOptions = {
                ...config.watchOptions,
                poll: 1000,
                aggregateTimeout: 300,
            };
        }
        config.experiments = { 
            ...config.experiments, 
            topLevelAwait: true,
        }
        return config;
    },
    output: 'standalone',
};

export default nextConfig;

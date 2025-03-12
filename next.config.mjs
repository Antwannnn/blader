/** @type {import('next').NextConfig} */
const nextConfig = {
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
    webpack(config) {
        config.experiments = { 
            ...config.experiments, 
            topLevelAwait: true,
        }
        return config;
    },
    output: 'standalone',
    typescript: {
        // Pendant le développement, vous pouvez mettre ça à true
        ignoreBuildErrors: true,
    }
};

export default nextConfig;

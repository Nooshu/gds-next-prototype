/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    webpack: (config) => {
        // Suppress autoprefixer warnings for pre-compiled CSS files
        config.ignoreWarnings = [
            ...(config.ignoreWarnings || []),
            {
                module: /govuk-frontend\.min\.css/,
                message: /autoprefixer.*start value has mixed support/,
            },
            {
                message: /autoprefixer.*start value has mixed support/,
            },
            // Suppress webpack cache serialization warnings
            {
                message: /Skipped not serializable cache item/,
            },
        ];
        return config;
    },
};

export default nextConfig;

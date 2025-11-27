import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    // Set the project root to silence lockfile warning
    outputFileTracingRoot: __dirname,
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
            {
                message: /No serializer registered for Warning/,
            },
            {
                message: /while serializing webpack/,
            },
        ];
        return config;
    },
    // Empty turbopack config to silence warnings but use webpack
    turbopack: {},
};

export default nextConfig;

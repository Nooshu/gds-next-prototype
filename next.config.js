/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    optimizePackageImports: ["govuk-frontend", "@ministryofjustice/frontend"],
};

export default nextConfig;

// frontend/next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    async rewrites() {
        return [
            // point to your .NET API port
            { source: '/api/:path*', destination: 'http://localhost:8080/api/:path*' }
        ]
    }
}
export default nextConfig;

import type { NextConfig } from "next";
import os from "os";

const getLocalIps = () => {
  try {
    return Object.values(os.networkInterfaces()).flat().map(i => i?.address || "").filter(Boolean);
  } catch {
    return [];
  }
};

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    ...getLocalIps(),
    "localhost",
    "127.0.0.1"
  ],
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,POST,OPTIONS,PUT,DELETE,PATCH" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
        ]
      }
    ];
  }
};

export default nextConfig;

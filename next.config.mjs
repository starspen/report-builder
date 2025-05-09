import createNextIntlPlugin from "next-intl/plugin";
import nextra from "nextra";

/** @type {import('next').NextConfig} */

const withNextIntl = createNextIntlPlugin();

const withNextra = nextra({
  theme: "nextra-theme-docs",
  themeConfig: "./theme.config.tsx",
});
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.lorem.space",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "a0.muscache.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
      {
        protocol: "https",
        hostname: "i0.wp.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "5001",
      },
      {
        protocol: "http",
        hostname: "192.168.1.32",
        port: "5001",
      },
      {
        protocol: "http",
        hostname: "demo.property365.co.id",
        port: "5025",
      },
      {
        protocol: "https",
        hostname: "demo.property365.co.id",
        port: "5025",
      },
      {
        protocol: "http",
        hostname: "10.10.0.25",
        port: "5000",
      },
    ],
  },
};

export default withNextIntl(withNextra(nextConfig));

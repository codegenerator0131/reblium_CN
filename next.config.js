/** @type {import('next').NextConfig} */
const { EventEmitter } = require("events");

EventEmitter.defaultMaxListeners = 15;

const nextConfig = {
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;

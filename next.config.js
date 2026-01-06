/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    domains: [
      "fkmfdzlohdlzoiusyjpn.supabase.co",
      "owqtlndikixetuslznwc.supabase.co",
      "img.vietqr.io"
    ],
  },
};

module.exports = nextConfig;

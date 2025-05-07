/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: "https://ubflgmliopqffwqegvzz.supabase.co",
    NEXT_PUBLIC_SUPABASE_ANON_KEY:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InViZmxnbWxpb3BxZmZ3cWVndnp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0NDgxOTEsImV4cCI6MjA2MjAyNDE5MX0.qHJfl00IgFZhfdvN2yDz8Uaex-i1tSA7JW2Jzy8KClY",
  },
};

export default nextConfig;

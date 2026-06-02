import withPWAInit from "next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  register: true,
  skipWaiting: true,
});

const nextConfig = {
  reactCompiler: true,

  turbopack: {}, 

};

export default withPWA(nextConfig);
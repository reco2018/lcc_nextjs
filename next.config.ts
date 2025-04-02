import type webpack from 'webpack';
const nextConfig = {
  output: 'export',
  reactStrictMode: false,
  poweredByHeader: false,
  images: {
    unoptimized: true,
  },
  experimental: {
    //esmExternals: false,
  },
  basePath: process.env.NEXT_PUBLIC_BASE_PATH, // 開発時は basePath を無効化 '/next_test'の部分は</ + アップロード先フォルダ名>に書き換えてください。ドメイン部分は含めなくてOKです
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH, // 開発時は assetPrefix を無効化 '/next_test'の部分は</ + アップロード先フォルダ名>に書き換えてください。ドメイン部分は含めなくてOKです
  trailingSlash: true,
  webpack: (config: webpack.Configuration) => {
    config.cache = {
      type: 'filesystem',
      compression: 'gzip', // キャッシュを gzip 圧縮してサイズを抑える
      allowCollectingMemory: false, // メモリ使用を抑えて警告を減らす
    };
    return config;
  },
};

module.exports = nextConfig;
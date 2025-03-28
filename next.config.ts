import type webpack from 'webpack';
const isProd = process.env.NODE_ENV === 'production';
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
  basePath: isProd ? '/biz.active-d.net' : undefined, // 開発時は basePath を無効化 '/next_test'の部分は</ + アップロード先フォルダ名>に書き換えてください。ドメイン部分は含めなくてOKです
  assetPrefix: isProd ? '/biz.active-d.net' : undefined, // 開発時は assetPrefix を無効化 '/next_test'の部分は</ + アップロード先フォルダ名>に書き換えてください。ドメイン部分は含めなくてOKです
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
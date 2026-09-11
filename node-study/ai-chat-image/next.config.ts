import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // 使用进程内 TypeScript API 解析 tsconfig（默认 CLI 方式需 spawn 子进程）
    useTypeScriptCli: false,
    // PostCSS/Tailwind 等 webpack loader 在子进程中求值，子进程间通过 socket 通信需要绑定端口，
    // 受限容器不允许绑定端口；改用 worker thread 后端则无需端口。
    turbopackPluginRuntimeStrategy: "workerThreads",
  },
  typescript: {
    // 类型检查通过 `npx tsc --noEmit` 单独执行，构建时跳过以加快构建
    ignoreBuildErrors: true,
  },
};

export default nextConfig;

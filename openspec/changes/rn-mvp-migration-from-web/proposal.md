## Why

当前 `mind_mirror_app` 需要尽快交付 iOS/Android 首版，但核心业务仍以 Web 端为主，导致移动端能力不完整且体验不一致。基于现有 `mind_mirror` 与 `mind_mirror_api` 进行迁移，可以在不新增后端体系的前提下，快速完成 MVP 闭环并降低交付风险。

## What Changes

- 新增 React Native（Expo）端 MVP 业务能力：登录/注册/登出、测试列表、MBTI 流程、城市匹配流程、个人中心基础能力。
- 新增统一鉴权与会话续期机制：`accessToken + refreshToken`、`401` 自动刷新、并发刷新单飞锁、刷新失败后清理登录态。
- 新增移动端 API 客户端抽象，复用 `mind_mirror_api` 现有接口契约，与 Web 端保持一致的业务语义。
- 新增移动端基础工程结构与状态管理、表单校验、请求缓存、错误监控等基础设施，支撑后续迭代。
- 明确本期非目标：推送、离线缓存、复杂动画、A/B 实验、深度埋点平台接入。

## Capabilities

### New Capabilities
- `mobile-auth-session`: 在移动端提供登录/注册/登出、令牌存储、自动续期与失效回退机制。
- `mobile-assessment-flows`: 在移动端提供测试列表、MBTI 与城市匹配的介绍/答题/结果/历史完整流程。
- `mobile-profile-center`: 在移动端提供个人中心信息展示、昵称修改、密码修改与历史摘要查看。
- `mobile-shared-api-client`: 提供与 Web 同构的 API 调用层，统一错误处理、鉴权注入与请求封装。

### Modified Capabilities
- 无（当前仓库无既有 capability 规格，本次全部以新增 capability 方式定义）。

## Impact

- Affected code: `app/` 路由页面、`src/features/*` 业务模块、`src/api/*` 请求与鉴权层、`src/stores/*` 状态管理、`src/components/*` 基础组件。
- APIs: 复用并对齐 `mind_mirror_api` 已有认证与测评相关接口，不新增独立移动端后端接口。
- Dependencies: 引入/确认 `expo-router`、`zustand`、`axios`、`expo-secure-store`、`react-hook-form`、`zod`、`@tanstack/react-query` 相关依赖。
- Systems: 影响 iOS/Android 双端首版发布链路与后续功能扩展节奏。

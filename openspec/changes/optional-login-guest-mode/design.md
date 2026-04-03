## Context

应用使用 Expo Router、`useAuthStore`（`loading` / `unauthenticated` / `authenticated`）与 `(main)/_layout.tsx` 中的认证守卫：未认证时重定向到 `/(auth)/login`。`app/index.tsx` 在未认证时也指向登录页。目标是在不改变后端契约的前提下，让访客会话也能进入主 Tab 区并完成与身份无关的核心流程。

## Goals / Non-Goals

**Goals:**

- 未登录用户可进入 `(main)`，使用底部双 Tab 与测评列表等核心路径。
- 根路径在会话就绪后：已登录 → `(main)`；未登录 → `(main)`（与当前「未登录 → 登录」行为不同）。
- 「我的」在访客下提供清晰登录入口；需身份的 API 失败时有可理解反馈（沿用现有 HTTP 401 处理或显式拦截）。
- 已登录用户体验与登出后的导航行为可预测（不困在无法进入主区的状态）。

**Non-Goals:**

- 不要求后端新增「匿名用户」体系或强制设备 ID（除非后续单独变更）。
- 不一次性重做全站权限模型；仅保证规格与路由层支持「可选登录」。
- 不修改登录/注册表单业务规则，除非与访客入口冲突。

## Decisions

1. **主区准入**：移除 `(main)` 中对 `status !== "authenticated"` 的强制 `Redirect` 至登录页；仅在 `status === "loading"` 时显示全局加载。未登录与已登录均渲染 `Tabs`。
   - *备选*：保留重定向但增加「跳过」参数——增加路由复杂度，不利于深链接与默认体验，故不采纳。

2. **根路径 `index`**：`loading` 仍显示 `AppLoadingView`；`unauthenticated` 与 `authenticated` 均 `Redirect` 至 `/(main)`（或项目统一的主入口路径），不再默认进登录页。
   - *备选*：`unauthenticated` → 独立「欢迎页」——非本次目标，可后续迭代。

3. **访客与 API**：维持 `accessToken === null`；受保护接口返回 401 时沿用 `onAuthFailed` / `clearSession` 或按页面提示登录，不在本设计强制改全局策略（若当前会误清访客会话，在实现阶段用规格任务单点修正）。

4. **「我的」Tab**：访客展示账户占位文案、登录/注册入口；已登录保持现有 profile 能力。具体文案与组件以现有 `profile` 模块为基准扩展。

## Risks / Trade-offs

- **[Risk]** 部分接口假设已登录，访客触发错误流增多 → **Mitigation**：列表与测评入口优先走公开或可选身份接口；其余在 UI 层禁用或引导登录。
- **[Risk]** 安全敏感操作误暴露在访客下 → **Mitigation**：规格明确「我的」与需身份操作的边界；代码审查时核对导航目标。
- **Trade-off**：访客与已登录共用主栈，状态略复杂，但比双应用壳更简单。

## Migration Plan

1. 合并后发布：新老用户启动后经 `bootstrapSession` 进入；访客直达主区。
2. 回滚：恢复 `index` 与 `(main)/_layout` 的重定向逻辑即可，无需数据迁移。

## Open Questions

- 测评提交、历史记录等是否部分要求登录（产品规则）——若与后端不一致，需在实现前对齐接口文档。
- 是否需要在访客首次打开时展示简短说明（非必须，可由产品决定）。

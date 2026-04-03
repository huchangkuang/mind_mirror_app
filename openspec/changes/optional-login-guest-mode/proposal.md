## Why

当前应用在根路由与主区布局层强制要求登录：未认证用户会被重定向到登录页，无法进入底部 Tab 主区。产品期望降低使用门槛，让用户在未登录时也能完成核心浏览与测评等流程；登录作为可选能力，用于同步账户、个人中心等需要身份的功能。

## What Changes

- 调整应用入口与 `(main)` 路由守卫：**未登录用户可进入主区（底部双 Tab）**，不再强制跳转到登录页。
- 明确**访客（未登录）与已登录**在功能上的差异：核心可用功能在访客下可用；需身份的操作（如部分个人中心能力）在访客下提示登录或受限展示。
- 保留现有登录/注册/刷新会话/退出登录流程；访客可随时登录升级为已登录会话。
- 更新路由与状态逻辑，使 `AuthStatus` 为 `unauthenticated` 时仍呈现主界面而非仅登录页（**非破坏性**对外 API 语义需在实现中保持一致或显式文档化）。

## Capabilities

### New Capabilities

- `optional-login-routing`: 定义根入口、`(main)` 准入规则，以及访客与已登录用户在导航层面的行为（含不强制登录即可使用主区）。

### Modified Capabilities

- `main-tab-navigation`: 将「未登录用户不得进入 Tab 主区」改为允许访客进入 Tab 主区；补充访客下「我的」Tab 与个人中心相关展示/入口规则（与实现一致）。

## Impact

- **路由与布局**：`app/index.tsx`、`app/(main)/_layout.tsx`，以及可能受影响的 `(auth)` 与深层链接。
- **状态**：`useAuthStore` / `AuthStatus` 使用方式；访客下 API 调用（无 token）与 401 处理。
- **UI**：`我的` Tab 在访客下的文案、登录入口、受限功能提示。
- **规格**：`openspec/specs/main-tab-navigation/spec.md` 需增量变更；新增 `openspec/specs/optional-login-routing/spec.md`。

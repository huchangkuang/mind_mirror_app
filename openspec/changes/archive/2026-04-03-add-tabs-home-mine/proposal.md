## Why

登录后的主流程目前使用单层 Stack：测试列表与「个人中心」通过页面跳转切换，缺少固定的一级导航，用户返回首页或进入「我的」需要多次返回或依赖隐式入口。通过底部 Tab 将「测试首页」与「我的」并列，可缩短路径、符合常见 App 信息架构，并为后续扩展更多 Tab 留出结构。

## What Changes

- 在已认证主区域 `(main)` 引入底部 Tab 导航（两栏：测试首页、我的）。
- 「测试首页」Tab 承载现有测试列表首页（当前 `(main)/index` 的内容与行为）。
- 「我的」Tab 承载个人中心（现有 `profile` 页面功能与数据）。
- 各测评子流程（MBTI、城市匹配、宇宙精神原色等）保持在 Tab 之上的 Stack 或可共享同一 Stack 结构，进入子页时按现有全屏/标题栏行为展示；实现方式以 design 为准，目标是不破坏现有路由与深链预期。
- Tab 栏需有清晰标签与可选图标，选中态可辨。

## Capabilities

### New Capabilities

- `main-tab-navigation`: 定义主区底部 Tab 的结构（两个 Tab：测试首页、我的）、与 Stack 子路由的组合方式，以及用户可见的导航与标题行为。

### Modified Capabilities

- （`openspec/specs/` 当前无基线 spec；若后续在仓库中建立全局 spec，再对相应能力做 delta。）本变更仅新增 change 内 spec，不声明对已存在全局 capability 的修改。

## Impact

- **路由与布局**：`app/(main)/_layout.tsx` 由 Stack 调整为 Tabs（或 Tabs + 嵌套 Stack），可能涉及 `(main)` 下文件组织（如 `index` / `profile` 作为 Tab 子路由）。
- **链接与跳转**：代码中指向 `/(main)/profile`、`/(main)/` 的 `router.push` / `Link` 需与 Tab 路径一致并回归测试。
- **依赖**：使用 Expo Router 的 `Tabs`（`expo-router` 已随项目存在）；无需新增 npm 包除非选用额外 Tab UI 库。
- **视觉**：与现有 `theme/tokens`（颜色、标题栏）保持一致；Tab 栏样式需与 App 整体风格统一。

## Context

当前 `app/(main)/_layout.tsx` 使用单一 `Stack`，`index`（测试列表）、`profile`（个人中心）与各类测评子路由（`mbti/*`、`city-match/*`、`cosmic-essence/*`）平铺在同一栈内。用户从「个人中心」回到测试列表依赖返回栈或页面内入口，缺少固定的一级「首页 / 我的」切换。

技术栈：Expo SDK 55、`expo-router` 文件式路由、已有 `theme/tokens` 与 `ScreenBackground` 等 UI 模式。

## Goals / Non-Goals

**Goals:**

- 在已认证 `(main)` 区域提供**底部 Tab**，两个 Tab：**测试首页**（现有测试列表）、**我的**（现有个人中心）。
- 进入各测评答题/结果等子页时，**Tab 栏行为**符合常见预期：子页全屏堆叠在对应 Tab 的 Stack 上，返回后回到 Tab 内上一页；从「测试首页」进入的子流程归属「首页」Tab 栈。
- 保持与现有鉴权逻辑一致：`(main)` 仍仅在 `authenticated` 时展示，未登录仍跳转 `(auth)`。
- 路由路径在合理范围内保持兼容或一次性更新应用内所有 `href` / `router.push`，避免死链。

**Non-Goals:**

- 不新增第三个 Tab 或动态 Tab（除非后续单独需求）。
- 不改变测评业务 API、个人中心接口契约。
- 不强制重做视觉品牌；Tab 图标可用 `@expo/vector-icons` 或项目已有资源，以简洁为先。

## Decisions

1. **采用「Tabs + 每组一个 Stack」嵌套**  
   - **内容**：`(main)/_layout.tsx` 使用 `Tabs`；子目录使用路由分组 `(home)` 与 `(mine)`，各自 `_layout.tsx` 为 `Stack`。  
   - **理由**：测评流程需要多层 Stack；若仅用单层 Tabs 把 `mbti` 等放在与 `index` 同级，易出现 Tab 栏与子页叠放混乱。嵌套 Stack 是 Expo Router 常见模式。  
   - **备选**：单一 Tabs + 子路由用 `href` 隐藏 TabBar——可少移动文件，但对每个子页配置 `tabBarStyle`/`screenOptions` 易碎，维护成本高。

2. **文件归属**  
   - **内容**：现有 `index.tsx` 及 `mbti/`、`city-match/`、`cosmic-essence/` 移入 `(home)/`；`profile.tsx` 移入 `(mine)/`。  
   - **理由**：分组名 `(home)`、`(mine)` 不出现在 URL 中，在保持 `/(main)/mbti/...`、`/(main)/profile` 等形式的前提下（取决于最终文件树是否与 expo-router 默认一致），可减少对外部深链的破坏；若路径变化，则在任务阶段全局替换应用内引用。  
   - **备选**：保留扁平结构仅用 Tab 的 `listeners` 切换——与 expo-router 文件树耦合度低但官方示例较少，调试成本高。

3. **Tab 配置**  
   - **内容**：`Tabs.Screen` 为 `(home)`、`(mine)`；`tabBarActiveTintColor` / `tabBarInactiveTintColor` 对齐 `colors.primary` 与次要文本色；标题文案：**测试首页**、**我的**（或与现有「个人中心」文案统一为「我的」以匹配 Tab）。  
   - **理由**：与现有主题一致；短标签更适合底部栏。

4. **Header**  
   - **内容**：Stack 的 `headerShown`、标题与各 `Stack.Screen` `options` 从现有 `(main)/_layout.tsx` 迁移到 `(home)/_layout.tsx` 与 `(mine)/_layout.tsx`，按屏分配；根 Tab 页可保留或简化标题（与现有一致即可）。  
   - **理由**：行为与改版前对齐，减少用户感知差异。

5. **根入口**  
   - **内容**：默认选中「测试首页」Tab（`(home)` 为初始路由）。  
   - **理由**：与当前登录后进主列表的习惯一致。

## Risks / Trade-offs

- **[Risk] 应用内硬编码路径**（如 `/(main)/profile`、`/(main)/mbti`）在重组后失效 → **Mitigation**：实现时全局检索 `/(main)` 与 `router.push`/`Link`，按新文件树统一更新；必要时用 `expo-router` 的 typed routes 或集中常量定义路径。  
- **[Risk] 深层链接 / 分享 URL** 若已发布 → **Mitigation**：核对 `app.json` / linking 配置；若路径变化，在 `expo-linking` 或重定向中做兼容映射（本阶段若无非代码配置可记为开放项）。  
- **[Trade-off] 移动文件导致 diff 较大** → 可接受，为一次性结构整理，后续扩展 Tab 更清晰。

## Migration Plan

1. 新建 `(home)`、`(mine)` 目录与各自 `Stack` `_layout.tsx`。  
2. 移动页面文件并修正 import（仅路径变化引起的相对引用）。  
3. 将 `(main)/_layout.tsx` 改为 `Tabs`，注册两个分组屏。  
4. 全局更新导航路径与自动化/手动冒烟：登录 → 两 Tab 切换 → 进入 MBTI 再返回 → 进入「我的」再返回。  
5. 若构建失败，回滚为单分支 git revert 或恢复备份的 `(main)` 布局（建议在分支上开发）。

## Open Questions

- 产品是否要求 Tab 文案严格为「测试首页」与「我的」，或保留 Stack 标题「测试列表」「个人中心」与 Tab 标签不一致的情况（实现时可按现有文案微调 `tabBarLabel`）。  
- 若存在外部打开的 `mind_mirror_app` 深链，需产品确认是否必须保持旧 URL 不变（当前设计优先应用内路径一致性）。

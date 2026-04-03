## 1. 路由目录与布局骨架

- [x] 1.1 在 `app/(main)/` 下新增路由分组 `(home)`、`(mine)`，并各添加 `Stack` 型 `_layout.tsx`（从现有 `(main)/_layout.tsx` 拆分 header 与 `Stack.Screen` 注册项：测评相关归 `(home)`，`profile` 归 `(mine)`）。
- [x] 1.2 将 `index.tsx` 与 `mbti/`、`city-match/`、`cosmic-essence/` 移入 `(home)/`；将 `profile.tsx` 移入 `(mine)/`。
- [x] 1.3 将 `(main)/_layout.tsx` 改为 `Tabs` 布局，注册 `Tabs.Screen`（或等价配置）指向 `(home)` 与 `(mine)`，设置默认选中「测试首页」、Tab 标签（测试首页 / 我的）与主题色。
- [x] 1.4 用 `npx expo customize` 或本地构建确认无路由解析错误；若 `expo-router` 生成的路径变化，记录并执行第 2 节全局替换。

## 2. 导航路径与链接

- [x] 2.1 全局检索 `/(main)`、`router.push`、`router.replace`、`Link href`，按重组后的实际路径更新（优先保持 `/(main)/mbti/...`、`/(main)/profile` 等不变；若文件树导致路径变化则一次性改全）。
- [x] 2.2 核对 `app/index.tsx`、`app/(auth)/login.tsx`、`app/(auth)/register.tsx` 中 `/(main)` 重定向仍指向正确初始 Tab（测试首页）。

## 3. UI 与行为验收

- [x] 3.1 确认未登录访问 `(main)` 仍重定向登录，登录后可见双 Tab。
- [x] 3.2 在「测试首页」进入任一测评子流程，返回后 Tab 与栈行为符合 `specs/main-tab-navigation/spec.md`。
- [x] 3.3 在「我的」执行退出登录等操作，行为与改版前一致。
- [x] 3.4 运行 `npm test`（或项目既有测试命令）并做真机/模拟器快速冒烟。

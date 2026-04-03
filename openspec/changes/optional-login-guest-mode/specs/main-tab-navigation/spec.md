## MODIFIED Requirements

### Requirement: 主区展示底部双 Tab

进入 `(main)` 的已认证用户或访客，系统 MUST 在屏幕底部展示 Tab 栏，且仅包含两个 Tab：**测试首页**与**我的**。

#### Scenario: 用户已登录进入主区

- **WHEN** 用户会话状态为已认证并进入 `(main)`
- **THEN** 界面 MUST 显示底部 Tab 栏，且可见恰好两个 Tab，分别为「测试首页」与「我的」（或语义等价的展示文案）

#### Scenario: 访客进入主区

- **WHEN** 用户会话状态为未认证并进入 `(main)`
- **THEN** 界面 MUST 显示底部 Tab 栏，且可见恰好两个 Tab，分别为「测试首页」与「我的」（或语义等价的展示文案）

### Requirement: 我的 Tab 承载个人中心

「我的」Tab MUST 承载个人中心功能。已登录用户 MUST 能够使用与变更前 `profile` 一致的账户与资料相关能力（例如查看/修改昵称、修改密码、退出登录等，以当前实现为准）。访客 MUST 能够查看面向访客的账户说明并 MUST 能够发起登录或注册以使用需身份的功能。

#### Scenario: 用户打开个人中心（已登录）

- **WHEN** 已登录用户选中「我的」Tab
- **THEN** 系统 MUST 展示个人中心界面，且用户能够执行退出登录或资料相关操作（与实现可用的功能一致）

#### Scenario: 访客打开个人中心

- **WHEN** 访客选中「我的」Tab
- **THEN** 系统 MUST 展示个人中心界面，且 MUST 提供可发现的登录或注册入口，且 MUST NOT 将用户自动逐出主区仅因未登录

## REMOVED Requirements

### Requirement: 未登录用户不得进入 Tab 主区

**Reason**：产品要求允许访客使用主区核心能力，强制登录违背「可选登录」目标。

**Migration**：实现上删除对 `(main)` 的未登录重定向；规格上由「访客可进入 Tab 主区」与 `optional-login-routing` 中的路由要求替代。

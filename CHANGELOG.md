<!--
  维护约定见 docs/CHANGELOG_GENERATION.md
  应用内「更新日志」由本文件解析渲染，勿在 TS 中重复维护条目列表。
-->

# 更新日志

## [0.1.3] - 2026-04-19

### 功能

- 设置：将「更新日志」合并到「版本与更新」页，侧栏不再单独占用一项。
- 设置：刷新入口移至「设置」标题旁，权限说明文案同步调整。
- macOS 发行 GitHub Actions 工作流更新。

### 修复

- 无。

## [0.1.2] - 2026-04-19

### 功能

- 无。

### 修复

- 同步 Cargo.lock 与发布版本信息，便于 CI 与本地可复现构建。

## [0.1.1] - 2026-04-19

### 功能

- 设置页改为左侧导航 + 右侧内容的全屏 Sheet，结构与交互更清晰。
- 支持从根目录 CHANGELOG.md 解析并在设置中展示更新日志。
- Tauri 在 macOS 上的窗口与图标等配置优化。

### 修复

- 无。

## [0.1.0] - 2026-04-19

### 功能

- 中键或右键拖动手势，匹配规则后执行快捷键；在手势规则页管理规则与快捷键，支持示例规则与一键恢复。
- 识别日志、最近识别结果与多显示器示意；设置内支持登录启动、权限状态、版本与关于、打开 Releases。

### 修复

- 无。

[0.1.3]: https://github.com/Asplitline/mino-gesture/releases/tag/v0.1.3
[0.1.2]: https://github.com/Asplitline/mino-gesture/releases/tag/v0.1.2
[0.1.1]: https://github.com/Asplitline/mino-gesture/releases/tag/v0.1.1
[0.1.0]: https://github.com/Asplitline/mino-gesture/releases

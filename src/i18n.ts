export type Language = "zh-CN" | "en-US";

type Messages = Record<string, string>;

export const I18N_MESSAGES: Record<Language, Messages> = {
  "zh-CN": {
    "header.subtitle": "里程碑 1 基础控制台",
    "header.switchToEnglish": "切换 English",
    "permissions.title": "权限",
    "permissions.desc":
      "请在 macOS 设置 - 隐私与安全性中为应用开启辅助功能和输入监控权限。",
    "runtime.title": "运行状态",
    "runtime.enabled": "启用状态",
    "runtime.input": "输入模块",
    "runtime.recognizer": "手势识别器",
    "runtime.hotkey": "快捷键动作",
    "runtime.config": "配置文件",
    "runtime.loading": "加载中...",
    "actions.enable": "启用",
    "actions.disable": "禁用",
    "actions.refresh": "刷新",
    "rules.title": "规则",
    "rules.namePlaceholder": "规则名称",
    "rules.add": "新增",
    "rules.save": "保存",
    "rules.cancel": "取消",
    "rules.edit": "编辑",
    "rules.delete": "删除",
    "rules.empty": "暂无规则。",
    "rules.enabled": "已启用",
    "rules.disabled": "已禁用",
    "rules.enable": "启用",
    "rules.disable": "禁用",
    "errors.nameRequired": "规则名称不能为空。",
    "errors.gesturePattern": "手势只能包含 U、D、L、R。"
  },
  "en-US": {
    "header.subtitle": "Milestone 1 Foundation Console",
    "header.switchToEnglish": "Switch to 中文",
    "permissions.title": "Permissions",
    "permissions.desc":
      "Please enable Accessibility and Input Monitoring for this app in macOS Settings - Privacy & Security.",
    "runtime.title": "Runtime",
    "runtime.enabled": "Enabled",
    "runtime.input": "Input module",
    "runtime.recognizer": "Gesture recognizer",
    "runtime.hotkey": "Hotkey action",
    "runtime.config": "Config",
    "runtime.loading": "Loading...",
    "actions.enable": "Enable",
    "actions.disable": "Disable",
    "actions.refresh": "Refresh",
    "rules.title": "Rules",
    "rules.namePlaceholder": "Rule name",
    "rules.add": "Add",
    "rules.save": "Save",
    "rules.cancel": "Cancel",
    "rules.edit": "Edit",
    "rules.delete": "Delete",
    "rules.empty": "No rules yet.",
    "rules.enabled": "enabled",
    "rules.disabled": "disabled",
    "rules.enable": "Enable",
    "rules.disable": "Disable",
    "errors.nameRequired": "Rule name is required.",
    "errors.gesturePattern": "Gesture must only contain U, D, L, R."
  }
};

export function getInitialLanguage(): Language {
  const cached = localStorage.getItem("app-language");
  if (cached === "zh-CN" || cached === "en-US") {
    return cached;
  }
  return navigator.language.startsWith("zh") ? "zh-CN" : "en-US";
}

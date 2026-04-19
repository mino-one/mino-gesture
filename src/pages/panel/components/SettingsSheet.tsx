import { useCallback, useEffect, useMemo, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import {
  IconExternalLink,
  IconInfo,
  IconRefreshCcw,
  IconRocket,
  IconShieldCheck,
} from "../../../components/icons";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Sheet, SheetBody, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "../../../components/ui/sheet";
import { Switch } from "../../../components/ui/switch";
import type { SettingsOverview } from "../../../types/app";

type SettingsSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onResetRules: () => Promise<void>;
  resettingRules: boolean;
};

const CHANGELOG_ITEMS = [
  {
    version: "Unreleased",
    title: "设置中心",
    summary: "新增右侧设置入口，集中管理开机启动、权限检测、示例数据、版本更新、关于和更新日志。",
  },
  {
    version: "0.1.0",
    title: "规则面板重构",
    summary: "重做规则页布局与交互，统一卡片、抽屉和表单样式，提升信息密度和可读性。",
  },
  {
    version: "0.1.0",
    title: "日志与可视反馈",
    summary: "补齐识别日志、最近结果和屏幕映射等运行时反馈，便于排查手势识别与匹配情况。",
  },
];

function PermissionRow({
  label,
  description,
  granted,
  actionLabel,
  onAction,
}: {
  label: string;
  description: string;
  granted: boolean;
  actionLabel: string;
  onAction: () => Promise<void>;
}) {
  return (
    <div className="app-panel-subtle rounded-2xl p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-foreground">{label}</p>
            <Badge variant={granted ? "success" : "dangerSoft"}>{granted ? "已授予" : "未授予"}</Badge>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => void onAction()}>
          {actionLabel}
        </Button>
      </div>
    </div>
  );
}

export function SettingsSheet({ open, onOpenChange, onResetRules, resettingRules }: SettingsSheetProps) {
  const [settings, setSettings] = useState<SettingsOverview | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [launchBusy, setLaunchBusy] = useState(false);

  const refreshSettings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const next = await invoke<SettingsOverview>("get_settings_overview");
      setSettings(next);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    void refreshSettings();
  }, [open, refreshSettings]);

  const toggleLaunchAtLogin = useCallback(
    async (checked: boolean) => {
      setLaunchBusy(true);
      setError(null);
      try {
        const next = await invoke<SettingsOverview>("set_launch_at_login", { enabled: checked });
        setSettings(next);
      } catch (err) {
        setError(String(err));
      } finally {
        setLaunchBusy(false);
      }
    },
    [],
  );

  const launchBadge = useMemo(() => {
    if (!settings?.launchAtLogin.available) return { text: "不可用", variant: "dangerSoft" as const };
    if (settings.launchAtLogin.enabled) return { text: "已启用", variant: "success" as const };
    return { text: "未启用", variant: "muted" as const };
  }, [settings]);

  const openTarget = useCallback(async (target: string) => {
    await invoke("open_settings_target", { target });
  }, []);

  const openExternal = useCallback(async (url: string) => {
    await invoke("open_external", { url });
  }, []);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex min-h-0 h-auto max-h-[calc(100vh-1.5rem)] flex-col overflow-hidden rounded-l-[24px] bg-card p-0 sm:top-3 sm:bottom-3 sm:max-w-[480px]"
      >
        <SheetHeader className="border-b border-border/70">
          <div className="flex items-start justify-between gap-3 pr-8">
            <div>
              <SheetTitle>设置</SheetTitle>
              <SheetDescription>偏好、权限、更新和关于信息都放在这里。</SheetDescription>
            </div>
            <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0" onClick={() => void refreshSettings()} disabled={loading}>
              <IconRefreshCcw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </SheetHeader>
        <SheetBody>
          <div className="space-y-4">
            {error ? (
              <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </div>
            ) : null}

            <Card className="app-panel-surface rounded-[22px]">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <IconRocket className="h-4 w-4 text-primary" />
                  <CardTitle className="text-base">自动启动</CardTitle>
                </div>
                <CardDescription>登录 macOS 后自动启动 Mino Gesture。</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground">开机启动</p>
                      <Badge variant={launchBadge.variant}>{launchBadge.text}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {settings?.launchAtLogin.message ?? "首次启用时 macOS 可能会请求控制“System Events”的自动化权限。"}
                    </p>
                  </div>
                  <Switch
                    checked={Boolean(settings?.launchAtLogin.enabled)}
                    onCheckedChange={(checked) => void toggleLaunchAtLogin(checked)}
                    disabled={launchBusy || loading || !settings?.launchAtLogin.available}
                    aria-label="切换自动启动"
                  />
                </div>
                <Button variant="outline" size="sm" onClick={() => void openTarget("login-items")}>
                  打开登录项设置
                </Button>
              </CardContent>
            </Card>

            <Card className="app-panel-surface rounded-[22px]">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <IconShieldCheck className="h-4 w-4 text-primary" />
                  <CardTitle className="text-base">权限与检测</CardTitle>
                </div>
                <CardDescription>应用运行依赖的系统权限，以及当前检测结果。</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <PermissionRow
                  label="辅助功能"
                  description="用于监听全局鼠标事件和触发系统级操作。没有它，手势通常无法工作。"
                  granted={Boolean(settings?.permissions.accessibility)}
                  actionLabel="打开设置"
                  onAction={async () => {
                    await openTarget("accessibility");
                    await refreshSettings();
                  }}
                />
                <PermissionRow
                  label="输入监控"
                  description="用于提升全局输入监听稳定性。某些系统版本中建议同时开启。"
                  granted={Boolean(settings?.permissions.inputMonitoring)}
                  actionLabel="打开设置"
                  onAction={async () => {
                    await openTarget("input-monitoring");
                    await refreshSettings();
                  }}
                />
                <p className="text-xs leading-relaxed text-muted-foreground">
                  授权后若状态仍未更新，通常需要完全重启应用。点击右上角刷新可重新检测。
                </p>
              </CardContent>
            </Card>

            <Card className="app-panel-surface rounded-[22px]">
              <CardHeader className="pb-4">
                <CardTitle className="text-base">恢复示例数据</CardTitle>
                <CardDescription>将当前规则列表重置为应用内置的示例规则。</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-muted-foreground">这会覆盖当前规则配置，但不会影响权限或应用偏好。</p>
                <Button variant="outline" onClick={() => void onResetRules()} disabled={resettingRules}>
                  {resettingRules ? "恢复中…" : "恢复示例数据"}
                </Button>
              </CardContent>
            </Card>

            <Card className="app-panel-surface rounded-[22px]">
              <CardHeader className="pb-4">
                <CardTitle className="text-base">版本与更新</CardTitle>
                <CardDescription>当前版本信息，以及更新获取方式。</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="app-panel-subtle rounded-2xl p-4">
                    <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">App Version</p>
                    <p className="mt-2 text-base font-semibold text-foreground">{settings?.version ?? "-"}</p>
                  </div>
                  <div className="app-panel-subtle rounded-2xl p-4">
                    <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Tauri Runtime</p>
                    <p className="mt-2 text-base font-semibold text-foreground">{settings?.tauriVersion ?? "-"}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={settings?.updates.autoUpdateEnabled ? "success" : "muted"}>
                    {settings?.updates.autoUpdateEnabled ? "自动更新已启用" : "自动更新未启用"}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {settings?.updates.message ?? "当前通过 GitHub Releases / 手动安装方式获取更新。"}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={() => void openExternal(settings?.updates.releasesUrl ?? "")} disabled={!settings?.updates.releasesUrl}>
                    <IconExternalLink className="h-4 w-4" />
                    查看 Releases
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="app-panel-surface rounded-[22px]">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <IconInfo className="h-4 w-4 text-primary" />
                  <CardTitle className="text-base">关于应用</CardTitle>
                </div>
                <CardDescription>产品来源、作者与仓库信息。</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="app-panel-subtle rounded-2xl p-4">
                    <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">App</p>
                    <p className="mt-2 font-semibold text-foreground">{settings?.appName ?? "Mino Gesture"}</p>
                    <p className="mt-1 text-muted-foreground">{settings?.bundleIdentifier ?? "com.mino.gesture"}</p>
                  </div>
                  <div className="app-panel-subtle rounded-2xl p-4">
                    <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Author</p>
                    <p className="mt-2 font-semibold text-foreground">{settings?.about.author ?? "-"}</p>
                    <p className="mt-1 text-muted-foreground">{settings?.about.githubUrl ?? "-"}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={() => void openExternal(settings?.about.githubUrl ?? "")} disabled={!settings?.about.githubUrl}>
                    <IconExternalLink className="h-4 w-4" />
                    打开 GitHub
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="app-panel-surface rounded-[22px]">
              <CardHeader className="pb-4">
                <CardTitle className="text-base">更新日志</CardTitle>
                <CardDescription>最近这版主要调整。</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {CHANGELOG_ITEMS.map((item) => (
                  <div key={`${item.version}-${item.title}`} className="app-panel-subtle rounded-2xl p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-foreground">{item.title}</p>
                      <Badge variant="info">{item.version}</Badge>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.summary}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </SheetBody>
      </SheetContent>
    </Sheet>
  );
}

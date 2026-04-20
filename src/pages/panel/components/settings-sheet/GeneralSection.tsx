import { useMemo } from "react";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
import { Switch } from "../../../../components/ui/switch";
import type { SettingsSectionContentProps } from "./types";

export function GeneralSection({
  settings,
  loading,
  launchBusy,
  closeBehaviorBusy,
  toggleLaunchAtLogin,
  toggleMinimizeToTrayOnClose,
  openTarget,
}: SettingsSectionContentProps) {
  const launchBadge = useMemo(() => {
    if (!settings?.launchAtLogin.available) {
      return { text: "不可用", variant: "dangerSoft" as const };
    }
    if (settings.launchAtLogin.enabled) {
      return { text: "已启用", variant: "success" as const };
    }
    return { text: "未启用", variant: "muted" as const };
  }, [settings]);

  return (
    <div className="space-y-4">
      <div className="app-panel-surface rounded-[24px] p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-foreground">
                关闭时最小化到托盘
              </p>
              <Badge
                variant={
                  settings?.closeBehavior.minimizeToTrayOnClose
                    ? "success"
                    : "muted"
                }
              >
                {settings?.closeBehavior.minimizeToTrayOnClose
                  ? "后台运行"
                  : "直接退出"}
              </Badge>
            </div>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {settings?.closeBehavior.message ??
                "关闭主窗口时可选择继续在托盘后台运行，或直接退出应用。"}
            </p>
            {settings?.closeBehavior.minimizeToTrayOnClose &&
            settings.closeBehavior.showCloseToTrayHint ? (
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                首次关闭时会额外弹出一次提示，避免误以为应用已经退出。
              </p>
            ) : null}
          </div>
          <Switch
            checked={Boolean(settings?.closeBehavior.minimizeToTrayOnClose)}
            onCheckedChange={(checked) =>
              void toggleMinimizeToTrayOnClose(checked)
            }
            disabled={closeBehaviorBusy || loading}
            aria-label="切换关闭时最小化到托盘"
          />
        </div>
      </div>
      <div className="app-panel-surface rounded-[24px] p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-foreground">自动启动</p>
              <Badge variant={launchBadge.variant}>{launchBadge.text}</Badge>
            </div>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {settings?.launchAtLogin.message ??
                "登录 macOS 后自动启动 Mino Gesture。"}
            </p>
          </div>
          <Switch
            checked={Boolean(settings?.launchAtLogin.enabled)}
            onCheckedChange={(checked) => void toggleLaunchAtLogin(checked)}
            disabled={
              launchBusy || loading || !settings?.launchAtLogin.available
            }
            aria-label="切换自动启动"
          />
        </div>
        <div className="mt-4 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => void openTarget("login-items")}
          >
            打开登录项设置
          </Button>
        </div>
      </div>
    </div>
  );
}

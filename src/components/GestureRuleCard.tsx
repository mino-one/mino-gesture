import type { SVGProps } from "react";
import {
  BUTTON_OPTIONS,
  formatGestureTriggerLabelZh,
  parseGestureArrows,
} from "../gesture";
import { cn } from "../lib/utils";
import type { ActionConfig, RuleConfig } from "../types/app";
import { KeycapRow, keycapClass } from "./HotkeyKeycaps";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Switch } from "./ui/switch";

function IconPencil(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

function IconTrash(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <path d="M3 6h18" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </svg>
  );
}

export type GestureRuleCardProps = {
  rule: RuleConfig;
  action: ActionConfig | undefined;
  triggerLabel: string;
  /** 已拆好的键位标签，与录制器键帽顺序一致；空数组表示无快捷键 */
  hotkeyLabels: string[];
  busy: boolean;
  onToggleEnabled: (enabled: boolean) => void;
  onEdit: () => void;
  onDelete: () => void;
};

export function GestureRuleCard({
  rule,
  action,
  triggerLabel: _triggerLabel,
  hotkeyLabels,
  busy,
  onToggleEnabled,
  onEdit,
  onDelete,
}: GestureRuleCardProps) {
  const title = action?.name ?? rule.name;
  const arrows = parseGestureArrows(rule.gesture).join("");
  const stateHint = rule.enabled ? "" : " (disabled)";
  const buttonLabel =
    BUTTON_OPTIONS.find((item) => item.value === rule.button)?.label ??
    rule.button;
  const gestureDetail = formatGestureTriggerLabelZh(rule.gesture);
  const summaryLabel = `${buttonLabel} · ${gestureDetail}`;
  return (
    <Card
      className="group overflow-hidden rounded-[20px] border border-[hsl(var(--border)/0.82)] bg-[rgba(255,255,255,0.82)] shadow-[0_1px_0_rgba(255,255,255,0.75),0_10px_26px_rgba(36,48,83,0.04)] backdrop-blur-[10px] transition-colors hover:border-[hsl(var(--border))] hover:bg-[rgba(255,255,255,0.9)]"
      role="article"
      aria-label={`${title}, ${summaryLabel}${stateHint}`}
    >
      <CardContent className="px-4.5 pb-3 pt-3.5">
        <div className="flex items-start gap-3">
          <div className="flex min-w-0 flex-1 gap-2.5">
            <div
              className="flex size-10 shrink-0 items-center justify-center rounded-[12px] border border-[hsl(var(--border)/0.95)] bg-[linear-gradient(180deg,rgba(248,249,253,0.98),rgba(242,244,250,0.98))] text-[1.25rem] font-normal leading-none text-[hsl(var(--foreground)/0.88)] shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_1px_2px_rgba(15,23,42,0.04)]"
              aria-hidden
            >
              {arrows || "·"}
            </div>
            <div className="min-w-0 pt-0.5">
              <h3 className="line-clamp-2 text-[0.9rem] font-semibold leading-[1.2] tracking-[-0.015em] text-foreground">
                {title}
              </h3>
              <p className="mt-0.5 text-[0.74rem] font-medium text-[hsl(var(--foreground)/0.58)]">
                {summaryLabel}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-2.5 border-t border-[hsl(var(--border)/0.72)]">
          <div className="flex items-center gap-3 py-2.5 text-[0.82rem]">
            <span className="shrink-0 font-medium text-[hsl(var(--foreground)/0.9)]">手势</span>
            <span className="text-[hsl(var(--foreground)/0.22)]" aria-hidden>
              ·
            </span>
            <span className="min-w-0 truncate text-[hsl(var(--foreground)/0.62)]">
              {gestureDetail}
            </span>
          </div>
          <div className="border-t border-[hsl(var(--border)/0.72)]" />
          <div className="flex flex-wrap items-center gap-3 py-2.5 text-[0.82rem]">
            <span className="shrink-0 font-medium text-[hsl(var(--foreground)/0.9)]">热键</span>
            <span className="text-[hsl(var(--foreground)/0.22)]" aria-hidden>
              ·
            </span>
            {hotkeyLabels.length > 0 ? (
              <KeycapRow
                labels={hotkeyLabels}
                className="min-w-0"
                ariaLabel={`热键 ${hotkeyLabels.join(" + ")}`}
              />
            ) : (
              <span
                className={cn(
                  keycapClass,
                  "border-none bg-[hsl(var(--muted)/0.7)] px-2 py-0.5 text-[0.72rem] text-muted-foreground shadow-none",
                )}
              >
                未设置
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-[hsl(var(--border)/0.72)] pt-2.5">
          <div className="flex min-w-0 items-center gap-2">
            <Switch
              checked={rule.enabled}
              onCheckedChange={onToggleEnabled}
              disabled={busy}
              className="shadow-[inset_0_0_0_1px_rgba(255,255,255,0.14)]"
              aria-label="启用手势规则"
            />
            <span className="text-[0.78rem] font-medium text-[hsl(var(--foreground)/0.72)]">
              {rule.enabled ? "已启用" : "已停用"}
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-[10px] text-[hsl(var(--foreground)/0.42)] hover:bg-[hsl(var(--muted)/0.7)] hover:text-foreground"
              disabled={busy}
              aria-label="编辑"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
            >
              <IconPencil className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-[10px] text-[hsl(var(--foreground)/0.42)] hover:bg-destructive/10 hover:text-destructive"
              disabled={busy}
              aria-label="删除"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <IconTrash className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

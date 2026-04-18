import { useCallback, useEffect, useState } from "react";
import type { ActionHotkeySnapshot } from "../types/app";
import { formatHotkeySnapshot, keyboardEventToHotkeySnapshot } from "../lib/macKeyboard";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";

type KeybindingRecorderProps = {
  value: ActionHotkeySnapshot | null;
  onChange: (v: ActionHotkeySnapshot | null) => void;
  disabled?: boolean;
};

export function KeybindingRecorder({ value, onChange, disabled }: KeybindingRecorderProps) {
  const [recording, setRecording] = useState(false);

  useEffect(() => {
    if (!recording || disabled) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setRecording(false);
        return;
      }
      const snap = keyboardEventToHotkeySnapshot(e);
      if (snap) {
        e.preventDefault();
        e.stopPropagation();
        onChange(snap);
        setRecording(false);
      }
    };

    window.addEventListener("keydown", onKeyDown, { capture: true });
    return () => window.removeEventListener("keydown", onKeyDown, { capture: true });
  }, [recording, disabled, onChange]);

  const startRecording = useCallback(() => {
    if (disabled) return;
    setRecording(true);
  }, [disabled]);

  return (
    <div className="space-y-2">
      <div
        className={cn(
          "rounded-md border px-3 py-2.5 text-sm transition-colors",
          recording ? "border-primary bg-primary/5 ring-1 ring-ring" : "border-border/80 bg-muted/20 dark:bg-muted/15",
          disabled && "opacity-50",
        )}
      >
        {value ? (
          <span className="font-mono text-[13px] tracking-tight text-foreground">{formatHotkeySnapshot(value)}</span>
        ) : (
          <span className="text-muted-foreground">{recording ? "请按下组合键…" : "未设置快捷键"}</span>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        <Button type="button" size="sm" variant="secondary" disabled={disabled} onClick={startRecording}>
          {recording ? "等待按键…" : "录制快捷键"}
        </Button>
        {value && (
          <Button type="button" size="sm" variant="ghost" disabled={disabled} onClick={() => onChange(null)}>
            清除
          </Button>
        )}
      </div>
      <p className="text-[11px] leading-snug text-muted-foreground">
        类似 VS Code：点「录制」后按下目标组合键；仅支持已映射的键位；Esc 取消本次录制。
      </p>
    </div>
  );
}

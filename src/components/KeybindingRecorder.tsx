import { useCallback, useEffect, useState } from "react";
import type { ActionHotkeySnapshot } from "../types/app";
import {
  buildHotkeySnapshot,
  formatHotkeySnapshot,
  keyboardEventToHotkeySnapshot,
  keyboardEventToMainKeyCode,
} from "../lib/macKeyboard";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";

type KeybindingRecorderProps = {
  value: ActionHotkeySnapshot | null;
  onChange: (v: ActionHotkeySnapshot | null) => void;
  disabled?: boolean;
};

type RecorderTab = "combo" | "system";

type ModState = Pick<ActionHotkeySnapshot, "control" | "option" | "shift" | "command">;

const emptyMods: ModState = {
  command: false,
  option: false,
  shift: false,
  control: false,
};

export function KeybindingRecorder({ value, onChange, disabled }: KeybindingRecorderProps) {
  const [tab, setTab] = useState<RecorderTab>("combo");

  const [recordingCombo, setRecordingCombo] = useState(false);
  const [recordingMain, setRecordingMain] = useState(false);
  const [mods, setMods] = useState<ModState>({ ...emptyMods });
  const [mainKeyCode, setMainKeyCode] = useState<number | null>(null);

  useEffect(() => {
    if (value) {
      setMods({
        command: value.command,
        option: value.option,
        shift: value.shift,
        control: value.control,
      });
      setMainKeyCode(value.keyCode);
    } else {
      setMods({ ...emptyMods });
      setMainKeyCode(null);
    }
  }, [value]);

  useEffect(() => {
    if (!recordingCombo || disabled || tab !== "combo") return;

    const listenerOpts: AddEventListenerOptions = { capture: true, passive: false };

    const onKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();

      if (e.repeat) return;

      if (e.key === "Escape") {
        setRecordingCombo(false);
        return;
      }

      const snap = keyboardEventToHotkeySnapshot(e);
      if (snap) {
        onChange(snap);
        setRecordingCombo(false);
      }
    };

    window.addEventListener("keydown", onKeyDown, listenerOpts);
    return () => window.removeEventListener("keydown", onKeyDown, listenerOpts);
  }, [recordingCombo, disabled, onChange, tab]);

  useEffect(() => {
    if (!recordingMain || disabled || tab !== "system") return;

    const listenerOpts: AddEventListenerOptions = { capture: true, passive: false };

    const onKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();

      if (e.repeat) return;

      if (e.key === "Escape") {
        setRecordingMain(false);
        return;
      }

      const keyCode = keyboardEventToMainKeyCode(e);
      if (keyCode === null) return;

      const snap = buildHotkeySnapshot(keyCode, mods);
      onChange(snap);
      setMainKeyCode(keyCode);
      setRecordingMain(false);
    };

    window.addEventListener("keydown", onKeyDown, listenerOpts);
    return () => window.removeEventListener("keydown", onKeyDown, listenerOpts);
  }, [recordingMain, disabled, onChange, mods, tab]);

  const setMod = useCallback(
    (key: keyof ModState, checked: boolean) => {
      setMods((prev) => {
        const next = { ...prev, [key]: checked };
        if (mainKeyCode !== null) {
          onChange(buildHotkeySnapshot(mainKeyCode, next));
        }
        return next;
      });
    },
    [mainKeyCode, onChange],
  );

  const startRecordCombo = useCallback(() => {
    if (disabled) return;
    setRecordingCombo(true);
  }, [disabled]);

  const startRecordMain = useCallback(() => {
    if (disabled) return;
    setRecordingMain(true);
  }, [disabled]);

  const clearAll = useCallback(() => {
    onChange(null);
    setRecordingCombo(false);
    setRecordingMain(false);
  }, [onChange]);

  const selectTab = useCallback((next: RecorderTab) => {
    setTab(next);
    setRecordingCombo(false);
    setRecordingMain(false);
  }, []);

  const preview =
    mainKeyCode !== null ? buildHotkeySnapshot(mainKeyCode, mods) : null;

  const sharedPreview = value ? (
    <span className="font-mono text-[13px] tracking-tight text-foreground">
      {formatHotkeySnapshot(value)}
    </span>
  ) : (
    <span className="text-muted-foreground">未设置快捷键</span>
  );

  return (
    <div className="space-y-3">
      <div
        role="tablist"
        aria-label="快捷键录入方式"
        className="flex rounded-lg border border-border/80 bg-muted/25 p-0.5 dark:border-border/60 dark:bg-muted/20"
      >
        <button
          type="button"
          role="tab"
          aria-selected={tab === "combo"}
          className={cn(
            "flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
            tab === "combo"
              ? "bg-background text-foreground shadow-sm dark:bg-background/95"
              : "text-muted-foreground hover:text-foreground",
          )}
          onClick={() => selectTab("combo")}
        >
          组合键
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "system"}
          className={cn(
            "flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
            tab === "system"
              ? "bg-background text-foreground shadow-sm dark:bg-background/95"
              : "text-muted-foreground hover:text-foreground",
          )}
          onClick={() => selectTab("system")}
        >
          系统录入
        </button>
      </div>

      {tab === "combo" && (
        <div role="tabpanel" className="space-y-2">
          <div
            className={cn(
              "rounded-md border px-3 py-2.5 text-sm transition-colors",
              recordingCombo
                ? "border-primary bg-primary/5 ring-1 ring-ring"
                : "border-border/80 bg-muted/20 dark:bg-muted/15",
              disabled && "opacity-50",
            )}
          >
            {recordingCombo ? (
              <span className="text-muted-foreground">请按下完整组合键…</span>
            ) : (
              sharedPreview
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" size="sm" variant="secondary" disabled={disabled} onClick={startRecordCombo}>
              {recordingCombo ? "等待按键…" : "录制组合键"}
            </Button>
            {value && (
              <Button type="button" size="sm" variant="ghost" disabled={disabled} onClick={clearAll}>
                清除
              </Button>
            )}
          </div>
          <p className="text-[11px] leading-snug text-muted-foreground">
            类似 VS Code：点「录制」后一次按下完整组合键（含修饰键）；仅支持已映射键位；Esc 取消本次录制。
          </p>
        </div>
      )}

      {tab === "system" && (
        <div role="tabpanel" className="space-y-3">
          <div>
            <p className="mb-2 text-[11px] font-medium text-muted-foreground">修饰键</p>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
                <Switch
                  checked={mods.command}
                  disabled={disabled}
                  aria-label="Command (⌘)"
                  onCheckedChange={(c) => setMod("command", c)}
                />
                <span className="tabular-nums">⌘ Command</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
                <Switch
                  checked={mods.option}
                  disabled={disabled}
                  aria-label="Option (⌥)"
                  onCheckedChange={(c) => setMod("option", c)}
                />
                <span className="tabular-nums">⌥ Option</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
                <Switch
                  checked={mods.control}
                  disabled={disabled}
                  aria-label="Control (⌃)"
                  onCheckedChange={(c) => setMod("control", c)}
                />
                <span className="tabular-nums">⌃ Control</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
                <Switch
                  checked={mods.shift}
                  disabled={disabled}
                  aria-label="Shift (⇧)"
                  onCheckedChange={(c) => setMod("shift", c)}
                />
                <span className="tabular-nums">⇧ Shift</span>
              </label>
            </div>
          </div>

          <div>
            <p className="mb-2 text-[11px] font-medium text-muted-foreground">主键</p>
            <div
              className={cn(
                "rounded-md border px-3 py-2.5 text-sm transition-colors",
                recordingMain
                  ? "border-primary bg-primary/5 ring-1 ring-ring"
                  : "border-border/80 bg-muted/20 dark:bg-muted/15",
                disabled && "opacity-50",
              )}
            >
              {preview ? (
                <span className="font-mono text-[13px] tracking-tight text-foreground">
                  {formatHotkeySnapshot(preview)}
                </span>
              ) : (
                <span className="text-muted-foreground">
                  {recordingMain ? "请按下一个主键…" : "未设置主键"}
                </span>
              )}
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              <Button type="button" size="sm" variant="secondary" disabled={disabled} onClick={startRecordMain}>
                {recordingMain ? "等待按键…" : "录制主键"}
              </Button>
              {preview && (
                <Button type="button" size="sm" variant="ghost" disabled={disabled} onClick={clearAll}>
                  清除
                </Button>
              )}
            </div>
          </div>

          <p className="text-[11px] leading-snug text-muted-foreground">
            当组合键一键录制被系统或浏览器拦截时使用：先勾选修饰键，再录主键；主键只认物理键位，修饰以开关为准；Esc 取消本次主键录制。
          </p>
        </div>
      )}
    </div>
  );
}

export type TrailPoint = { x: number; y: number };
export type MouseButtonValue = "middle" | "right";

export type ScreenInfo = {
  name: string | null;
  x: number;
  y: number;
  w: number;
  h: number;
  scaleFactor: number;
};

export type TrailStartPayload = {
  screens: ScreenInfo[];
  activeScreenIndex: number;
};

export type GestureResult = {
  matched: boolean;
  scope: string;
  gesture: string;
  ruleName?: string;
  actionType?: string;
  success: boolean;
  message: string;
  trigger?: string;
  trail?: TrailPoint[];
};

export type ActionConfig = {
  id: string;
  name: string;
  kind: string;
  keyCode: number;
  control: boolean;
  option: boolean;
  shift: boolean;
  command: boolean;
};

/** 与后端 `ActionHotkeySnapshot` 一致，用于规则内联快捷键 */
export type ActionHotkeySnapshot = {
  keyCode: number;
  control: boolean;
  option: boolean;
  shift: boolean;
  command: boolean;
};

/** 使用内联快捷键时 `actionType` 占位，实际执行走 `actionHotkey` */
export const INLINE_HOTKEY_ACTION_TYPE = "inline_hotkey";

export type RuleConfig = {
  id: string;
  name: string;
  enabled: boolean;
  scope: string;
  button: MouseButtonValue;
  gesture: string;
  actionType: string;
  actionHotkey?: ActionHotkeySnapshot | null;
};

export type ViewRoute = "home" | "panel";

export type TimedGestureResult = GestureResult & { at: number };

export type ActionMode = "preset" | "hotkey";

export type CreateRuleDraft = {
  name: string;
  button: MouseButtonValue;
  gesture: string;
  actionType: string;
  actionHotkey: ActionHotkeySnapshot | null;
  actionMode: ActionMode;
};

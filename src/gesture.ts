import type { ActionConfig, MouseButtonValue } from "./types/app";

export const DIRECTION_ARROW: Record<string, string> = {
  U: "↑",
  D: "↓",
  L: "←",
  R: "→",
  UL: "↖",
  UR: "↗",
  DL: "↙",
  DR: "↘",
};

export const GESTURE_OPTIONS = ["U", "D", "L", "R", "UL", "UR", "DL", "DR"];

/** 单段手势的人类可读名称，用于规则卡「触发方式」层级 */
const GESTURE_DIRECTION_LABEL: Record<string, string> = {
  U: "Swipe Up",
  D: "Swipe Down",
  L: "Swipe Left",
  R: "Swipe Right",
  UL: "Swipe Up-Left",
  UR: "Swipe Up-Right",
  DL: "Swipe Down-Left",
  DR: "Swipe Down-Right",
};

/** 表单下拉用中文短标签，与 Button 等控件语言一致 */
const GESTURE_DIRECTION_LABEL_ZH: Record<string, string> = {
  U: "上滑",
  D: "下滑",
  L: "左滑",
  R: "右滑",
  UL: "左上",
  UR: "右上",
  DL: "左下",
  DR: "右下",
};

/** 单段编码（U / UL …）对应的英文说明 */
export function gestureSegmentLabel(segment: string): string {
  const g = segment.toUpperCase();
  return GESTURE_DIRECTION_LABEL[g] ?? segment;
}

/** 下拉项：方向箭头 + 中文说明 + 存储用编码，避免仅显示 U/D/L */
export function formatGestureSelectOption(segment: string): string {
  const g = segment.toUpperCase();
  const arrow = DIRECTION_ARROW[g] ?? "";
  const label = GESTURE_DIRECTION_LABEL_ZH[g] ?? GESTURE_DIRECTION_LABEL[g] ?? segment;
  return `${arrow} ${label} · ${g}`;
}

function buildGestureReadableParts(
  gesture: string,
  labelMap: Record<string, string>,
): string[] {
  const g = gesture.toUpperCase();
  const parts: string[] = [];
  let i = 0;
  while (i < g.length) {
    const two = g.slice(i, i + 2);
    if (labelMap[two]) {
      parts.push(labelMap[two]);
      i += 2;
    } else if (labelMap[g[i]]) {
      parts.push(labelMap[g[i]]);
      i += 1;
    } else {
      parts.push(g[i]);
      i += 1;
    }
  }
  return parts;
}

/**
 * 将手势编码转为可读触发说明，多段用「 → 」连接。
 */
export function formatGestureTriggerLabel(gesture: string): string {
  const parts = buildGestureReadableParts(gesture, GESTURE_DIRECTION_LABEL);
  if (parts.length === 0) return gesture;
  if (parts.length === 1) return parts[0];
  return parts.join(" → ");
}

/** 中文触发说明，用于表单辅助文案 */
export function formatGestureTriggerLabelZh(gesture: string): string {
  const parts = buildGestureReadableParts(gesture, GESTURE_DIRECTION_LABEL_ZH);
  if (parts.length === 0) return gesture;
  if (parts.length === 1) return parts[0];
  return parts.join(" → ");
}

export const BUTTON_OPTIONS: Array<{ value: MouseButtonValue; label: string }> = [
  { value: "middle", label: "中键" },
  { value: "right", label: "右键" },
];

const MAC_KEYCODE_LABEL: Record<number, string> = {
  30: "]",
  33: "[",
  36: "Return",
  48: "Tab",
  49: "Space",
  51: "Delete",
  53: "Esc",
  123: "←",
  124: "→",
  125: "↓",
  126: "↑",
};

export function parseGestureArrows(gesture: string): string[] {
  const arrows: string[] = [];
  let i = 0;
  while (i < gesture.length) {
    const two = gesture.slice(i, i + 2);
    if (DIRECTION_ARROW[two]) {
      arrows.push(DIRECTION_ARROW[two]);
      i += 2;
    } else {
      arrows.push(DIRECTION_ARROW[gesture[i]] ?? gesture[i]);
      i += 1;
    }
  }
  return arrows;
}

export function formatHotkey(action: ActionConfig): string {
  const mods: string[] = [];
  if (action.control) mods.push("Ctrl");
  if (action.option) mods.push("Alt");
  if (action.shift) mods.push("Shift");
  if (action.command) mods.push("Cmd");

  const keyLabel =
    MAC_KEYCODE_LABEL[action.keyCode] ??
    (action.keyCode >= 65 && action.keyCode <= 90
      ? String.fromCharCode(action.keyCode)
      : action.keyCode >= 48 && action.keyCode <= 57
        ? String.fromCharCode(action.keyCode)
        : `K${action.keyCode}`);

  mods.push(keyLabel);
  return mods.join(" + ");
}

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

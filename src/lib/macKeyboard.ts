import type { ActionHotkeySnapshot } from "../types/app";

/**
 * `KeyboardEvent.code` → macOS 虚拟键码（与 Rust / AppleScript `key code` 一致，用于 Tauri 后端）。
 * 见 Technical Note / Carbon kVK_*。
 */
const CODE_TO_MAC_KEYCODE: Record<string, number> = {
  KeyA: 0,
  KeyS: 1,
  KeyD: 2,
  KeyF: 3,
  KeyH: 4,
  KeyG: 5,
  KeyZ: 6,
  KeyX: 7,
  KeyC: 8,
  KeyV: 9,
  KeyB: 11,
  KeyQ: 12,
  KeyW: 13,
  KeyE: 14,
  KeyR: 15,
  KeyY: 16,
  KeyT: 17,
  Digit1: 18,
  Digit2: 19,
  Digit3: 20,
  Digit4: 21,
  Digit6: 22,
  Digit5: 23,
  Equal: 24,
  Digit9: 25,
  Digit7: 26,
  Minus: 27,
  Digit8: 28,
  Digit0: 29,
  BracketRight: 30,
  KeyO: 31,
  KeyU: 32,
  BracketLeft: 33,
  KeyI: 34,
  KeyP: 35,
  Enter: 36,
  KeyL: 37,
  KeyJ: 38,
  Quote: 39,
  KeyK: 40,
  Semicolon: 41,
  Backslash: 42,
  Comma: 43,
  Slash: 44,
  KeyN: 45,
  KeyM: 46,
  Period: 47,
  Tab: 48,
  Space: 49,
  Backquote: 50,
  Backspace: 51,
  Escape: 53,
  CapsLock: 57,
  ArrowLeft: 123,
  ArrowRight: 124,
  ArrowDown: 125,
  ArrowUp: 126,
  F1: 122,
  F2: 120,
  F3: 99,
  F4: 118,
  F5: 96,
  F6: 97,
  F7: 98,
  F8: 100,
  F9: 101,
  F10: 109,
  F11: 103,
  F12: 111,
  Delete: 117,
};

const MODIFIER_CODES = new Set([
  "MetaLeft",
  "MetaRight",
  "ControlLeft",
  "ControlRight",
  "AltLeft",
  "AltRight",
  "ShiftLeft",
  "ShiftRight",
]);

export function keyboardEventToHotkeySnapshot(ev: KeyboardEvent): ActionHotkeySnapshot | null {
  if (MODIFIER_CODES.has(ev.code)) {
    return null;
  }
  const keyCode = CODE_TO_MAC_KEYCODE[ev.code];
  if (keyCode === undefined) {
    return null;
  }
  return {
    keyCode,
    control: ev.ctrlKey,
    option: ev.altKey,
    shift: ev.shiftKey,
    command: ev.metaKey,
  };
}

/** 仅解析主键键码（忽略事件上的修饰键），用于「先选修饰键、再录主键」分步录入 */
export function keyboardEventToMainKeyCode(ev: KeyboardEvent): number | null {
  if (MODIFIER_CODES.has(ev.code)) {
    return null;
  }
  const keyCode = CODE_TO_MAC_KEYCODE[ev.code];
  if (keyCode === undefined) {
    return null;
  }
  return keyCode;
}

export function buildHotkeySnapshot(
  keyCode: number,
  mods: Pick<ActionHotkeySnapshot, "control" | "option" | "shift" | "command">,
): ActionHotkeySnapshot {
  return { keyCode, ...mods };
}

/** 常见键码 → 单字符/短名，便于 ⌘K 风格展示 */
const KEYCODE_DISPLAY: Record<number, string> = {
  0: "A",
  1: "S",
  2: "D",
  3: "F",
  4: "H",
  5: "G",
  6: "Z",
  7: "X",
  8: "C",
  9: "V",
  11: "B",
  12: "Q",
  13: "W",
  14: "E",
  15: "R",
  16: "Y",
  17: "T",
  18: "1",
  19: "2",
  20: "3",
  21: "4",
  22: "6",
  23: "5",
  24: "=",
  25: "9",
  26: "7",
  27: "-",
  28: "8",
  29: "0",
  30: "]",
  31: "O",
  32: "U",
  33: "[",
  34: "I",
  35: "P",
  36: "↩",
  37: "L",
  38: "J",
  39: "'",
  40: "K",
  41: ";",
  42: "\\",
  43: ",",
  44: "/",
  45: "N",
  46: "M",
  47: ".",
  48: "⇥",
  49: "Space",
  50: "`",
  51: "⌫",
  53: "⎋",
  123: "←",
  124: "→",
  125: "↓",
  126: "↑",
};

function keyCodeToDisplay(keyCode: number): string {
  return KEYCODE_DISPLAY[keyCode] ?? `键${keyCode}`;
}

/** VS Code 风格：⌘⌥K 等，用于卡片与表单 */
export function formatHotkeySnapshot(s: ActionHotkeySnapshot): string {
  const parts: string[] = [];
  if (s.command) parts.push("⌘");
  if (s.shift) parts.push("⇧");
  if (s.option) parts.push("⌥");
  if (s.control) parts.push("⌃");
  parts.push(keyCodeToDisplay(s.keyCode));
  return parts.join(" ");
}

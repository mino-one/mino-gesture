const DIR_SET = new Set(["U", "D", "L", "R"]);

/** 将配置里的手势串解析为方向数组，至少一段，非法时回退为 ["U"] */
export function parseGestureToDirs(gesture: string): ("U" | "D" | "L" | "R")[] {
  const chars = gesture.trim().toUpperCase().split("").filter((c) => DIR_SET.has(c));
  if (chars.length === 0) {
    return ["U"];
  }
  return chars as ("U" | "D" | "L" | "R")[];
}

export function dirsToGesture(dirs: ("U" | "D" | "L" | "R")[]): string {
  return dirs.join("");
}

export const MAX_GESTURE_SEGMENTS = 6;

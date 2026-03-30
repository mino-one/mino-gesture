import {
  dirsToGesture,
  MAX_GESTURE_SEGMENTS,
  parseGestureToDirs
} from "../utils/gesture";
import type { Language } from "../i18n";
import { I18N_MESSAGES } from "../i18n";

type Dir = "U" | "D" | "L" | "R";

const DIRS: Dir[] = ["U", "D", "L", "R"];

type Props = {
  value: string;
  onChange: (gesture: string) => void;
  disabled?: boolean;
  lang: Language;
};

export function GestureBuilder({ value, onChange, disabled, lang }: Props) {
  const t = (key: string) => I18N_MESSAGES[lang][key] ?? key;
  const dirs = parseGestureToDirs(value || "U");

  const setDirs = (next: Dir[]) => {
    onChange(dirsToGesture(next.length ? next : ["U"]));
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {dirs.map((d, i) => (
        <select
          key={`${i}-${d}`}
          className="w-[5.5rem] rounded-lg border border-slate-300 bg-white px-2 py-2 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
          value={d}
          disabled={disabled}
          onChange={(e) => {
            const next = [...dirs] as Dir[];
            next[i] = e.target.value as Dir;
            setDirs(next);
          }}
          aria-label={`${t("gesture.segment")} ${i + 1}`}
        >
          {DIRS.map((opt) => (
            <option key={opt} value={opt}>
              {t(`gesture.dir.${opt}`)}
            </option>
          ))}
        </select>
      ))}
      <button
        type="button"
        className="rounded-lg border border-slate-300 bg-white px-2 py-2 text-xs text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
        disabled={disabled || dirs.length >= MAX_GESTURE_SEGMENTS}
        onClick={() => setDirs([...dirs, "U"])}
      >
        {t("gesture.addSegment")}
      </button>
      <button
        type="button"
        className="rounded-lg border border-slate-300 bg-white px-2 py-2 text-xs text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
        disabled={disabled || dirs.length <= 1}
        onClick={() => setDirs(dirs.slice(0, -1) as Dir[])}
      >
        {t("gesture.removeSegment")}
      </button>
      <span className="text-xs text-slate-600 dark:text-slate-400">
        {t("gesture.preview")}: {dirsToGesture(dirs)}
      </span>
    </div>
  );
}

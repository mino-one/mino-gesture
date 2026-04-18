import { parseGestureArrows } from "../gesture";
import type { GestureResult } from "../types/app";

export function HistorySection({
  history,
  onClear,
}: {
  history: GestureResult[];
  onClear: () => void;
}) {
  if (history.length === 0) return null;

  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300">历史记录</h2>
        <button onClick={onClear} className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          清空
        </button>
      </div>
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden divide-y divide-gray-100 dark:divide-gray-800">
        {history.map((r, i) => {
          const arrows = parseGestureArrows(r.gesture);
          return (
            <div key={i} className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800/50">
              <div className="flex gap-0.5">
                {arrows.map((a, j) => (
                  <span key={j} className="text-base text-indigo-500 dark:text-indigo-400">
                    {a}
                  </span>
                ))}
              </div>
              <span className="font-mono text-xs text-gray-400">{r.gesture}</span>
              <span
                className={`ml-auto text-xs px-1.5 py-0.5 rounded-full ${
                  r.matched
                    ? "bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-400"
                }`}
              >
                {r.matched ? "匹配" : "未匹配"}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

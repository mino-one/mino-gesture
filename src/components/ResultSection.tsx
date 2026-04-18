import { parseGestureArrows } from "../gesture";
import type { GestureResult } from "../types/app";

export function ResultSection({ lastResult }: { lastResult: GestureResult | null }) {
  const gestureArrows = lastResult?.gesture ? parseGestureArrows(lastResult.gesture) : [];

  return (
    <section className="space-y-2">
      <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300">识别结果</h2>
      {lastResult ? (
        <div
          className={`rounded-xl border p-4 space-y-3 ${
            lastResult.matched
              ? "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20"
              : "border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900"
          }`}
        >
          {gestureArrows.length > 0 && (
            <div className="flex items-center gap-1 flex-wrap">
              {gestureArrows.map((arrow, i) => (
                <span key={i} className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 select-none">
                  {arrow}
                </span>
              ))}
              <span className="ml-2 font-mono text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                {lastResult.gesture}
              </span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                lastResult.matched
                  ? "bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
              }`}
            >
              {lastResult.matched ? "✓ 已匹配" : "× 未匹配"}
            </span>
            {lastResult.ruleName && <span className="text-xs text-gray-600 dark:text-gray-400">{lastResult.ruleName}</span>}
            <span className="ml-auto text-xs text-gray-400 dark:text-gray-600">{lastResult.scope}</span>
          </div>
          {lastResult.message && <p className="text-xs text-gray-500 dark:text-gray-400">{lastResult.message}</p>}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-gray-200 dark:border-gray-800 p-8 text-center">
          <p className="text-sm text-gray-400 dark:text-gray-600">在任意位置按住中/右键并移动鼠标</p>
        </div>
      )}
    </section>
  );
}

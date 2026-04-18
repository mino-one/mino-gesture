import { BUTTON_OPTIONS, DIRECTION_ARROW, GESTURE_OPTIONS, formatHotkey } from "../gesture";
import type { ActionConfig, MouseButtonValue, RuleConfig } from "../types/app";

export function RuleSection({
  rules,
  actions,
  actionById,
  rulesLoading,
  rulesError,
  creatingRule,
  resettingRules,
  savingRuleId,
  onCreateRule,
  onResetRules,
  onRulePatch,
  onSaveRule,
  onDeleteRule,
}: {
  rules: RuleConfig[];
  actions: ActionConfig[];
  actionById: Record<string, ActionConfig>;
  rulesLoading: boolean;
  rulesError: string | null;
  creatingRule: boolean;
  resettingRules: boolean;
  savingRuleId: string | null;
  onCreateRule: () => void;
  onResetRules: () => void;
  onRulePatch: (id: string, patch: Partial<RuleConfig>) => void;
  onSaveRule: (rule: RuleConfig) => void;
  onDeleteRule: (id: string) => void;
}) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300">规则配置</h2>
        <div className="flex gap-2">
          <button
            onClick={onCreateRule}
            disabled={creatingRule || rulesLoading}
            className="text-xs rounded border border-indigo-200 text-indigo-700 px-2.5 py-1 hover:bg-indigo-50 disabled:opacity-50"
          >
            {creatingRule ? "新增中..." : "新增规则"}
          </button>
          <button
            onClick={onResetRules}
            disabled={resettingRules || rulesLoading}
            className="text-xs rounded border border-gray-300 text-gray-700 px-2.5 py-1 hover:bg-gray-100 disabled:opacity-50"
          >
            {resettingRules ? "重置中..." : "重置默认规则"}
          </button>
        </div>
      </div>

      {rulesError && <div className="text-xs rounded border border-red-200 bg-red-50 text-red-600 px-3 py-2">{rulesError}</div>}

      {rulesLoading ? (
        <div className="text-sm text-gray-400">加载规则中...</div>
      ) : rules.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 dark:border-gray-800 p-6 text-sm text-gray-400">暂无规则。</div>
      ) : (
        <div className="space-y-3">
          {rules.map((rule) => {
            const action = actionById[rule.actionType];
            const busy = savingRuleId === rule.id;
            return (
              <div key={rule.id} className="rounded-xl border border-gray-200 dark:border-gray-800 p-3 space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                  <input
                    className="rounded border border-gray-300 dark:border-gray-700 px-2 py-1.5 text-sm bg-white dark:bg-gray-900"
                    value={rule.name}
                    onChange={(e) => onRulePatch(rule.id, { name: e.target.value })}
                    placeholder="规则名称"
                  />
                  <select
                    className="rounded border border-gray-300 dark:border-gray-700 px-2 py-1.5 text-sm bg-white dark:bg-gray-900"
                    value={rule.button}
                    onChange={(e) => onRulePatch(rule.id, { button: e.target.value as MouseButtonValue })}
                  >
                    {BUTTON_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <select
                    className="rounded border border-gray-300 dark:border-gray-700 px-2 py-1.5 text-sm bg-white dark:bg-gray-900"
                    value={rule.gesture.toUpperCase()}
                    onChange={(e) => onRulePatch(rule.id, { gesture: e.target.value.toUpperCase() })}
                  >
                    {GESTURE_OPTIONS.map((g) => (
                      <option key={g} value={g}>
                        {g} {DIRECTION_ARROW[g]}
                      </option>
                    ))}
                  </select>
                  <select
                    className="rounded border border-gray-300 dark:border-gray-700 px-2 py-1.5 text-sm bg-white dark:bg-gray-900"
                    value={rule.actionType}
                    onChange={(e) => onRulePatch(rule.id, { actionType: e.target.value })}
                  >
                    {actions.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <label className="inline-flex items-center gap-1.5">
                    <input
                      type="checkbox"
                      checked={rule.enabled}
                      onChange={(e) => onRulePatch(rule.id, { enabled: e.target.checked })}
                    />
                    启用
                  </label>
                  <span className="font-mono">{rule.id}</span>
                  {action && <span className="ml-auto">{formatHotkey(action)}</span>}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => onSaveRule(rule)}
                    disabled={busy}
                    className="text-xs rounded border border-indigo-200 text-indigo-700 px-2.5 py-1 hover:bg-indigo-50 disabled:opacity-50"
                  >
                    {busy ? "保存中..." : "保存"}
                  </button>
                  <button
                    onClick={() => onDeleteRule(rule.id)}
                    disabled={busy}
                    className="text-xs rounded border border-red-200 text-red-700 px-2.5 py-1 hover:bg-red-50 disabled:opacity-50"
                  >
                    删除
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

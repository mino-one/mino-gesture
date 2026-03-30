import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { getInitialLanguage, I18N_MESSAGES, type Language } from "./i18n";

type AppStatus = {
  enabled: boolean;
  inputRunning: boolean;
  recognizerReady: boolean;
  hotkeyReady: boolean;
  configPath: string;
  lastExecution?: ExecutionResult | null;
};

type Rule = {
  id: string;
  name: string;
  enabled: boolean;
  scope: string;
  gesture: string;
  actionType: string;
};

type ExecutionResult = {
  matched: boolean;
  scope: string;
  gesture: string;
  ruleName?: string | null;
  actionType?: string | null;
  success: boolean;
  message: string;
};

const GESTURE_PATTERN = /^[UDLR]+$/;

export function App() {
  const [lang, setLang] = useState<Language>(() => getInitialLanguage());
  const [status, setStatus] = useState<AppStatus | null>(null);
  const [rules, setRules] = useState<Rule[]>([]);
  const [name, setName] = useState("");
  const [gesture, setGesture] = useState("U");
  const [scope, setScope] = useState("global");
  const [testGesture, setTestGesture] = useState("U");
  const [testScope, setTestScope] = useState("global");
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const t = (key: string) => I18N_MESSAGES[lang][key] ?? key;

  const refreshRules = async () => {
    const nextRules = await invoke<Rule[]>("list_rules");
    setRules(nextRules);
  };

  const refresh = async () => {
    setError(null);
    const [nextStatus] = await Promise.all([
      invoke<AppStatus>("get_status"),
      refreshRules()
    ]);
    setStatus(nextStatus);
  };

  const setEnabled = async (enabled: boolean) => {
    try {
      setLoading(true);
      await invoke("set_enabled", { enabled });
      await refresh();
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh().catch((e) => setError(String(e)));
  }, []);

  useEffect(() => {
    localStorage.setItem("app-language", lang);
  }, [lang]);

  const createRule = async () => {
    if (!name.trim()) {
      setError(t("errors.nameRequired"));
      return;
    }
    const normalizedGesture = gesture.trim().toUpperCase();
    if (!GESTURE_PATTERN.test(normalizedGesture)) {
      setError(t("errors.gesturePattern"));
      return;
    }
    try {
      setLoading(true);
      setError(null);
      await invoke("create_rule", {
        payload: {
          name: name.trim(),
          gesture: normalizedGesture,
          scope: scope.trim() || "global"
        }
      });
      setName("");
      setScope("global");
      await refresh();
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  };

  const updateRule = async (rule: Rule) => {
    const normalizedGesture = rule.gesture.trim().toUpperCase();
    if (!GESTURE_PATTERN.test(normalizedGesture)) {
      setError(t("errors.gesturePattern"));
      return;
    }
    try {
      setLoading(true);
      setError(null);
      await invoke("update_rule", {
        payload: {
          ...rule,
          gesture: normalizedGesture,
          scope: rule.scope.trim() || "global"
        }
      });
      setEditingRuleId(null);
      await refreshRules();
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  };

  const removeRule = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await invoke("delete_rule", { payload: { id } });
      await refreshRules();
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  };

  const patchRule = (id: string, partial: Partial<Rule>) => {
    setRules((prev) => prev.map((r) => (r.id === id ? { ...r, ...partial } : r)));
  };

  const executeGesture = async () => {
    const normalizedGesture = testGesture.trim().toUpperCase();
    if (!GESTURE_PATTERN.test(normalizedGesture)) {
      setError(t("errors.gesturePattern"));
      return;
    }
    try {
      setLoading(true);
      setError(null);
      await invoke<ExecutionResult>("execute_gesture", {
        payload: {
          gesture: normalizedGesture,
          scope: testScope.trim() || "global"
        }
      });
      await refresh();
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto grid min-h-screen w-full max-w-3xl gap-4 bg-slate-950 px-6 py-6 text-slate-100">
      <header>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">mino-gesture</h1>
            <p className="mt-1 text-sm text-slate-400">{t("header.subtitle")}</p>
          </div>
          <button
            className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-xs text-slate-100 hover:bg-slate-700"
            onClick={() => setLang((prev) => (prev === "zh-CN" ? "en-US" : "zh-CN"))}
          >
            {t("header.switchToEnglish")}
          </button>
        </div>
      </header>

      <section className="rounded-xl border border-slate-700 bg-slate-900 p-4">
        <h2 className="text-lg font-medium">{t("permissions.title")}</h2>
        <p className="mt-2 text-slate-300">{t("permissions.desc")}</p>
      </section>

      <section className="rounded-xl border border-slate-700 bg-slate-900 p-4">
        <h2 className="text-lg font-medium">{t("runtime.title")}</h2>
        {status ? (
          <ul className="mt-2 grid list-disc gap-1 pl-5 text-sm text-slate-300">
            <li>{t("runtime.enabled")}: {String(status.enabled)}</li>
            <li>{t("runtime.input")}: {String(status.inputRunning)}</li>
            <li>{t("runtime.recognizer")}: {String(status.recognizerReady)}</li>
            <li>{t("runtime.hotkey")}: {String(status.hotkeyReady)}</li>
            <li>{t("runtime.config")}: {status.configPath}</li>
          </ul>
        ) : (
          <p className="mt-2 text-slate-300">{t("runtime.loading")}</p>
        )}
        <div className="mt-3 flex gap-2">
          <button
            className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-100 hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => setEnabled(true)}
            disabled={loading}
          >
            {t("actions.enable")}
          </button>
          <button
            className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-100 hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => setEnabled(false)}
            disabled={loading}
          >
            {t("actions.disable")}
          </button>
          <button
            className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-100 hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => refresh()}
            disabled={loading}
          >
            {t("actions.refresh")}
          </button>
        </div>
        <div className="mt-3 grid gap-2 rounded-lg border border-slate-700 bg-slate-950 p-3">
          <p className="text-xs font-medium text-slate-300">Gesture Debug</p>
          <div className="flex gap-2">
            <input
              className="w-20 rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-100"
              value={testGesture}
              onChange={(e) => setTestGesture(e.target.value)}
            />
            <input
              className="w-44 rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-100"
              value={testScope}
              onChange={(e) => setTestScope(e.target.value)}
            />
            <button
              className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-100 hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={executeGesture}
              disabled={loading}
            >
              Execute
            </button>
          </div>
          {status?.lastExecution && (
            <p className="text-xs text-slate-400">
              {status.lastExecution.success ? "OK" : "ERR"} ·{" "}
              {status.lastExecution.gesture} · {status.lastExecution.scope} ·{" "}
              {status.lastExecution.ruleName ?? "no-rule"} ·{" "}
              {status.lastExecution.message}
            </p>
          )}
        </div>
      </section>
      <section className="rounded-xl border border-slate-700 bg-slate-900 p-4">
        <h2 className="text-lg font-medium">{t("rules.title")}</h2>
        <div className="mt-3 flex gap-2">
          <input
            className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-400"
            placeholder={t("rules.namePlaceholder")}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="w-20 rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-100"
            value={gesture}
            onChange={(e) => setGesture(e.target.value)}
          />
          <input
            className="w-44 rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-100"
            value={scope}
            onChange={(e) => setScope(e.target.value)}
          />
          <button
            className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-100 hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={createRule}
            disabled={loading}
          >
            {t("rules.add")}
          </button>
        </div>
        <ul className="mt-3 grid gap-2 text-sm text-slate-300">
          {rules.map((rule) => (
            <li
              key={rule.id}
              className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2"
            >
              {editingRuleId === rule.id ? (
                <div className="grid gap-2">
                  <div className="flex gap-2">
                    <input
                      className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-100"
                      value={rule.name}
                      onChange={(e) =>
                        patchRule(rule.id, { name: e.target.value })
                      }
                    />
                    <input
                      className="w-20 rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-100"
                      value={rule.gesture}
                      onChange={(e) =>
                        patchRule(rule.id, { gesture: e.target.value })
                      }
                    />
                    <input
                      className="w-44 rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-100"
                      value={rule.scope}
                      onChange={(e) =>
                        patchRule(rule.id, { scope: e.target.value })
                      }
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-xs text-slate-100 hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                      onClick={() => updateRule(rule)}
                      disabled={loading}
                    >
                      {t("rules.save")}
                    </button>
                    <button
                      className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-xs text-slate-100 hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                      onClick={() => setEditingRuleId(null)}
                      disabled={loading}
                    >
                      {t("rules.cancel")}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <span className="font-medium text-slate-100">{rule.name}</span>
                    <span className="ml-2 text-slate-400">
                      {rule.gesture} · {rule.scope} · {rule.actionType} ·{" "}
                      {rule.enabled ? t("rules.enabled") : t("rules.disabled")}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="rounded-lg border border-slate-600 bg-slate-800 px-2 py-1 text-xs text-slate-100 hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                      onClick={() => updateRule({ ...rule, enabled: !rule.enabled })}
                      disabled={loading}
                    >
                      {rule.enabled ? t("rules.disable") : t("rules.enable")}
                    </button>
                    <button
                      className="rounded-lg border border-slate-600 bg-slate-800 px-2 py-1 text-xs text-slate-100 hover:bg-slate-700"
                      onClick={() => setEditingRuleId(rule.id)}
                    >
                      {t("rules.edit")}
                    </button>
                    <button
                      className="rounded-lg border border-rose-800 bg-rose-950 px-2 py-1 text-xs text-rose-200 hover:bg-rose-900 disabled:cursor-not-allowed disabled:opacity-50"
                      onClick={() => removeRule(rule.id)}
                      disabled={loading}
                    >
                      {t("rules.delete")}
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
          {rules.length === 0 && <li className="text-slate-400">{t("rules.empty")}</li>}
        </ul>
      </section>
      {error && <p className="text-sm text-rose-300">{error}</p>}
    </main>
  );
}

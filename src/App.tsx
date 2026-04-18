import { useEffect, useMemo, useRef, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { HistorySection } from "./components/HistorySection";
import { ResultSection } from "./components/ResultSection";
import { RuleSection } from "./components/RuleSection";
import { ScreenMap } from "./components/ScreenMap";
import type { ActionConfig, GestureResult, RuleConfig, ScreenInfo, TrailStartPayload } from "./types/app";

export function App() {
  const [isListening, setIsListening] = useState(false);
  const capturingRef = useRef(false);
  const [lastResult, setLastResult] = useState<GestureResult | null>(null);
  const [history, setHistory] = useState<GestureResult[]>([]);
  const [screens, setScreens] = useState<ScreenInfo[]>([]);
  const [activeScreenIndex, setActiveScreenIndex] = useState<number>(0);

  const [rules, setRules] = useState<RuleConfig[]>([]);
  const [actions, setActions] = useState<ActionConfig[]>([]);
  const [rulesLoading, setRulesLoading] = useState(true);
  const [rulesError, setRulesError] = useState<string | null>(null);
  const [savingRuleId, setSavingRuleId] = useState<string | null>(null);
  const [creatingRule, setCreatingRule] = useState(false);
  const [resettingRules, setResettingRules] = useState(false);

  const actionById = useMemo(() => {
    return Object.fromEntries(actions.map((a) => [a.id, a]));
  }, [actions]);

  const refreshRulesAndActions = async () => {
    setRulesLoading(true);
    setRulesError(null);
    try {
      const [nextRules, nextActions] = await Promise.all([
        invoke<RuleConfig[]>("list_rules"),
        invoke<ActionConfig[]>("list_actions"),
      ]);
      setRules(nextRules);
      setActions(nextActions);
    } catch (err) {
      setRulesError(String(err));
    } finally {
      setRulesLoading(false);
    }
  };

  useEffect(() => {
    setIsListening(true);
    void refreshRulesAndActions();

    const unlistenStart = listen<TrailStartPayload>("trail-start", (e) => {
      capturingRef.current = true;
      setLastResult(null);
      if (e.payload.screens?.length) {
        setScreens(e.payload.screens);
        setActiveScreenIndex(e.payload.activeScreenIndex);
      }
    });

    const unlistenResult = listen<GestureResult>("gesture-result", (e) => {
      const r = e.payload;
      capturingRef.current = false;
      setLastResult(r);
      if (r.gesture) setHistory((prev) => [r, ...prev].slice(0, 20));
    });

    return () => {
      setIsListening(false);
      unlistenStart.then((fn) => fn());
      unlistenResult.then((fn) => fn());
    };
  }, []);

  const updateRuleLocal = (id: string, patch: Partial<RuleConfig>) => {
    setRules((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  };

  const saveRule = async (rule: RuleConfig) => {
    setSavingRuleId(rule.id);
    setRulesError(null);
    try {
      await invoke<RuleConfig>("update_rule", {
        payload: {
          id: rule.id,
          name: rule.name,
          enabled: rule.enabled,
          scope: "global",
          button: rule.button,
          gesture: rule.gesture.toUpperCase(),
          actionType: rule.actionType,
        },
      });
      setRules((prev) =>
        prev.map((r) => (r.id === rule.id ? { ...rule, gesture: rule.gesture.toUpperCase(), scope: "global" } : r)),
      );
    } catch (err) {
      setRulesError(String(err));
    } finally {
      setSavingRuleId(null);
    }
  };

  const removeRule = async (id: string) => {
    setSavingRuleId(id);
    setRulesError(null);
    try {
      await invoke("delete_rule", { payload: { id } });
      setRules((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      setRulesError(String(err));
    } finally {
      setSavingRuleId(null);
    }
  };

  const createRule = async () => {
    if (actions.length === 0) {
      setRulesError("当前没有可用操作，请先检查配置。");
      return;
    }
    setCreatingRule(true);
    setRulesError(null);
    try {
      const created = await invoke<RuleConfig>("create_rule", {
        payload: {
          name: "新规则",
          scope: "global",
          button: "middle",
          gesture: "U",
          actionType: actions[0].id,
        },
      });
      setRules((prev) => [created, ...prev]);
    } catch (err) {
      setRulesError(String(err));
    } finally {
      setCreatingRule(false);
    }
  };

  const resetRules = async () => {
    setResettingRules(true);
    setRulesError(null);
    try {
      const next = await invoke<RuleConfig[]>("reset_rules");
      setRules(next);
    } catch (err) {
      setRulesError(String(err));
    } finally {
      setResettingRules(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-10">
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Mino Gesture</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">按住中/右键画手势</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isListening ? "bg-green-500 animate-pulse" : "bg-gray-300"}`} />
            <span className="text-xs text-gray-500 dark:text-gray-400">{isListening ? "监听中" : "未连接"}</span>
          </div>
        </div>
      </header>

      <main className="p-6 space-y-6 max-w-4xl mx-auto">
        <ResultSection lastResult={lastResult} />

        <RuleSection
          rules={rules}
          actions={actions}
          actionById={actionById}
          rulesLoading={rulesLoading}
          rulesError={rulesError}
          creatingRule={creatingRule}
          resettingRules={resettingRules}
          savingRuleId={savingRuleId}
          onCreateRule={() => void createRule()}
          onResetRules={() => void resetRules()}
          onRulePatch={updateRuleLocal}
          onSaveRule={(rule) => void saveRule(rule)}
          onDeleteRule={(id) => void removeRule(id)}
        />

        <HistorySection history={history} onClear={() => setHistory([])} />

        {screens.length > 0 && (
          <section className="space-y-2">
            <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              屏幕布局
              <span className="ml-2 text-xs font-normal text-gray-400 dark:text-gray-600">{screens.length} 块显示器</span>
            </h2>
            <ScreenMap screens={screens} activeIndex={activeScreenIndex} />
          </section>
        )}
      </main>
    </div>
  );
}

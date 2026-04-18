import { useEffect, useMemo, useRef, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { BUTTON_OPTIONS, GESTURE_OPTIONS, formatHotkey, parseGestureArrows } from "./gesture";
import { ResultSection } from "./components/ResultSection";
import { RuleSection } from "./components/RuleSection";
import { ScreenMap } from "./components/ScreenMap";
import type { ActionConfig, GestureResult, MouseButtonValue, RuleConfig, ScreenInfo, TrailStartPayload } from "./types/app";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import { Input } from "./components/ui/input";
import { Select } from "./components/ui/select";
import { Switch } from "./components/ui/switch";

type ViewRoute = "home" | "panel";
type TimedGestureResult = GestureResult & { at: number };

type CreateRuleDraft = {
  name: string;
  button: MouseButtonValue;
  gesture: string;
  actionType: string;
};

function readRouteState(): { route: ViewRoute; search: string } {
  if (typeof window === "undefined") return { route: "home", search: "" };
  return {
    route: window.location.pathname === "/panel" ? "panel" : "home",
    search: window.location.search,
  };
}

export function App() {
  const [routeState, setRouteState] = useState(readRouteState);
  const route = routeState.route;

  const [isListening, setIsListening] = useState(false);
  const handledIntentRef = useRef<string>("");
  const [advancedView, setAdvancedView] = useState(false);
  const [showCreatePopover, setShowCreatePopover] = useState(false);

  const [lastResult, setLastResult] = useState<GestureResult | null>(null);
  const [history, setHistory] = useState<TimedGestureResult[]>([]);
  const [screens, setScreens] = useState<ScreenInfo[]>([]);
  const [activeScreenIndex, setActiveScreenIndex] = useState<number>(0);

  const [rules, setRules] = useState<RuleConfig[]>([]);
  const [actions, setActions] = useState<ActionConfig[]>([]);
  const [rulesLoading, setRulesLoading] = useState(true);
  const [rulesError, setRulesError] = useState<string | null>(null);
  const [savingRuleId, setSavingRuleId] = useState<string | null>(null);
  const [creatingRule, setCreatingRule] = useState(false);
  const [resettingRules, setResettingRules] = useState(false);

  const [activeTab, setActiveTab] = useState<"all" | "navigation" | "apps" | "scripts">("all");
  const [draft, setDraft] = useState<CreateRuleDraft>({
    name: "新规则",
    button: "middle",
    gesture: "U",
    actionType: "",
  });

  const shouldAutoCreateRule = useMemo(
    () => new URLSearchParams(routeState.search).get("intent") === "create",
    [routeState.search],
  );

  const actionById = useMemo(() => {
    return Object.fromEntries(actions.map((a) => [a.id, a]));
  }, [actions]);

  const usageByActionId = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const item of history) {
      if (!item.actionType) continue;
      counts[item.actionType] = (counts[item.actionType] ?? 0) + 1;
    }
    return counts;
  }, [history]);

  const navigateTo = (to: string) => {
    window.history.pushState({}, "", to);
    setRouteState(readRouteState());
  };

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
      setDraft((prev) => ({ ...prev, actionType: prev.actionType || nextActions[0]?.id || "" }));
    } catch (err) {
      setRulesError(String(err));
    } finally {
      setRulesLoading(false);
    }
  };

  useEffect(() => {
    const onPopState = () => setRouteState(readRouteState());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    if (route !== "panel") {
      setIsListening(false);
      return;
    }

    setIsListening(true);
    void refreshRulesAndActions();

    const unlistenStart = listen<TrailStartPayload>("trail-start", (e) => {
      setLastResult(null);
      if (e.payload.screens?.length) {
        setScreens(e.payload.screens);
        setActiveScreenIndex(e.payload.activeScreenIndex);
      }
    });

    const unlistenResult = listen<GestureResult>("gesture-result", (e) => {
      const r = e.payload;
      setLastResult(r);
      if (r.gesture) setHistory((prev) => [{ ...r, at: Date.now() }, ...prev].slice(0, 20));
    });

    return () => {
      setIsListening(false);
      unlistenStart.then((fn) => fn());
      unlistenResult.then((fn) => fn());
    };
  }, [route]);

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

  const createRule = async (payload?: Partial<CreateRuleDraft>) => {
    if (actions.length === 0) {
      setRulesError("当前没有可用操作，请先检查配置。");
      return;
    }
    const finalPayload: CreateRuleDraft = {
      name: payload?.name?.trim() || draft.name || "新规则",
      button: payload?.button ?? draft.button,
      gesture: (payload?.gesture ?? draft.gesture).toUpperCase(),
      actionType: payload?.actionType ?? (draft.actionType || actions[0].id),
    };

    setCreatingRule(true);
    setRulesError(null);
    try {
      const created = await invoke<RuleConfig>("create_rule", {
        payload: {
          name: finalPayload.name,
          scope: "global",
          button: finalPayload.button,
          gesture: finalPayload.gesture,
          actionType: finalPayload.actionType,
        },
      });
      setRules((prev) => [created, ...prev]);
      setShowCreatePopover(false);
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

  useEffect(() => {
    if (route !== "panel") return;
    if (!shouldAutoCreateRule) return;
    if (rulesLoading || creatingRule || actions.length === 0) return;

    const intentKey = routeState.search;
    if (handledIntentRef.current === intentKey) return;
    handledIntentRef.current = intentKey;

    void createRule().finally(() => {
      window.history.replaceState({}, "", "/panel");
      setRouteState(readRouteState());
    });
  }, [route, shouldAutoCreateRule, rulesLoading, creatingRule, actions.length, routeState.search]);

  const visibleRules = useMemo(() => {
    if (activeTab === "all") return rules;
    if (activeTab === "navigation") return rules.filter((rule) => rule.gesture.includes("L") || rule.gesture.includes("R"));
    if (activeTab === "apps") return rules.filter((rule) => !rule.gesture.includes("L") && !rule.gesture.includes("R"));
    return [];
  }, [rules, activeTab]);

  if (route === "home") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#f5f2fa] to-[#eef3ff] px-6 py-10 dark:from-zinc-950 dark:to-zinc-900">
        <div className="mx-auto flex min-h-[80vh] w-full max-w-[720px] flex-col items-center justify-center gap-8 text-center">
          <div className="space-y-3">
            <h1 className="text-4xl font-semibold tracking-tight text-foreground">Welcome to Gesture Control</h1>
            <p className="text-sm text-muted-foreground">配置你的首个鼠标手势流程，快速进入控制中心。</p>
          </div>
          <div className="w-full max-w-sm space-y-3">
            <Button className="h-12 w-full text-base" onClick={() => navigateTo("/panel")}>
              Get Started with a Demo Gesture
            </Button>
            <Button variant="secondary" className="h-12 w-full text-base" onClick={() => navigateTo("/panel?intent=create")}>
              Create a New Gesture
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5f2fa] to-[#eef3ff] p-0 dark:from-zinc-950 dark:to-zinc-900">
      <div className="relative mx-auto h-screen w-full max-w-[720px] overflow-hidden border border-border/60 bg-card/70 shadow-sm backdrop-blur-sm dark:bg-card/80">
        <header className="flex items-center justify-between border-b border-border/60 bg-background/60 px-4 py-2">
          <div className="flex flex-wrap items-center gap-1">
            {[
              { key: "all", label: "All" },
              { key: "navigation", label: "Navigation" },
              { key: "apps", label: "Apps" },
              { key: "scripts", label: "Scripts" },
            ].map((tab) => (
              <Button
                key={tab.key}
                variant={activeTab === tab.key ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
              >
                {tab.label}
              </Button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => navigateTo("/")}>
              Home
            </Button>
            <Button
              size="icon"
              onClick={() => setShowCreatePopover((v) => !v)}
              disabled={rulesLoading || actions.length === 0}
              aria-label="Add gesture"
            >
              +
            </Button>
            <Switch checked={isListening} disabled />
          </div>
        </header>

        {showCreatePopover && (
          <>
            <button className="absolute inset-0 z-20 bg-transparent" onClick={() => setShowCreatePopover(false)} aria-label="Close" />
            <Card className="absolute right-3 top-14 z-30 w-[400px] max-w-[calc(100%-24px)] border-border/60 bg-background/95 backdrop-blur">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Add Gesture</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">Name</p>
                    <Input value={draft.name} onChange={(e) => setDraft((prev) => ({ ...prev, name: e.target.value }))} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">Button</p>
                    <Select
                      value={draft.button}
                      onChange={(e) => setDraft((prev) => ({ ...prev, button: e.target.value as MouseButtonValue }))}
                    >
                      {BUTTON_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">Gesture</p>
                    <Select value={draft.gesture} onChange={(e) => setDraft((prev) => ({ ...prev, gesture: e.target.value }))}>
                      {GESTURE_OPTIONS.map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">Action</p>
                    <Select value={draft.actionType} onChange={(e) => setDraft((prev) => ({ ...prev, actionType: e.target.value }))}>
                      {actions.map((action) => (
                        <option key={action.id} value={action.id}>
                          {action.name}
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowCreatePopover(false)} disabled={creatingRule}>
                    Cancel
                  </Button>
                  <Button onClick={() => void createRule()} disabled={creatingRule}>
                    {creatingRule ? "Adding..." : "Add"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        <main className="space-y-4 overflow-y-auto p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-3xl font-semibold tracking-tight text-foreground">My Gestures</h2>
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setAdvancedView((v) => !v)}>
                Advanced View <span className="ml-1 text-muted-foreground">?</span>
              </Button>
              <Badge className="border-border/60 bg-secondary/80">Sort: By Usage</Badge>
            </div>
          </div>

          {rulesLoading ? (
            <p className="text-sm text-muted-foreground">Loading gestures...</p>
          ) : (
            <div className="rounded-xl border border-border/60 bg-background/35 p-3 dark:bg-background/20">
              <div className="grid grid-cols-3 gap-3">
                {visibleRules.slice(0, 3).map((rule) => {
                  const action = actionById[rule.actionType];
                  const arrows = parseGestureArrows(rule.gesture).join("");
                  const usage = usageByActionId[rule.actionType] ?? 0;
                  return (
                    <Card key={rule.id} className="border-border/60 bg-background/80 shadow-sm">
                      <CardContent className="space-y-2.5 p-3">
                        <div className="rounded-md border border-border/80 bg-secondary/55 px-2 py-1 text-center text-2xl font-semibold leading-tight dark:bg-secondary/40">
                          {action ? formatHotkey(action) : `Ctrl + ${arrows}`}
                        </div>
                        <p className="truncate text-center text-sm font-semibold text-foreground">{action?.name ?? rule.name}</p>
                        <div className="flex items-center justify-between rounded-md border border-border/70 bg-secondary/45 px-2 py-1 text-[11px] text-muted-foreground dark:bg-secondary/30">
                          <span>{arrows || "↔"}</span>
                          <span>{usage === 0 ? "Automated" : `${usage} times`}</span>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <Badge className="border-border/70 bg-secondary/70">
              Filters: {activeTab === "all" ? "All" : activeTab}
            </Badge>
            <Badge className="border-border/70 bg-secondary/70">Rules: {visibleRules.length}</Badge>
          </div>

          {rulesError && (
            <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {rulesError}
            </div>
          )}

          {advancedView && (
            <section className="space-y-6 border-t border-border/60 pt-4">
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
              {screens.length > 0 && (
                <section className="space-y-3">
                  <h2 className="text-lg font-semibold text-foreground">
                    屏幕布局
                    <span className="ml-2 text-sm font-normal text-muted-foreground">{screens.length} 块显示器</span>
                  </h2>
                  <ScreenMap screens={screens} activeIndex={activeScreenIndex} />
                </section>
              )}
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

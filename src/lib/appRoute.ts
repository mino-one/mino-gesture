import type { ViewRoute } from "../types/app";

const ONBOARDING_DONE_KEY = "mino:onboarding-complete";

export function hasCompletedOnboarding(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(ONBOARDING_DONE_KEY) === "true";
}

export function markOnboardingCompleted() {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ONBOARDING_DONE_KEY, "true");
}

export function readRouteState(): { route: ViewRoute; search: string } {
  if (typeof window === "undefined") return { route: "home", search: "" };
  const pathname = window.location.pathname;
  const route =
    pathname === "/home"
      ? "home"
      : pathname === "/panel" || (pathname === "/" && hasCompletedOnboarding())
      ? "panel"
      : "home";
  return {
    route,
    search: window.location.search,
  };
}

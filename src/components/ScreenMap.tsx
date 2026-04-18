import type { ScreenInfo } from "../types/app";

export function ScreenMap({ screens, activeIndex }: { screens: ScreenInfo[]; activeIndex: number }) {
  if (screens.length === 0) return null;

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const s of screens) {
    minX = Math.min(minX, s.x);
    minY = Math.min(minY, s.y);
    maxX = Math.max(maxX, s.x + s.w);
    maxY = Math.max(maxY, s.y + s.h);
  }

  const totalW = maxX - minX;
  const totalH = maxY - minY;
  const svgW = 320;
  const svgH = Math.round((totalH / totalW) * svgW);
  const scale = svgW / totalW;

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-4">
      <svg width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`} className="block mx-auto" style={{ maxWidth: "100%" }}>
        {screens.map((s, i) => {
          const x = (s.x - minX) * scale;
          const y = (s.y - minY) * scale;
          const w = s.w * scale;
          const h = s.h * scale;
          const isActive = i === activeIndex;
          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={w}
                height={h}
                rx={4}
                ry={4}
                fill={isActive ? "rgba(99,102,241,0.15)" : "rgba(156,163,175,0.12)"}
                stroke={isActive ? "rgb(99,102,241)" : "rgb(209,213,219)"}
                strokeWidth={isActive ? 2 : 1}
                className="dark:[stroke:rgb(79,82,221)] dark:[fill:rgba(99,102,241,0.2)]"
              />
              <text
                x={x + w / 2}
                y={y + h / 2 - (s.name ? 8 : 0)}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={Math.max(11, Math.min(18, h * 0.3))}
                fontWeight="700"
                fill={isActive ? "rgb(79,70,229)" : "rgb(156,163,175)"}
              >
                {i + 1}
              </text>
              {s.name && (
                <text
                  x={x + w / 2}
                  y={y + h / 2 + Math.max(9, Math.min(14, h * 0.22))}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={Math.max(8, Math.min(11, h * 0.18))}
                  fill={isActive ? "rgb(99,102,241)" : "rgb(156,163,175)"}
                >
                  {s.name.length > 14 ? `${s.name.slice(0, 13)}…` : s.name}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

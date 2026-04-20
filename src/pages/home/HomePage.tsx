import { PageLayout } from "../../components/layout/PageLayout";
import { IconPencil, IconRocket, IconShieldCheck } from "../../components/icons";
import { Button } from "../../components/ui/button";

type HomePageProps = {
  onOpenPanel: () => void;
  onOpenPanelCreate: () => void;
};

export function HomePage({ onOpenPanel, onOpenPanelCreate }: HomePageProps) {
  const header = (
    <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-semibold tracking-[-0.02em] text-foreground">
          mino-gesture
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          macOS 鼠标手势控制中心
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <span className="app-panel-subtle rounded-full px-3 py-1">
          开箱即用示例
        </span>
        <span className="app-panel-subtle rounded-full px-3 py-1">
          自定义快捷键映射
        </span>
      </div>
    </div>
  );

  const footer = (
    <div className="flex flex-col gap-2 py-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
      <span>两种方式都会进入同一个控制中心，后续可以随时编辑、关闭或删除规则。</span>
      <span>如果只是想快速试用，优先选择推荐示例。</span>
    </div>
  );

  return (
    <PageLayout
      header={header}
      footer={footer}
      containerSize="lg"
      contentClassName="px-6 py-8 sm:px-8 sm:py-10"
    >
      <div className="mx-auto grid w-full max-w-[1120px] gap-6 lg:grid-cols-[minmax(0,1.1fr)_380px] lg:items-start">
        <section className="app-home-hero rounded-[28px] px-6 py-7 sm:px-8 sm:py-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground/72">
              First Run
            </span>
            <span className="rounded-full bg-[hsl(var(--brand-primary)/0.14)] px-3 py-1 text-xs font-medium text-foreground/80">
              推荐先用示例规则熟悉手势节奏
            </span>
          </div>

          <div className="mt-5 max-w-[680px] space-y-4">
            <h1 className="max-w-[12ch] text-4xl font-semibold tracking-[-0.04em] text-foreground sm:text-5xl">
              让常用快捷键跟着鼠标手势走
            </h1>
            <p className="max-w-[62ch] text-base leading-7 text-foreground/78">
              mino-gesture 会把中键或右键的划动动作映射成你常用的快捷键。你现在只需要决定：
              先用一套推荐示例快速上手，还是直接从空白规则开始自定义。
            </p>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="app-home-step rounded-2xl px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground/48">
                01
              </p>
              <p className="mt-3 text-sm font-medium text-foreground">
                进入控制中心
              </p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                无论选哪条路径，都会进入同一个规则面板。
              </p>
            </div>
            <div className="app-home-step rounded-2xl px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground/48">
                02
              </p>
              <p className="mt-3 text-sm font-medium text-foreground">
                试用或录入快捷键
              </p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                推荐示例适合马上体验，空白创建适合已有明确映射方案。
              </p>
            </div>
            <div className="app-home-step rounded-2xl px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground/48">
                03
              </p>
              <p className="mt-3 text-sm font-medium text-foreground">
                随时返回修改
              </p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                创建后的规则可以继续编辑、停用或删除，不会把你锁死在当前选择里。
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-white/70 bg-white/72 px-4 py-4 text-sm text-foreground/80 shadow-[0_1px_0_rgba(255,255,255,0.72),0_18px_40px_rgba(36,48,83,0.06)] sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-full bg-[hsl(var(--brand-primary)/0.14)] p-2 text-foreground">
                <IconShieldCheck className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium text-foreground">第一次使用不需要做复杂决定</p>
                <p className="mt-1 leading-6 text-muted-foreground">
                  先用示例熟悉触发方式，再回到控制中心按你的习惯调整，是成本最低的起步方式。
                </p>
              </div>
            </div>
          </div>
        </section>

        <aside className="space-y-4">
          <div className="app-home-card app-home-card-primary rounded-[28px] p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  开始使用推荐示例
                </p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  适合第一次打开。先加载一套可直接体验的规则，再按你的习惯逐步微调。
                </p>
              </div>
              <span className="rounded-full bg-[hsl(var(--brand-primary)/0.16)] px-2.5 py-1 text-[11px] font-semibold tracking-[0.14em] text-foreground/70">
                推荐
              </span>
            </div>

            <div className="mt-5 space-y-3 text-sm text-foreground/80">
              <div className="flex items-start gap-3">
                <div className="mt-1 rounded-full bg-[hsl(var(--brand-primary)/0.12)] p-2 text-foreground">
                  <IconRocket className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium text-foreground">更快进入可用状态</p>
                  <p className="mt-1 leading-6 text-muted-foreground">
                    你可以立刻进入规则面板查看现成映射，不需要从零思考第一条规则。
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 rounded-full bg-white/80 p-2 text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
                  <IconShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium text-foreground">后续可随时改成你自己的方案</p>
                  <p className="mt-1 leading-6 text-muted-foreground">
                    示例只是起点，不会限制你继续编辑、关闭或删除这些规则。
                  </p>
                </div>
              </div>
            </div>

            <Button className="mt-6 h-12 w-full text-base" onClick={onOpenPanel}>
              进入控制中心并加载示例
            </Button>
          </div>

          <div className="app-home-card rounded-[28px] p-5 sm:p-6">
            <div>
              <p className="text-sm font-semibold text-foreground">
                从空白规则开始创建
              </p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                适合已经知道要绑定哪些动作和快捷键，希望直接手动配置的人。
              </p>
            </div>

            <div className="mt-5 space-y-3 text-sm text-foreground/80">
              <div className="flex items-start gap-3">
                <div className="mt-1 rounded-full bg-[hsl(var(--surface-secondary)/0.88)] p-2 text-foreground">
                  <IconPencil className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium text-foreground">直接录入你的第一条规则</p>
                  <p className="mt-1 leading-6 text-muted-foreground">
                    会直接打开创建流程，填写名称、触发按键、滑动方向和执行快捷键。
                  </p>
                </div>
              </div>
              <div className="rounded-2xl border border-border/70 bg-white/72 px-4 py-3 text-sm leading-6 text-muted-foreground">
                如果你还不确定怎么设置，建议先走上面的推荐路径，再回来调整。
              </div>
            </div>

            <Button
              variant="secondary"
              className="mt-6 h-12 w-full text-base"
              onClick={onOpenPanelCreate}
            >
              直接新建第一条规则
            </Button>
          </div>
        </aside>
      </div>
    </PageLayout>
  );
}

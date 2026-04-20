import { PageLayout } from "../../components/layout/PageLayout";
import { Button } from "../../components/ui/button";

type HomePageProps = {
  onOpenPanel: () => void;
  onOpenPanelCreate: () => void;
};

export function HomePage({ onOpenPanel, onOpenPanelCreate }: HomePageProps) {
  const header = (
    <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        {/* <p className="text-sm font-medium tracking-[-0.01em] text-foreground">
          mino-gesture
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          用鼠标手势触发常用操作
        </p> */}
      </div>
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <span className="app-panel-subtle rounded-full px-3 py-1">
          首次使用
        </span>
        <span className="app-panel-subtle rounded-full px-3 py-1">
          可随时修改
        </span>
      </div>
    </div>
  );

  const footer = (
    <div className="flex flex-col gap-2 py-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
      <span>两种方式都会进入同一个控制中心，之后都可以继续修改。</span>
      <span>第一次使用，推荐先加载示例。</span>
    </div>
  );

  return (
    <PageLayout
      header={header}
      footer={footer}
      containerSize="lg"
      contentClassName="py-7 sm:py-9"
    >
      <div className="mx-auto grid w-full max-w-[1200px] gap-5 px-4 sm:px-5 lg:grid-cols-[minmax(0,1.12fr)_360px] lg:items-start">
        <section className="app-home-hero rounded-[24px] px-6 py-6 sm:px-7 sm:py-7">
          <div className="flex flex-wrap items-center gap-2">
            <span className="app-panel-subtle rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-foreground/62">
              First Run
            </span>
            <span className="rounded-full bg-[hsl(var(--brand-primary)/0.08)] px-3 py-1 text-xs font-medium text-foreground/72">
              先用示例更容易上手
            </span>
          </div>

          <div className="mt-5 max-w-[640px] space-y-4">
            <h1 className="text-2xl font-semibold tracking-[-0.035em] text-foreground sm:text-[2.85rem]">
              怎么开始
            </h1>
            <p className="max-w-[58ch] text-[15px] leading-7 text-foreground/72">
              第一次使用时，推荐先加载示例。熟悉之后，再改成自己的习惯。
            </p>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="app-home-step rounded-[18px] px-4 py-4">
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-foreground/42">
                推荐路径
              </p>
              <p className="mt-2.5 text-sm font-medium text-foreground">
                先加载示例
              </p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                先试一遍，再慢慢调整。
              </p>
            </div>
            <div className="app-home-step rounded-[18px] px-4 py-4">
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-foreground/42">
                备选路径
              </p>
              <p className="mt-2.5 text-sm font-medium text-foreground">
                直接新建规则
              </p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                已经知道要什么时再选它。
              </p>
            </div>
          </div>
        </section>

        <aside className="space-y-4">
          <div className="app-home-card app-home-card-primary rounded-[24px] p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-foreground">
                  先加载推荐示例
                </p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  适合第一次使用。
                </p>
              </div>
              <span className="rounded-full bg-[hsl(var(--brand-primary)/0.1)] px-2.5 py-1 text-[11px] font-medium tracking-[0.12em] text-foreground/66">
                推荐
              </span>
            </div>

            <div className="mt-5 rounded-[18px] bg-[hsl(var(--brand-primary)/0.06)] px-4 py-3 text-sm leading-6 text-foreground/74">
              先试一遍，再按你的习惯修改。
            </div>

            <Button className="mt-6 h-11 w-full text-sm" onClick={onOpenPanel}>
              进入控制中心并加载示例
            </Button>
          </div>

          <div className="app-home-card rounded-[24px] p-5 sm:p-6">
            <div>
              <p className="text-sm font-medium text-foreground">
                直接新建规则
              </p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                适合已经知道自己要什么的人。
              </p>
            </div>

            <div className="mt-5 app-panel-subtle rounded-[18px] px-4 py-3 text-sm leading-6 text-muted-foreground">
              如果还不确定怎么设置，建议先选上面的示例。
            </div>

            <Button
              variant="secondary"
              className="mt-6 h-11 w-full text-sm"
              onClick={onOpenPanelCreate}
            >
              进入控制中心并新建规则
            </Button>
          </div>
        </aside>
      </div>
    </PageLayout>
  );
}

import { PageLayout } from "../../components/layout/PageLayout";
import { Button } from "../../components/ui/button";

type HomePageProps = {
  onOpenPanel: () => void;
  onOpenPanelCreate: () => void;
};

export function HomePage({ onOpenPanel, onOpenPanelCreate }: HomePageProps) {
  const header = (
    <div className="flex items-center justify-between border-b border-transparent py-4">
      <p className="text-sm font-medium tracking-[-0.01em] text-foreground">mino-gesture</p>
      <p className="text-xs text-muted-foreground">macOS 手势控制中心</p>
    </div>
  );

  const footer = (
    <div className="flex items-center justify-between border-t border-transparent py-4 text-xs text-muted-foreground">
      <span>从示例规则开始，或者直接创建你的第一条手势。</span>
      <span>进入控制中心后可随时调整映射。</span>
    </div>
  );

  return (
    <PageLayout
      header={header}
      footer={footer}
      containerSize="md"
      contentClassName="flex items-center px-6 py-10"
    >
      <div className="mx-auto flex w-full max-w-[720px] flex-col items-center justify-center gap-8 text-center">
        <div className="space-y-3">
          <h1 className="text-4xl font-semibold tracking-tight text-foreground">Welcome to Gesture Control</h1>
          <p className="text-sm text-muted-foreground">配置你的首个鼠标手势流程，快速进入控制中心。</p>
        </div>
        <div className="w-full max-w-sm space-y-3">
          <Button className="h-12 w-full text-base" onClick={onOpenPanel}>
            Get Started with a Demo Gesture
          </Button>
          <Button variant="secondary" className="h-12 w-full text-base" onClick={onOpenPanelCreate}>
            Create a New Gesture
          </Button>
        </div>
      </div>
    </PageLayout>
  );
}

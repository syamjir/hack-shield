
import TurnstileCaptcha from "@/components/ui/TurnstileCaptcha";

export default function Home() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background text-foreground">
      <div>
        <TurnstileCaptcha />
      </div>
    </div>
  );
}

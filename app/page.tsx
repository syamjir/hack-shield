import { ModeToggle } from "@/components/ui/ModeToggle";
import TurnstileCaptcha from "@/components/ui/TurnstileCaptcha";

export default function Home() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>
      <div>
        <TurnstileCaptcha />
      </div>
    </div>
  );
}

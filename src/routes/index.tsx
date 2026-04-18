import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ScanLine, KeyRound, Gauge, ShieldCheck, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  const { user, loading } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    if (!loading && user) nav({ to: "/dashboard" });
  }, [user, loading, nav]);

  return (
    <main className="min-h-screen relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <header className="relative z-10 max-w-6xl mx-auto px-6 pt-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display font-bold">
          <span className="h-8 w-8 rounded-md bg-gradient-primary flex items-center justify-center text-primary-foreground text-xs">VIN</span>
          VinSight Scan
        </Link>
        <Link to="/auth">
          <Button variant="ghost">Đăng nhập</Button>
        </Link>
      </header>

      <section className="relative z-10 max-w-5xl mx-auto px-6 pt-20 sm:pt-28 pb-16 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="inline-block text-[11px] uppercase tracking-[0.3em] text-primary font-semibold mb-5 px-3 py-1 rounded-full border border-primary/30 bg-primary/5">
            VIN Decoder API · NHTSA + WMI Việt Nam
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-bold leading-[1.05]">
            Giải mã <span className="bg-gradient-primary bg-clip-text text-transparent">mọi mã VIN</span>
            <br className="hidden sm:block" /> qua giao diện hoặc API
          </h1>
          <p className="mt-6 text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg">
            Nhập VIN trên web, hoặc tích hợp endpoint <code className="font-mono-vin text-primary">/api/decode</code> vào ứng dụng của bạn.
            Mặc định 60 requests/phút, có thể nâng giới hạn theo yêu cầu.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/scan">
              <Button size="lg" className="bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-amber">
                Quét VIN miễn phí <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="lg" variant="outline">Đăng nhập để lưu trữ</Button>
            </Link>
          </div>
        </motion.div>
      </section>

      <section className="relative z-10 max-w-6xl mx-auto px-6 pb-24 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: ScanLine, title: "Quét VIN", desc: "Quét barcode bằng camera hoặc nhập tay 17 ký tự." },
          { icon: KeyRound, title: "API Keys", desc: "Tạo nhiều key cho mỗi ứng dụng, vô hiệu khi cần." },
          { icon: Gauge, title: "Rate limit", desc: "60 req/phút mặc định, admin có thể nâng cấp." },
          { icon: ShieldCheck, title: "Bảo mật", desc: "Key chỉ hiển thị 1 lần, lưu dưới dạng SHA-256." },
        ].map((f) => (
          <div key={f.title} className="rounded-xl border border-border/60 bg-card/50 p-5">
            <f.icon className="h-6 w-6 text-primary mb-3" />
            <div className="font-semibold">{f.title}</div>
            <div className="text-sm text-muted-foreground mt-1">{f.desc}</div>
          </div>
        ))}
      </section>

      <section className="relative z-10 max-w-3xl mx-auto px-6 pb-24">
        <div className="rounded-xl border border-border/60 bg-card/60 p-5">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground mb-3">
            <Code2 className="h-4 w-4" /> Ví dụ gọi API
          </div>
          <pre className="font-mono-vin text-xs sm:text-sm overflow-x-auto bg-background/60 rounded-lg p-4 border border-border/60">{`curl -X POST https://your-app.lovable.app/api/decode \\
  -H "X-Api-Key: vsk_..." \\
  -H "Content-Type: application/json" \\
  -d '{"vin":"5YJ3E1EA7KF317000"}'`}</pre>
        </div>
      </section>
    </main>
  );
}

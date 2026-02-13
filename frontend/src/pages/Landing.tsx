import { Link } from "react-router-dom";
import { 
  KeyRound, Shield, Lock, Eye, ArrowRight, Zap, 
  CheckCircle2, Circle, Globe, ShieldCheck, Github 
} from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";

// --- Data Structures ---

const features = [
  {
    icon: Shield,
    title: "Zero-Knowledge Encryption",
    description: "We never see your data. Your master password is the only key, and it never leaves your device.",
    color: "text-blue-400",
  },
  {
    icon: Zap,
    title: "Instant Synchronization",
    description: "Military-grade AES-256-GCM encryption protects your credentials across all your browsers.",
    color: "text-emerald-400",
  },
  {
    icon: Eye,
    title: "Privacy First",
    description: "No tracking. No analytics. No backdoors. Just pure, unadulterated security for your digital life.",
    color: "text-cyan-400",
  },
];

const roadmapItems = [
  { status: "completed", date: "Q1 2026", title: "Zero-Knowledge Core", desc: "Launched AES-256-GCM client-side encryption." },
  { status: "upcoming", date: "Q2 2026", title: "Hardware Key Support", desc: "Integrating YubiKey & Nitrokey for physical 2FA." },
  { status: "upcoming", date: "Q3 2026", title: "External Security Audit", desc: "Conducting a full open-source audit by Cure53." },
  { status: "upcoming", date: "Q4 2026", title: "GuptKey Sentinel", desc: "AI-driven dark web monitoring and leak alerts." },
];


// --- Components ---

const Landing = () => {
  const { scrollY } = useScroll();
  const yHero = useTransform(scrollY, [0, 500], [0, -100]);
  const rotateHero = useTransform(scrollY, [0, 500], [0, 5]);

  return (
    <div className="relative min-h-screen bg-[#020817] text-slate-50 overflow-x-hidden font-sans">
      
      {/* Background Layer */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,_rgba(59,130,246,0.05),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,_rgba(16,185,129,0.05),transparent_50%)]" />
        <div className="absolute inset-0 opacity-[0.15] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        </div>
      </div>

      {/* NAV */}
      <nav className="fixed top-0 w-full z-50 border-b border-slate-800/50 bg-slate-950/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.4)] transition-all">
              <KeyRound className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xl font-bold tracking-tighter">GuptKey</span>
          </Link>

          <div className="flex items-center gap-6">
            <Link to="/auth" className="text-sm font-medium text-slate-400 hover:text-white transition-colors hidden sm:block">Sign In</Link>
            <Link to="/auth?register=true" className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:shadow-[0_0_20px_-5px_rgba(59,130,246,0.6)] hover:scale-[1.02] active:scale-95 transition-all">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-40 pb-20 lg:pt-52 lg:pb-32 grid lg:grid-cols-2 gap-16 items-center">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold mb-6 tracking-wide uppercase">
            <ShieldCheck className="w-3.5 h-3.5" /> Military-Grade Protection
          </div>
          <h1 className="text-6xl lg:text-8xl font-black leading-[0.9] tracking-tighter mb-8 italic">
            Your Secrets. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400">Not Ours.</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-lg mb-10 leading-relaxed">
            A modern encrypted password vault built for privacy-first users. Zero-knowledge architecture. Client-side secure. Zero compromise.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/auth?register=true" className="px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-bold flex items-center justify-center gap-2 hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.5)] transition-all">
              Initialize Vault <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/dashboard" className="px-8 py-4 bg-slate-900/50 border border-slate-800 rounded-2xl font-bold hover:bg-slate-800/80 transition-all">Live Demo</Link>
          </div>
        </motion.div>

        <motion.div style={{ y: yHero, rotate: rotateHero }} className="relative hidden lg:block">
          <div className="relative z-10 p-1 bg-gradient-to-br from-slate-700 to-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-800">
            <div className="bg-[#020817] rounded-[2.3rem] p-8 border border-slate-800">
              <div className="flex justify-between items-center mb-8">
                <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-red-500/30" /><div className="w-3 h-3 rounded-full bg-amber-500/30" /><div className="w-3 h-3 rounded-full bg-emerald-500/30" /></div>
                <div className="h-6 w-24 bg-slate-900 rounded-md border border-slate-800" />
              </div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-slate-900/40 border border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-800" />
                      <div className="space-y-1.5"><div className="h-2 w-16 bg-slate-700 rounded" /><div className="h-2 w-24 bg-slate-800 rounded" /></div>
                    </div>
                    <Lock className="w-3 h-3 text-primary" />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="absolute -inset-10 bg-primary/10 blur-[100px] -z-10 animate-pulse" />
        </motion.div>
      </section>

      {/* FEATURES */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="p-8 rounded-3xl bg-slate-900/30 border border-slate-800/50 hover:border-primary/50 transition-all group">
              <div className={`w-12 h-12 rounded-xl bg-slate-950 flex items-center justify-center mb-6 border border-slate-800 ${feature.color}`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ROADMAP SECTION */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-32">
        <div className="text-center mb-16">
          <span className="text-primary font-mono text-xs tracking-[0.3em] uppercase mb-3 block">Engineering Log</span>
          <h2 className="text-4xl font-bold tracking-tight">The Security Roadmap</h2>
        </div>
        <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-800 before:to-transparent">
          {roadmapItems.map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
              className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border border-slate-800 bg-slate-950 z-10 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 ${item.status === 'completed' ? 'text-emerald-400 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : item.status === 'current' ? 'text-primary border-primary/50' : 'text-slate-600'}`}>
                {item.status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5 animate-pulse" />}
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl bg-slate-900/40 border border-slate-800/50 backdrop-blur-sm group-hover:border-slate-700 transition-colors">
                <span className="text-xs font-bold text-primary tracking-widest uppercase">{item.date}</span>
                <h3 className="text-lg font-bold mt-1 mb-1">{item.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      
     

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-slate-900 bg-slate-950 py-20">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2.5 mb-6">
              <KeyRound className="w-6 h-6 text-primary" />
              <span className="font-bold text-2xl tracking-tighter">GuptKey</span>
            </div>
            <p className="text-slate-500 text-sm max-w-xs leading-relaxed">
              The gold standard in zero-knowledge password management. Open-source, audited, and designed for absolute privacy.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6">Product</h4>
            <ul className="text-slate-500 text-sm space-y-4">
              <li><Link to="/auth" className="hover:text-primary transition-colors">Web Vault</Link></li>
              <li><a href="#" className="hover:text-primary transition-colors">Browser Extension</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Mobile App</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6">Security</h4>
            <ul className="text-slate-500 text-sm space-y-4">
              <li className="flex items-center gap-2"><Shield className="w-4 h-4" /> AES-256 GCM</li>
              <li className="flex items-center gap-2"><Globe className="w-4 h-4" /> Open Source</li>
              <li className="flex items-center gap-2"><Github className="w-4 h-4" /> Documentation</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-slate-900 text-center md:text-left text-slate-600 text-xs">
          © 2026 GuptKey Labs. All rights reserved. Your privacy, our priority.
        </div>
      </footer>
    </div>
  );
};

export default Landing;
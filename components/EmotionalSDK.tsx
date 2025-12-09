import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Zap, Shield, Sparkles, Layers, Calendar, Gamepad2, Headphones, HeartPulse, Bot, Car, Building2, X, Cpu, Smartphone, Terminal } from 'lucide-react';
import { SectionWrapper } from './SectionWrapper';

const industries = [
  { title: 'Social & Messaging', icon: Headphones, desc: 'Real-time sentiment in chats & voice rooms.' },
  { title: 'Gaming & Virtual Worlds', icon: Gamepad2, desc: 'Adaptive NPC emotion & player feedback.' },
  { title: 'Health & Wellness', icon: HeartPulse, desc: 'Mood-aware journaling & therapy companions.' },
  { title: 'Customer Support', icon: Bot, desc: 'Agent assist & routing by live emotion signal.' },
  { title: 'Education & Training', icon: Building2, desc: 'Responsive tutors that read learner state.' },
  { title: 'In-car / IoT', icon: Car, desc: 'Cabin mood sensing for safer, calmer journeys.' },
];

export const EmotionalSDK: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', company: '', useCase: '' });
  const [submitted, setSubmitted] = useState(false);
  const fullCode = useMemo(() => (
    "import 'package:insight_sdk/insight.dart';\n" +
    "\n" +
    "// Initialize local engine\n" +
    "await Insight.initialize(\n" +
    "  mode: ComputeMode.local,\n" +
    "  latency: Latency.ultraLow, // ~20ms\n" +
    ");\n" +
    "\n" +
    "// Stream real-time emotions\n" +
    "Insight.stream.listen((emotion) {\n" +
    "  print('Detected: ${emotion.label}');\n" +
    "});\n"
  ), []);

  const [typed, setTyped] = useState('');
  const [cursorVisible, setCursorVisible] = useState(true);

  useEffect(() => {
    let charIndex = 0;
    const typeInterval = setInterval(() => {
      charIndex += 1;
      if (charIndex > fullCode.length) {
        setTimeout(() => { setTyped(''); charIndex = 0; }, 800);
      } else {
        setTyped(fullCode.slice(0, charIndex));
      }
    }, 25);

    const cursorBlink = setInterval(() => setCursorVisible(v => !v), 500);

    return () => {
      clearInterval(typeInterval);
      clearInterval(cursorBlink);
    };
  }, [fullCode]);

  const CodeTyper: React.FC = () => (
    <div className="relative text-gray-200 whitespace-pre-wrap min-h-[240px]">
      {typed}
      <span className={`ml-0.5 ${cursorVisible ? 'opacity-100' : 'opacity-0'}`}>|</span>
    </div>
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setShowModal(false), 1200);
  };

  return (
    <SectionWrapper className="relative overflow-hidden bg-gradient-to-b from-[#06090f] via-[#05070d] to-[#04060a]">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -left-10 top-10 w-96 h-96 bg-tech-blue/10 blur-[140px]" />
        <div className="absolute right-0 bottom-0 w-[520px] h-[520px] bg-emerald-500/10 blur-[200px]" />
      </div>

      <div className="relative z-10 container mx-auto px-6 space-y-10">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 xl:gap-16 items-start min-h-[60vh]">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-white/10 rounded-full bg-white/5 backdrop-blur">
              <span className="w-2 h-2 rounded-full bg-tech-blue animate-pulse" />
              <span className="text-[11px] font-mono tracking-[0.2em] text-gray-300">DEVELOPERS</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white brightness-110 tracking-tight leading-tight">
              Build with the <span className="text-transparent bg-clip-text bg-gradient-to-r from-tech-blue via-white to-purple-400">Emotional SDK</span>
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed max-w-2xl">
              Empower your Flutter apps with human-level emotional intelligence. Runs fully on-device with ~20ms real-time inference, keeping user data private while detecting 7 emotions locally.
            </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: Smartphone, title: 'Flutter Native', desc: 'Seamless for iOS & Android with a single codebase.' },
                { icon: Shield, title: 'On-Device AI', desc: 'Privacy-first. No video leaves the device.' },
                { icon: Zap, title: '20ms Latency', desc: 'Optimized pipeline for interactive use cases.' },
                { icon: Sparkles, title: '7 Emotions', desc: 'Happy, Anger, Sad, Fear, Disgust, Surprise, Neutral.' },
              ].map((item, idx) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: idx * 0.05, duration: 0.4 }}
                  className="bg-[#0c111a] border border-white/10 rounded-lg p-4 flex items-start gap-3 shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
                >
                  <item.icon className="text-tech-blue" size={18} />
                  <div>
                    <div className="text-sm font-bold text-white brightness-110">{item.title}</div>
                    <div className="text-xs text-gray-400 mt-1 leading-relaxed">{item.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => setShowModal(true)}
                className="px-5 py-3 bg-tech-blue text-black font-mono text-xs tracking-wider rounded hover:shadow-[0_0_18px_rgba(0,243,255,0.35)] transition"
              >
                Book Demo
              </button>
              <a
                href="https://cal.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 border border-white/20 text-white font-mono text-xs tracking-wider rounded hover:border-tech-blue hover:text-tech-blue transition inline-flex items-center gap-2"
              >
                <Calendar size={14} /> Calendar
              </a>
            </div>
          </div>

          <div className="w-full">
            <div className="bg-[#0c111a] border border-white/10 rounded-2xl shadow-[0_25px_50px_rgba(0,0,0,0.45)] overflow-hidden min-h-[260px]">
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-black/60">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
                </div>
                <div className="text-[11px] text-gray-400 font-mono">Flutter / Dart</div>
              </div>
              <div className="p-5 font-mono text-[12px] leading-6 text-gray-200 bg-gradient-to-br from-[#0a0d14] via-[#0b121c] to-[#05070c] whitespace-pre relative">
                <motion.div
                  key="code-block"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-b from-white/2 via-transparent to-transparent pointer-events-none"
                />
                <CodeTyper />
              </div>
              <div className="px-4 py-3 border-t border-white/10 flex items-center justify-between text-[11px] text-gray-400 bg-black/50">
                <div className="flex items-center gap-2">
                  <Cpu size={12} /> SDK v2.1.0 Stable · For demo only
                </div>
                <div className="flex items-center gap-2 text-emerald-400">
                  <Terminal size={12} /> System Status: Live
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8 pt-10 md:pt-14 border-t border-white/10">
          <h3 className="text-2xl font-extrabold text-white brightness-110">Trusted Integrations</h3>
          <div className="flex flex-wrap gap-2 text-[11px] text-gray-300">
            {['Gaming NPCs', 'Mental Health', 'Live Streaming', 'EdTech', 'Social Apps', 'Market Research'].map(tag => (
              <span key={tag} className="px-3 py-1 rounded-full bg-white/5 border border-white/10">{tag}</span>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: 'SpotZero Anime Game',
                desc: 'Real-time empathetic voice dialogue to boost character affinity.',
                accent: 'from-[#30234f] to-[#192033]',
              },
              {
                title: 'OMO AI Companion',
                desc: 'Real-time emotion recognition to assist therapeutic healing.',
                accent: 'from-[#103229] to-[#0c1d1a]',
              },
            ].map((card, idx) => (
              <div
                key={card.title}
                className={`relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br ${card.accent} p-5 shadow-[0_20px_40px_rgba(0,0,0,0.35)]`}
              >
                <div className="absolute inset-0 pointer-events-none opacity-15" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, #fff 1px, transparent 0)', backgroundSize: '20px 20px' }} />
                <div className="flex items-center gap-2 text-emerald-300 text-[11px] font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> LIVE INTEGRATION
                </div>
                <h4 className="text-lg font-bold text-white brightness-110 mt-2">{card.title}</h4>
                <p className="text-sm text-gray-200 mt-2 leading-relaxed max-w-md">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="w-full max-w-lg bg-[#0c0f16] border border-white/10 rounded-lg p-6 relative shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-white"
              aria-label="Close"
            >
              <X size={16} />
            </button>
            <h3 className="text-xl font-bold text-white mb-2">Book a Demo</h3>
            <p className="text-sm text-gray-400 mb-4">Tell us about your app and we will reach out within 1 business day.</p>
            <form className="space-y-3" onSubmit={handleSubmit}>
              {[
                { key: 'name', placeholder: 'Your name' },
                { key: 'email', placeholder: 'Work email' },
                { key: 'company', placeholder: 'Company / Product' },
              ].map(field => (
                <input
                  key={field.key}
                  required
                  value={(form as any)[field.key]}
                  onChange={(e) => setForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                  placeholder={field.placeholder}
                  className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-tech-blue outline-none"
                />
              ))}
              <textarea
                value={form.useCase}
                onChange={(e) => setForm(prev => ({ ...prev, useCase: e.target.value }))}
                placeholder="Describe your use case (optional)"
                className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-tech-blue outline-none min-h-[90px]"
              />
              <div className="flex flex-wrap gap-3 items-center justify-between">
                <button
                  type="submit"
                  className="px-4 py-2 bg-tech-blue text-black font-mono text-xs tracking-wider rounded hover:shadow-[0_0_18px_rgba(0,243,255,0.35)] transition"
                >
                  {submitted ? 'Sent!' : 'Submit'}
                </button>
                <a
                  href="https://cal.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 border border-white/20 text-white font-mono text-xs tracking-wider rounded hover:border-tech-blue hover:text-tech-blue transition inline-flex items-center gap-2"
                >
                  <Calendar size={14} /> Calendar
                </a>
              </div>
            </form>
          </div>
        </div>
      )}
    </SectionWrapper>
  );
};

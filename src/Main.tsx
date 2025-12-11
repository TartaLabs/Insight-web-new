import React, { useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { ConnectButton } from '@rainbow-me/rainbowkit';

import { EmotionOrb } from './components/EmotionOrb';
import { TokenSystem } from './components/TokenSystem';
import { Menu } from './components/Menu';
import { EmotionShowcase } from './components/EmotionShowcase';
import { Workflow } from './components/Workflow';
import { Stats } from './components/Stats';
import { PlatformShowcase } from './components/PlatformShowcase';
import { Logo } from './components/Logo';
import { SectionWrapper } from './components/SectionWrapper';
import { GlobalScrollEffects } from './components/GlobalScrollEffects';
import { EmotionalSDK } from './components/EmotionalSDK';

// Secondary Pages
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { TermsOfUse } from './components/TermsOfUse';
import { Support } from './components/Support';

// Web App
import { WebApp } from './components/WebApp/WebApp';

export default function Main() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Navigation State: 'home' | 'privacy' | 'terms' | 'support' | 'webapp'
  const [currentView, setCurrentView] = useState('home');

  // Subscription State
  const [email, setEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [subscribeMsg, setSubscribeMsg] = useState('');

  const handleSubscribe = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      setSubscribeStatus('error');
      setSubscribeMsg('Please enter an email address.');
      return;
    }

    if (!emailRegex.test(email)) {
      setSubscribeStatus('error');
      setSubscribeMsg('Invalid email format. Please check and try again.');
      return;
    }

    // Success simulation
    setSubscribeStatus('success');
    setSubscribeMsg('Successfully subscribed to updates!');
    setEmail('');

    // Auto clear success message after 5 seconds
    setTimeout(() => {
      setSubscribeStatus('idle');
      setSubscribeMsg('');
    }, 5000);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const renderContent = () => {
    // Note: missionText was here for word-by-word animation but is now static inline

    if (currentView === 'privacy') return <PrivacyPolicy onBack={() => setCurrentView('home')} />;
    if (currentView === 'terms') return <TermsOfUse onBack={() => setCurrentView('home')} />;
    if (currentView === 'support') return <Support onBack={() => setCurrentView('home')} />;
    if (currentView === 'webapp') return <WebApp onExit={() => setCurrentView('home')} />;

    // Default: Home Page
    return (
      <>
        <motion.div
          className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-tech-blue via-white to-blue-500 origin-left z-50"
          style={{ scaleX }}
        />

        {/* Navigation */}
        <nav className="fixed top-4 inset-x-0 z-40 px-4 md:px-6 flex items-center justify-center pointer-events-none">
          <div className="pointer-events-auto flex items-center justify-between w-full max-w-2xl px-5 py-3 rounded-full bg-black border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.45)]">
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <Logo className="w-8 h-8 drop-shadow-[0_0_8px_rgba(0,243,255,0.35)]" />
              <span className="font-bold text-lg tracking-tighter text-white">INSIGHT</span>
            </div>
            <div className="hidden md:flex gap-6 text-xs font-mono tracking-widest text-gray-400">
              <button
                onClick={() => scrollToSection('vision')}
                className="hover:text-white transition-colors"
              >
                VISION
              </button>
              <button
                onClick={() => scrollToSection('platforms')}
                className="hover:text-tech-blue transition-colors"
              >
                APP
              </button>
            </div>
            {/* <button
              onClick={() => setCurrentView('webapp')}
              className="px-5 py-2 rounded-full bg-white text-black text-xs font-bold tracking-widest hover:bg-tech-blue transition-colors shadow-[0_0_12px_rgba(255,255,255,0.25)]"
            >
              LAUNCH APP
            </button> */}
            <ConnectButton />
          </div>
        </nav>

        {/* Hero Section */}
        <header className="relative min-h-[95vh] flex flex-col lg:flex-row items-center justify-center pt-20 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px]" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-tech-blue/5 rounded-full blur-[120px]" />
          </div>

          <div className="container mx-auto px-6 lg:px-8 xl:px-10 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-12 items-center h-full flex-1">
            <motion.div
              className="space-y-8 order-2 lg:order-1 relative z-20 py-12 lg:py-0"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: 'easeOut' }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 border border-white/10 rounded-full bg-white/5 backdrop-blur-md">
                <span className="w-2 h-2 bg-tech-blue rounded-full animate-pulse" />
                <span className="text-[10px] font-mono text-gray-300 tracking-wider">
                  POWERING EMOTION AI
                </span>
              </div>

              {/* Unified Typography Structure */}
              <h1 className="flex flex-col gap-2 md:gap-3 font-extrabold tracking-tight text-white brightness-110">
                <span className="text-5xl md:text-6xl lg:text-7xl leading-tight">
                  The Emotional Layer of
                </span>
                <span className="text-5xl md:text-6xl lg:text-7xl leading-tight text-gray-300">
                  Future AGI.
                </span>
              </h1>

              <p className="text-lg text-gray-400 max-w-lg md:max-w-2xl lg:max-w-3xl leading-relaxed">
                Insight labels the world's emotional data in a decentralized way and fuels{' '}
                <strong>AGI models</strong> to give AI true EQ.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <button
                  onClick={() => scrollToSection('platforms')}
                  className="px-8 py-4 bg-white text-black font-bold text-sm tracking-widest hover:bg-tech-blue hover:text-black transition-colors"
                >
                  START CONTRIBUTING
                </button>
                <button
                  onClick={() => scrollToSection('vision')}
                  className="px-8 py-4 border border-white/20 text-white font-bold text-sm tracking-widest hover:border-white transition-all"
                >
                  EXPLORE ECOSYSTEM
                </button>
              </div>
            </motion.div>

            <motion.div
              className="relative w-full h-[50vh] lg:h-[80vh] order-1 lg:order-2 flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5 }}
            >
              <EmotionOrb />
            </motion.div>
          </div>
        </header>

        {/* Mission Section - cleaner spacing + scroll reveal */}
        <SectionWrapper
          id="vision"
          className="relative overflow-hidden py-20 md:py-24 mt-12 md:mt-16"
        >
          <div className="container mx-auto px-6 lg:px-8 xl:px-10 max-w-screen-xl text-center space-y-5 relative">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-white/5 border border-white/10 rounded-full text-[12px] md:text-sm font-mono tracking-[0.25em] text-tech-blue mx-auto shadow-[0_0_15px_rgba(0,243,255,0.2)]">
              <span className="w-2 h-2 rounded-full bg-tech-blue shadow-[0_0_8px_rgba(0,243,255,0.7)]" />
              THE MISSION
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a0d14]/70 backdrop-blur-md px-6 md:px-10 py-10 md:py-12 shadow-[0_10px_40px_rgba(0,0,0,0.45)] w-full">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(0,243,255,0.08),transparent_60%)] pointer-events-none" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_60%,rgba(255,255,255,0.04),transparent_70%)] pointer-events-none" />
              <div className="absolute inset-x-10 top-2 h-px bg-gradient-to-r from-transparent via-tech-blue/40 to-transparent" />
              <div className="absolute inset-x-10 bottom-2 h-px bg-gradient-to-r from-transparent via-tech-blue/25 to-transparent" />
              <motion.div
                className="absolute inset-0 pointer-events-none opacity-20"
                initial={{ backgroundPositionY: 0 }}
                animate={{ backgroundPositionY: ['0%', '120%'] }}
                transition={{ repeat: Infinity, duration: 10, ease: 'linear' }}
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(180deg, rgba(0,243,255,0.12) 0, rgba(0,243,255,0.12) 1px, transparent 2px, transparent 6px)',
                }}
              />
              <div className="relative overflow-hidden rounded-xl">
                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="flex flex-wrap justify-center gap-x-1.5 gap-y-2 text-lg md:text-3xl font-semibold leading-relaxed text-gray-100 drop-shadow-[0_0_12px_rgba(0,243,255,0.2)]"
                >
                  "Intelligence without emotion is just calculation. We are building the{' '}
                  <motion.span
                    className="text-white font-extrabold underline decoration-tech-blue/70 underline-offset-4 drop-shadow-[0_0_12px_rgba(0,243,255,0.35)]"
                    animate={{ opacity: [0.8, 1, 0.8] }}
                    transition={{ repeat: Infinity, duration: 2.6, ease: 'easeInOut' }}
                  >
                    emotional dataset
                  </motion.span>{' '}
                  that will enable AI agents to empathize, understand, and interact with humanity on
                  a deeper level."
                </motion.p>
              </div>
            </div>
          </div>
        </SectionWrapper>

        {/* Platform Selection */}
        <SectionWrapper id="platforms" className="relative pt-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,243,255,0.05)_0%,transparent_50%)]" />
          <div className="container mx-auto px-6 lg:px-8 xl:px-10">
            <PlatformShowcase onLaunch={() => setCurrentView('webapp')} />
          </div>
        </SectionWrapper>

        {/* Main Content Modules */}
        <main className="relative z-20 space-y-0 bg-deep-bg">
          <SectionWrapper>
            <Stats />
          </SectionWrapper>

          <SectionWrapper>
            <Workflow />
          </SectionWrapper>

          <SectionWrapper>
            <EmotionShowcase />
          </SectionWrapper>
        </main>

        <SectionWrapper className="bg-[#08080c] relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1)_0%,transparent_70%)]" />
          <TokenSystem />
        </SectionWrapper>

        <SectionWrapper className="relative" id="sdk">
          <EmotionalSDK />
        </SectionWrapper>

        {/* Footer */}
        <footer className="bg-black border-t border-white/10 pt-12">
          <div className="container mx-auto px-6 xl:px-10 pb-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
              <div>
                <div className="flex items-center gap-3 mb-8">
                  <Logo className="w-12 h-12" />
                  <h3 className="text-4xl font-bold tracking-tighter text-white">INSIGHT</h3>
                </div>
                <p className="text-gray-400 max-w-sm">
                  Building the emotional infrastructure for AGI.
                </p>
              </div>
              <div className="flex flex-col justify-end">
                <div
                  className={`flex items-center bg-white/5 border-b ${
                    subscribeStatus === 'error'
                      ? 'border-red-500'
                      : subscribeStatus === 'success'
                        ? 'border-green-500'
                        : 'border-white/20'
                  } transition-colors duration-300 relative`}
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (subscribeStatus !== 'idle') setSubscribeStatus('idle');
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubscribe()}
                    placeholder="Enter your email for updates"
                    className="bg-transparent w-full px-6 py-4 focus:outline-none text-white placeholder-gray-600"
                  />
                  <button
                    onClick={handleSubscribe}
                    className="px-8 py-4 text-tech-blue font-mono text-sm hover:text-white transition-colors"
                  >
                    SUBSCRIBE
                  </button>
                </div>

                {/* Feedback Message */}
                <div className="h-6 mt-2">
                  {subscribeStatus !== 'idle' && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`text-xs font-mono ${subscribeStatus === 'success' ? 'text-green-400' : 'text-red-400'}`}
                    >
                      {subscribeMsg}
                    </motion.p>
                  )}
                </div>
              </div>
            </div>

            {/* Pass current view setter to Menu */}
            <Menu onNavigate={setCurrentView} />

            <div className="flex flex-col md:flex-row justify-between items-center pt-12 text-xs font-mono text-gray-600">
              <div>
                © 2025 Tarta Inc. Powered by{' '}
                <a
                  href="https://tartalabs.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-tech-blue hover:text-white transition-colors"
                >
                  Tarta Labs
                </a>
                .
              </div>
              <div className="flex gap-6 mt-4 md:mt-0">
                <a
                  href="https://x.com/Insight_Label"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-tech-blue transition-colors"
                >
                  TWITTER
                </a>
                <a
                  href="https://discord.gg/pfeaKXGkrK"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-tech-blue transition-colors"
                >
                  DISCORD
                </a>
              </div>
            </div>
          </div>
        </footer>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-deep-bg text-white font-sans overflow-x-hidden selection:bg-tech-blue selection:text-black">
      {currentView === 'home' && <GlobalScrollEffects />}
      {renderContent()}
    </div>
  );
}

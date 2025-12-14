import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Logo } from '../../components/Logo';

interface PageProps {
  onBack?: () => void;
}

export const PrivacyPolicyContent: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
  >
    <div className="w-16 h-16 bg-tech-blue/10 rounded-2xl flex items-center justify-center mb-8 border border-tech-blue/20">
      <Shield size={32} className="text-tech-blue" />
    </div>

    <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>

    <div className="bg-surface border border-white/10 p-6 rounded-xl mb-12 text-sm text-gray-400">
      <p>
        <strong className="text-white">Last Updated:</strong> November 28, 2025
      </p>
      <p>
        <strong className="text-white">Operator:</strong> Tarta Tech Limited (“Tarta”, “we”, “us”,
        “our”), registered in Hong Kong SAR.
      </p>
      <div className="mt-4 pt-4 border-t border-white/5">
        <p>
          This Privacy Policy explains how we collect, use, store, and protect your information when
          you use Insight on <strong>iOS, Android, or Web</strong>. Your use of Insight signifies
          your acceptance of this Policy.
        </p>
      </div>
    </div>

    <div className="space-y-12 text-gray-300 leading-relaxed">
      {/* Section 1 */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-tech-blue/10 text-tech-blue text-sm">
            1
          </span>
          Information We Collect
        </h2>

        <div className="space-y-6 pl-4 md:pl-11">
          <div>
            <h3 className="text-lg font-bold text-white mb-2">1.1 Account Information</h3>
            <p className="mb-2">Depending on your platform, we may collect:</p>
            <ul className="list-disc pl-5 space-y-1 mb-3 text-gray-400">
              <li>Email address</li>
              <li>Verification code</li>
              <li>Nickname or display name</li>
              <li>Region or language settings</li>
            </ul>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="bg-white/5 p-3 rounded border-l-2 border-tech-blue">
                <span className="block text-white font-bold mb-1">Mobile (iOS/Android)</span>
                Account is created via email + verification code using Sequence AA.
              </div>
              <div className="bg-white/5 p-3 rounded border-l-2 border-blue-400">
                <span className="block text-white font-bold mb-1">Web</span>
                Account is created via wallet login (Metamask, OKX Wallet, etc.).
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white mb-2">
              1.2 Facial Image Data (Voluntarily Provided)
            </h3>
            <p className="mb-2">When you participate in emotion labeling tasks, you may upload:</p>
            <ul className="list-disc pl-5 space-y-1 text-gray-400">
              <li>Selfies</li>
              <li>Photos containing your face</li>
              <li>Emotion responses or labels</li>
            </ul>
            <p className="mt-2 text-sm text-gray-500 italic">
              You provide this content voluntarily, and you may choose not to upload facial images.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white mb-2">1.3 Device & Usage Data</h3>
            <p className="mb-2">We automatically collect:</p>
            <ul className="list-disc pl-5 space-y-1 text-gray-400">
              <li>Device model</li>
              <li>OS version</li>
              <li>IP address</li>
              <li>App interactions and task completion data</li>
              <li>Crash logs and performance analytics</li>
              <li>Web browser information (for Web users)</li>
            </ul>
            <p className="mt-2 text-sm text-gray-500">
              We use standard analytics and diagnostic tools.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white mb-2">1.4 Blockchain & Wallet Data</h3>
            <div className="space-y-4">
              <div>
                <span className="text-white font-bold block">Mobile (iOS/Android)</span>
                <p className="text-gray-400 text-sm">
                  A Sequence AA smart account is automatically generated on Arbitrum to store your
                  reward balance ($aEMO).
                </p>
              </div>
              <div>
                <span className="text-white font-bold block">Web</span>
                <p className="text-gray-400 text-sm mb-2">
                  You log in using your blockchain wallet on Mantle (e.g., Metamask or OKX). We
                  collect:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-gray-400 text-sm">
                  <li>Public wallet address</li>
                  <li>On-chain activity related to Insight tasks</li>
                  <li>Reward balances ($mEMO)</li>
                </ul>
              </div>
              <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg">
                <h4 className="text-red-400 text-xs font-bold uppercase tracking-wider mb-2">
                  Important Note
                </h4>
                <p className="text-sm text-gray-300 mb-1">Blockchain records are:</p>
                <ul className="list-disc pl-5 space-y-1 text-gray-400 text-sm">
                  <li>Public</li>
                  <li>Immutable</li>
                  <li>Beyond our ability to modify, censor, delete, or hide</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2 */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-tech-blue/10 text-tech-blue text-sm">
            2
          </span>
          How We Use Your Information
        </h2>
        <div className="pl-4 md:pl-11">
          <p className="mb-3">We use your data to:</p>
          <ul className="list-disc pl-5 space-y-2 text-gray-400 mb-6">
            <li>Provide core features of Insight</li>
            <li>Allow emotion data labeling and AI model testing</li>
            <li>Improve and train our multi-modal emotion AI model</li>
            <li>Verify reward eligibility ($aEMO/$mEMO)</li>
            <li>Maintain fraud prevention and security</li>
            <li>Communicate updates, support, or important notices</li>
            <li>Improve user experience and product performance</li>
          </ul>
          <div className="inline-block px-4 py-2 bg-white/10 rounded font-bold text-white">
            We do not sell user data.
          </div>
        </div>
      </section>

      {/* Section 3 */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-tech-blue/10 text-tech-blue text-sm">
            3
          </span>
          Data Retention
        </h2>
        <div className="pl-4 md:pl-11">
          <ul className="list-disc pl-5 space-y-2 text-gray-400">
            <li>
              Uploaded photos and labeling data may be retained for AI research or model
              improvement.
            </li>
            <li>Personal data may be deleted upon request (Section 7).</li>
            <li>Anonymized or aggregated data may be stored indefinitely.</li>
            <li>Blockchain data cannot be deleted or altered.</li>
          </ul>
        </div>
      </section>

      {/* Section 4 */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-tech-blue/10 text-tech-blue text-sm">
            4
          </span>
          Data Sharing
        </h2>
        <div className="pl-4 md:pl-11 space-y-6">
          <div>
            <p className="mb-2">We may share limited data with:</p>
            <h3 className="text-lg font-bold text-white mb-2">4.1 Service Providers</h3>
            <ul className="list-disc pl-5 space-y-1 text-gray-400 mb-2">
              <li>Cloud storage</li>
              <li>Analytics tools</li>
              <li>Blockchain infrastructure providers</li>
              <li>Customer support services</li>
            </ul>
            <p className="text-sm text-gray-500">Only the minimum necessary data is shared.</p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white mb-2">
              4.2 Research & Development Partners
            </h3>
            <p className="text-gray-400">
              Only <strong>anonymized</strong> or <strong>aggregated</strong> datasets may be
              shared.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white mb-2">4.3 Legal Compliance</h3>
            <p className="text-gray-400 mb-2">We may disclose information if required by:</p>
            <ul className="list-disc pl-5 space-y-1 text-gray-400">
              <li>Law</li>
              <li>Regulation</li>
              <li>Court order</li>
              <li>Government authority</li>
            </ul>
            <p className="mt-2 text-white font-bold">
              We never sell data to advertisers or brokers.
            </p>
          </div>
        </div>
      </section>

      {/* Section 5 */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-tech-blue/10 text-tech-blue text-sm">
            5
          </span>
          Cookies & Tracking Technologies (Web)
        </h2>
        <div className="pl-4 md:pl-11">
          <p className="mb-2">Insight Web uses cookies for:</p>
          <ul className="list-disc pl-5 space-y-1 text-gray-400 mb-4">
            <li>Login session management</li>
            <li>Language preferences</li>
            <li>Analytics and performance monitoring</li>
          </ul>
          <p className="text-gray-400">You may disable cookies in your browser settings.</p>
        </div>
      </section>

      {/* Section 6 */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-tech-blue/10 text-tech-blue text-sm">
            6
          </span>
          Blockchain-Specific Disclosures
        </h2>
        <div className="pl-4 md:pl-11">
          <ul className="list-disc pl-5 space-y-2 text-gray-400 mb-4">
            <li>
              Public blockchains store wallet addresses and certain on-chain records permanently.
            </li>
            <li>Tarta cannot erase, modify, or mask historical blockchain data.</li>
            <li>Anyone may view blockchain records using public explorers.</li>
          </ul>
          <p className="text-white italic">
            Your use of Insight signifies acceptance of blockchain transparency requirements.
          </p>
        </div>
      </section>

      {/* Section 7 */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-tech-blue/10 text-tech-blue text-sm">
            7
          </span>
          Your Rights
        </h2>
        <div className="pl-4 md:pl-11">
          <p className="mb-3">You may contact us to request:</p>
          <ul className="list-disc pl-5 space-y-2 text-gray-400 mb-4">
            <li>Access to your personal data</li>
            <li>Correction of inaccurate data</li>
            <li>Deletion of your Insight account</li>
            <li>Withdrawal of consent (where applicable)</li>
          </ul>
          <div className="bg-white/5 p-4 rounded border border-white/10">
            <p className="mb-2">
              <strong>Contact:</strong>{' '}
              <span className="text-tech-blue">official@tartalabs.io</span>
            </p>
            <p className="text-sm text-gray-400">
              Account deletion happens inside the app (mobile) or via instructions provided for Web
              users.
            </p>
          </div>
        </div>
      </section>

      {/* Section 8 */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-tech-blue/10 text-tech-blue text-sm">
            8
          </span>
          Children’s Privacy
        </h2>
        <div className="pl-4 md:pl-11 text-gray-400">
          <p className="mb-2">
            Insight is <strong>not intended for children under the legal minimum age</strong> in
            your region.
          </p>
          <p>
            We do not knowingly collect data from children without legal guardian consent when
            required.
          </p>
        </div>
      </section>

      {/* Section 9 */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-tech-blue/10 text-tech-blue text-sm">
            9
          </span>
          Data Security
        </h2>
        <div className="pl-4 md:pl-11">
          <p className="mb-2">We use industry-standard measures:</p>
          <ul className="list-disc pl-5 space-y-1 text-gray-400 mb-4">
            <li>Encrypted storage</li>
            <li>Secure communication (HTTPS)</li>
            <li>Access control and authorization</li>
            <li>Regular security audits</li>
          </ul>
          <p className="text-gray-400">
            No method of transmission is 100% secure, but we take all reasonable steps to protect
            your data.
          </p>
        </div>
      </section>

      {/* Section 10 */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-tech-blue/10 text-tech-blue text-sm">
            10
          </span>
          International Data Transfers
        </h2>
        <div className="pl-4 md:pl-11">
          <p className="mb-2">Your data may be processed in:</p>
          <ul className="list-disc pl-5 space-y-1 text-gray-400 mb-4">
            <li>Hong Kong</li>
            <li>Singapore</li>
            <li>United States</li>
            <li>EU</li>
            <li>Or other jurisdictions where our providers operate</li>
          </ul>
          <p className="text-gray-400">We use appropriate safeguards as required by law.</p>
        </div>
      </section>

      {/* Section 11 */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-tech-blue/10 text-tech-blue text-sm">
            11
          </span>
          Changes to This Policy
        </h2>
        <div className="pl-4 md:pl-11 text-gray-400">
          <p className="mb-2">
            We may update this Privacy Policy to reflect product or regulatory changes.
          </p>
          <p>Updates will be posted in the App and/or on our website.</p>
        </div>
      </section>

      {/* Section 12 */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-tech-blue/10 text-tech-blue text-sm">
            12
          </span>
          Contact Us
        </h2>
        <div className="pl-4 md:pl-11">
          <p className="mb-4 text-gray-400">If you have any privacy questions:</p>
          <div className="bg-surface border border-white/10 p-6 rounded-xl">
            <p className="text-xl font-bold text-tech-blue mb-2">official@tartalabs.io</p>
            <p className="text-gray-400">
              Please include the subject line:{' '}
              <strong className="text-white">“Privacy Inquiry — Insight”</strong>
            </p>
          </div>
        </div>
      </section>
    </div>
  </motion.div>
);

export const PrivacyPolicy: React.FC<PageProps> = ({ onBack }) => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-deep-bg text-white pt-24 pb-20 px-6">
      <nav className="fixed top-0 left-0 w-full bg-deep-bg/90 backdrop-blur-md border-b border-white/5 z-50 px-6 py-4 flex items-center justify-between">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-sm font-mono text-gray-400 hover:text-tech-blue transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          BACK TO INSIGHT
        </button>
        <Logo className="w-6 h-6" />
      </nav>

      <div className="max-w-4xl mx-auto">
        <PrivacyPolicyContent />
      </div>
    </div>
  );
};

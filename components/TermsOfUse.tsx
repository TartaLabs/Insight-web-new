import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText } from 'lucide-react';
import { Logo } from './Logo';

interface PageProps {
  onBack: () => void;
}

export const TermsOfUseContent: React.FC = () => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
  >
    <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-8 border border-white/20">
       <FileText size={32} className="text-white" />
    </div>
    
    <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Use</h1>
    
    <div className="bg-surface border border-white/10 p-6 rounded-xl mb-12 text-sm text-gray-400">
       <p><strong className="text-white">Last Updated:</strong> November 28, 2025</p>
       <p><strong className="text-white">Operator:</strong> Tarta Tech Limited (“Tarta”, “we”, “us”, or “our”), a company registered in Hong Kong SAR.</p>
       <div className="mt-4 pt-4 border-t border-white/5">
          <p>Welcome to Insight (“Insight”, “the App”, or “the Service”). Insight is available on <strong>iOS, Android, and Web</strong>, enabling users to label emotional data, participate in AI model testing, and earn on-chain reward tokens.</p>
          <p className="mt-2">By creating an account or using Insight on any platform, you agree to these Terms of Use & End-User License Agreement (“Terms”).</p>
          <p className="mt-2 font-bold text-white">If you do not agree, please stop using Insight.</p>
       </div>
    </div>

    <div className="space-y-12 text-gray-300 leading-relaxed">
      
      {/* 1. Eligibility */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-white text-sm">1</span>
          Eligibility
        </h2>
        <div className="pl-4 md:pl-11">
           <p className="mb-2">You may use Insight if:</p>
           <ul className="list-disc pl-5 space-y-1 text-gray-400 mb-4">
              <li>You have the legal capacity to enter into this agreement under the laws of your region; <strong>or</strong></li>
              <li>If you are a minor, your parent or legal guardian has reviewed and accepted these Terms and allows your use (where required by local law).</li>
           </ul>
           <p className="mb-2">By using Insight, you represent that:</p>
           <ul className="list-disc pl-5 space-y-1 text-gray-400">
              <li>Your use does not violate local laws or platform rules (including Apple App Store / Google Play policies);</li>
              <li>You are not subject to any sanctions or restrictions that prohibit use of the Service.</li>
           </ul>
        </div>
      </section>

      {/* 2. Services */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-white text-sm">2</span>
          Services
        </h2>
        <div className="pl-4 md:pl-11 space-y-6">
           <p>Insight provides the following features:</p>
           <div>
              <h3 className="text-lg font-bold text-white mb-2">2.1 Emotion Data Collection & Labeling</h3>
              <p className="text-gray-400">Upload images or selfies and select corresponding emotion labels (Happy, Anger, Sad, Fear, Disgust, Surprise, Neutral).</p>
           </div>
           <div>
              <h3 className="text-lg font-bold text-white mb-2">2.2 AI Model Testing</h3>
              <p className="text-gray-400">Participate in tasks that improve our multi-modal emotion recognition model.</p>
           </div>
           <div>
              <h3 className="text-lg font-bold text-white mb-2">2.3 On-Chain Reward System</h3>
              <p className="mb-2">Insight uses <strong>non-transferable</strong> blockchain reward tokens:</p>
              <ul className="list-disc pl-5 space-y-1 text-gray-400">
                <li><strong>iOS / Android (Sequence AA, BNB Chain):</strong> $bEMO</li>
                 <li><strong>Web (Metamask / OKX, Mantle chain):</strong> $mEMO</li>
              </ul>
           </div>
           <div>
              <h3 className="text-lg font-bold text-white mb-2">2.4 Subscriptions (“Pro Plans”)</h3>
              <p className="mb-2">Optional paid subscriptions offering:</p>
              <ul className="list-disc pl-5 space-y-1 text-gray-400 mb-2">
                 <li>Higher daily task limits</li>
                 <li>Ad-free experience</li>
                 <li>Bonus / accelerated rewards</li>
                 <li>Early access features</li>
              </ul>
              <p className="text-sm text-gray-500">Subscriptions differ across platforms depending on purchase method. We may modify or update features at any time.</p>
           </div>
        </div>
      </section>

      {/* 3. Accounts & Login Methods */}
      <section>
         <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
           <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-white text-sm">3</span>
           Accounts & Login Methods
         </h2>
         <div className="pl-4 md:pl-11 space-y-6">
            <div>
               <h3 className="text-lg font-bold text-white mb-2">3.1 iOS & Android (Mobile App)</h3>
               <p className="mb-2">Mobile users register using:</p>
               <ul className="list-disc pl-5 space-y-1 text-gray-400 mb-2">
                  <li>Email + verification code</li>
                  <li>Sequence AA account (automatically created)</li>
                  <li>Shared identity across iOS & Android</li>
               </ul>
              <p className="text-gray-300">Reward tracking wallet: <strong>Sequence Smart Account on BNB Chain.</strong></p>
            </div>
            <div>
               <h3 className="text-lg font-bold text-white mb-2">3.2 Web Version</h3>
               <p className="mb-2">Web users use a <strong>separate account system</strong> with:</p>
               <ul className="list-disc pl-5 space-y-1 text-gray-400 mb-2">
                  <li>Metamask</li>
                  <li>OKX Wallet</li>
                  <li>Other EVM-compatible wallets</li>
               </ul>
               <p className="text-gray-300 mb-1">Rewards are issued on <strong>Mantle chain</strong>.</p>
               <p className="text-gray-300 font-bold">Mobile and Web accounts are not currently linked.</p>
            </div>
            <div>
               <h3 className="text-lg font-bold text-white mb-2">3.3 Account Security</h3>
               <p className="mb-1">You are responsible for:</p>
               <ul className="list-disc pl-5 space-y-1 text-gray-400 mb-2">
                  <li>Protecting login credentials</li>
                  <li>All actions under your account</li>
               </ul>
               <p className="text-gray-400">Report unauthorized access to <span className="text-white">official@tartalabs.io</span>.</p>
            </div>
            <div>
               <h3 className="text-lg font-bold text-white mb-2">3.4 Account Deletion</h3>
               <p className="mb-2">You may delete your account in-app at any time.</p>
               <p className="mb-1">Deletion is:</p>
               <ul className="list-disc pl-5 space-y-1 text-gray-400">
                  <li>Permanent and irreversible</li>
                  <li>Cannot restore the account</li>
                  <li>Personal data will be deleted or anonymized per law</li>
                  <li>Unclaimed rewards and eligibility may be forfeited</li>
               </ul>
            </div>
         </div>
      </section>

      {/* 4. Subscriptions & Payments */}
      <section>
         <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
           <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-white text-sm">4</span>
           Subscriptions & Payments
         </h2>
         <div className="pl-4 md:pl-11 space-y-6">
            <div>
               <h3 className="text-lg font-bold text-white mb-2">4.1 Payment Methods by Platform</h3>
               <ul className="list-disc pl-5 space-y-1 text-gray-400 mb-2">
                  <li><strong>iOS (Apple)</strong> → Apple In-App Purchase (fiat)</li>
                  <li><strong>Android (Google Play)</strong> → Google Play Billing (fiat)</li>
                  <li><strong>Web</strong> → On-chain crypto payments on Mantle (wallet transfer)</li>
               </ul>
               <p className="text-gray-400">We do <strong>not</strong> support third-party payment channels.</p>
            </div>
            <div>
               <h3 className="text-lg font-bold text-white mb-2">4.2 Auto-Renewing Subscriptions (iOS & Android)</h3>
               <p className="mb-2">Before purchasing, we display:</p>
               <ul className="list-disc pl-5 space-y-1 text-gray-400 mb-2">
                  <li>Subscription title</li>
                  <li>Duration (Monthly / Quarterly / Yearly)</li>
                  <li>Price</li>
                  <li>Links to Privacy Policy & Terms of Use</li>
               </ul>
               <p className="text-gray-400">Subscriptions renew automatically unless canceled 24h before renewal.</p>
            </div>
            <div>
               <h3 className="text-lg font-bold text-white mb-2">4.3 Managing & Canceling Subscriptions</h3>
               <ul className="list-disc pl-5 space-y-1 text-gray-400">
                  <li><strong>iOS:</strong> Apple ID → Subscriptions</li>
                  <li><strong>Android:</strong> Google Play → Payments & subscriptions</li>
                  <li><strong>Web:</strong> Wallet-based billing panel</li>
               </ul>
            </div>
            <div>
               <h3 className="text-lg font-bold text-white mb-2">4.4 Refunds</h3>
               <p className="mb-2">Purchases are generally non-refundable except where required by law or Apple/Google policy.</p>
               <p className="mb-1">If Apple refunds a purchase:</p>
               <ul className="list-disc pl-5 space-y-1 text-gray-400">
                  <li>Apple only refunds the subscription price</li>
                  <li>All other claims remain our responsibility</li>
               </ul>
            </div>
         </div>
      </section>

      {/* 5. Rewards */}
      <section>
         <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
           <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-white text-sm">5</span>
          Rewards: $bEMO & $mEMO
         </h2>
         <div className="pl-4 md:pl-11 space-y-6">
            <div>
               <h3 className="text-lg font-bold text-white mb-2">5.1 Reward Tokens</h3>
               <p className="mb-2">Insight rewards users with <strong>non-transferable participation tokens</strong>:</p>
               <ul className="list-disc pl-5 space-y-1 text-gray-400 mb-2">
                 <li><strong>$bEMO on BNB Chain</strong> (iOS & Android)</li>
                  <li><strong>$mEMO on Mantle</strong> (Web)</li>
               </ul>
               <p className="mb-1">These tokens:</p>
               <ul className="list-disc pl-5 space-y-1 text-gray-400">
                  <li>Cannot be traded</li>
                  <li>Cannot be sold</li>
                  <li>Cannot be transferred</li>
                  <li>Are not securities or investment products</li>
                  <li>Represent task contribution points only</li>
               </ul>
            </div>
            <div>
               <h3 className="text-lg font-bold text-white mb-2">5.2 No Cash-Out</h3>
               <p className="mb-1">Insight does <strong>not</strong> provide:</p>
               <ul className="list-disc pl-5 space-y-1 text-gray-400">
                  <li>Cash redemption</li>
                  <li>Crypto withdrawal</li>
                  <li>Stablecoin swap</li>
               </ul>
            </div>
            <div>
               <h3 className="text-lg font-bold text-white mb-2">5.3 Future Airdrops / Programs</h3>
               <p className="mb-1">We may optionally introduce programs referencing your token balance, but:</p>
               <ul className="list-disc pl-5 space-y-1 text-gray-400">
                  <li>They are <strong>not guaranteed</strong></li>
                  <li>Rules may change or be canceled</li>
                  <li>Participation is optional</li>
               </ul>
            </div>
            <div>
               <h3 className="text-lg font-bold text-white mb-2">5.4 Fraud Prevention</h3>
               <p className="mb-1">We may review or reverse rewards for:</p>
               <ul className="list-disc pl-5 space-y-1 text-gray-400">
                  <li>Low-quality or incorrect labeling</li>
                  <li>Bots or automated uploads</li>
                  <li>Multi-account farming</li>
                  <li>Attempts to exploit system loopholes</li>
               </ul>
            </div>
         </div>
      </section>

      {/* 6. User Content & Data Use */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-white text-sm">6</span>
          User Content & Data Use
        </h2>
        <div className="pl-4 md:pl-11">
           <p className="mb-2">By uploading any content (images, text, labels), you confirm:</p>
           <ul className="list-disc pl-5 space-y-1 text-gray-400 mb-4">
              <li>You own the content or have rights to upload it</li>
              <li>It does not violate others’ rights</li>
           </ul>
           <p className="mb-2">You grant Tarta Tech Limited a worldwide, royalty-free license to:</p>
           <ul className="list-disc pl-5 space-y-1 text-gray-400 mb-4">
              <li>Use your data for AI model training</li>
              <li>Research and evaluation</li>
              <li>Anonymized or aggregated sharing with partners</li>
           </ul>
           <p className="text-white">Personal data is handled per the <strong>Insight Privacy Policy</strong>.</p>
        </div>
      </section>

      {/* 7. Prohibited Conduct */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-white text-sm">7</span>
          Prohibited Conduct
        </h2>
        <div className="pl-4 md:pl-11">
           <p className="mb-2">You agree <strong>not</strong> to:</p>
           <ul className="list-disc pl-5 space-y-1 text-gray-400">
              <li>Upload illegal, hateful, pornographic, violent, or harmful content</li>
              <li>Upload deepfakes, stolen images, or misleading data</li>
              <li>Manipulate tasks, rewards, or leaderboards</li>
              <li>Reverse engineer or tamper with the App</li>
              <li>Attempt unauthorized access to Insight or other users’ data</li>
              <li>Use Insight in violation of platform rules or laws</li>
           </ul>
        </div>
      </section>

      {/* 8. Intellectual Property */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-white text-sm">8</span>
          Intellectual Property
        </h2>
        <div className="pl-4 md:pl-11">
           <p className="text-gray-400 mb-2">All IP related to Insight—including the AI models, code, design, content, text, and trademarks—belongs to Tarta Tech Limited.</p>
           <p className="text-gray-400">You receive a <strong>personal, non-exclusive, non-transferable license</strong> to use the App.</p>
        </div>
      </section>

      {/* 9. Termination */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-white text-sm">9</span>
          Termination
        </h2>
        <div className="pl-4 md:pl-11">
           <p className="mb-1">We may suspend or terminate accounts if:</p>
           <ul className="list-disc pl-5 space-y-1 text-gray-400 mb-4">
              <li>Terms are violated</li>
              <li>Fraud is detected</li>
              <li>Service must be discontinued for legal or operational reasons</li>
           </ul>
           <p className="mb-1">Upon termination:</p>
           <ul className="list-disc pl-5 space-y-1 text-gray-400">
              <li>Access stops immediately</li>
              <li>Unclaimed rewards may be forfeited</li>
              <li>Data may be anonymized or retained as allowed by law</li>
           </ul>
        </div>
      </section>

      {/* 10. Disclaimers */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-white text-sm">10</span>
          Disclaimers
        </h2>
        <div className="pl-4 md:pl-11">
           <p className="mb-1">Insight is:</p>
           <ul className="list-disc pl-5 space-y-1 text-gray-400 mb-4">
              <li><strong>Not</strong> a medical or psychological diagnostic tool</li>
              <li><strong>Not</strong> financial or investment advice</li>
              <li>Provided <strong>AS IS</strong> without warranties</li>
           </ul>
           <p className="mb-1">We do not guarantee:</p>
           <ul className="list-disc pl-5 space-y-1 text-gray-400">
              <li>Uninterrupted availability</li>
              <li>Accuracy of AI results</li>
              <li>Error-free operation</li>
           </ul>
        </div>
      </section>

      {/* 11. Limitation of Liability */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-white text-sm">11</span>
          Limitation of Liability
        </h2>
        <div className="pl-4 md:pl-11">
           <p className="mb-2">To the maximum extent permitted by law:</p>
           <ul className="list-disc pl-5 space-y-1 text-gray-400 mb-2">
              <li>We are <strong>not liable</strong> for indirect, incidental, or consequential damages</li>
              <li>Our total liability shall not exceed <strong>USD $50</strong></li>
           </ul>
           <p className="text-gray-500 text-sm">Some jurisdictions may not allow this limitation.</p>
        </div>
      </section>

      {/* 12. Legal Compliance & Sanctions */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-white text-sm">12</span>
          Legal Compliance & Sanctions
        </h2>
        <div className="pl-4 md:pl-11">
           <p className="mb-1">You confirm you are <strong>not</strong>:</p>
           <ul className="list-disc pl-5 space-y-1 text-gray-400 mb-2">
              <li>In a sanctioned country</li>
              <li>On a restricted party list</li>
           </ul>
           <p className="text-gray-400">You agree not to violate export control laws.</p>
        </div>
      </section>

       {/* 13. Third-Party Services */}
       <section>
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-white text-sm">13</span>
          Third-Party Services
        </h2>
        <div className="pl-4 md:pl-11">
           <p className="mb-1">Insight integrates with:</p>
           <ul className="list-disc pl-5 space-y-1 text-gray-400 mb-2">
              <li>Apple</li>
              <li>Google</li>
              <li>Sequence</li>
              <li>Mantle & BNB Chain blockchains</li>
              <li>Analytics providers</li>
           </ul>
           <p className="text-gray-400 mb-2">Their terms also apply.</p>
           <p className="text-gray-400">We are not responsible for third-party service failures or behavior.</p>
        </div>
      </section>

      {/* 14. Governing Law */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-white text-sm">14</span>
          Governing Law
        </h2>
        <div className="pl-4 md:pl-11">
           <p className="text-gray-400 mb-2">These Terms are governed by <strong>Hong Kong SAR law</strong>.</p>
           <p className="text-gray-400">Disputes will be submitted to the courts of Hong Kong SAR unless local law requires otherwise.</p>
        </div>
      </section>

      {/* 15. Changes to Terms */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-white text-sm">15</span>
          Changes to Terms
        </h2>
        <div className="pl-4 md:pl-11">
           <p className="text-gray-400 mb-2">We may update these Terms at any time.</p>
           <p className="text-gray-400">Using the App after changes means you accept the updated Terms.</p>
        </div>
      </section>

       {/* 16. Additional iOS Terms */}
       <section className="bg-white/5 border border-white/10 p-8 rounded-xl">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-white text-sm">16</span>
          Additional iOS Terms (Apple-Required EULA)
        </h2>
        <div className="pl-0 md:pl-4 space-y-6">
           <p className="text-sm text-gray-400 italic mb-4">This section applies only to iOS users.</p>
           
           <div>
              <h3 className="text-lg font-bold text-white mb-2">16.1 Agreement with Tarta, Not Apple</h3>
              <p className="text-gray-400">This EULA is between you and Tarta Tech Limited only. Apple is not responsible for Insight.</p>
           </div>
           <div>
              <h3 className="text-lg font-bold text-white mb-2">16.2 iOS License</h3>
              <p className="text-gray-400">You receive a non-transferable license to use Insight on Apple devices, per the Apple Media Services Terms.</p>
           </div>
           <div>
              <h3 className="text-lg font-bold text-white mb-2">16.3 Support</h3>
              <p className="text-gray-400">Tarta Tech Limited, not Apple, is responsible for support and maintenance.</p>
           </div>
           <div>
              <h3 className="text-lg font-bold text-white mb-2">16.4 Warranty</h3>
              <p className="mb-1 text-gray-400">If the App fails to conform to any warranty:</p>
              <ul className="list-disc pl-5 space-y-1 text-gray-400">
                 <li>You may notify Apple</li>
                 <li>Apple may refund the purchase price (if applicable)</li>
              </ul>
              <p className="mt-1 text-gray-400">Apple has no further warranty obligations.</p>
           </div>
           <div>
              <h3 className="text-lg font-bold text-white mb-2">16.5 Product Claims</h3>
              <p className="mb-1 text-gray-400">Tarta, not Apple, is responsible for:</p>
              <ul className="list-disc pl-5 space-y-1 text-gray-400">
                 <li>Legal compliance</li>
                 <li>Product liability</li>
                 <li>Consumer protection issues</li>
                 <li>Data privacy issues</li>
              </ul>
           </div>
           <div>
              <h3 className="text-lg font-bold text-white mb-2">16.6 IP Infringement</h3>
              <p className="text-gray-400">Tarta handles all intellectual-property disputes.</p>
           </div>
           <div>
              <h3 className="text-lg font-bold text-white mb-2">16.7 Export & Sanctions Compliance</h3>
              <p className="text-gray-400">You confirm you are not in a sanctioned region or on any prohibited list.</p>
           </div>
           <div>
              <h3 className="text-lg font-bold text-white mb-2">16.8 Developer Contact</h3>
              <p className="text-gray-400">Tarta Tech Limited<br/>Hong Kong SAR<br/>Email: <strong className="text-white">official@tartalabs.io</strong></p>
           </div>
           <div>
              <h3 className="text-lg font-bold text-white mb-2">16.9 Third-Party Terms</h3>
              <p className="text-gray-400">You must comply with the terms of your wireless provider and other third-party agreements.</p>
           </div>
           <div>
              <h3 className="text-lg font-bold text-white mb-2">16.10 Third-Party Beneficiary</h3>
              <p className="text-gray-400">Apple is a third-party beneficiary of this EULA.</p>
           </div>
        </div>
      </section>

    </div>
  </motion.div>
);

export const TermsOfUse: React.FC<PageProps> = ({ onBack }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-deep-bg text-white pt-24 pb-20 px-6">
      <nav className="fixed top-0 left-0 w-full bg-deep-bg/90 backdrop-blur-md border-b border-white/5 z-50 px-6 py-4 flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-mono text-gray-400 hover:text-tech-blue transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          BACK TO INSIGHT
        </button>
        <Logo className="w-6 h-6" />
      </nav>

      <div className="max-w-4xl mx-auto">
        <TermsOfUseContent />
      </div>
    </div>
  );
};

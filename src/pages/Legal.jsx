import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Shield, FileText, ArrowLeft, Lock, Scale, Layers, ShieldCheck } from 'lucide-react';
import Button from '@/components/ui/Button';
import { cn } from '@/utils/cn';
import Seo from '@/components/seo/Seo';

// --- ROBUST DOCUMENT DATA ---
const LEGAL_DATA = {
  'terms-of-service': {
    title: 'Terms of Service',
    icon: Scale,
    updated: 'February 10, 2026',
    description: 'The rules and guidelines for using SuperApp.',
    sections: [
      {
        heading: '1. Acceptance of Terms',
        content: [
          'By accessing and using SuperApp, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use this service.'
        ]
      },
      {
        heading: '2. Use License',
        content: [
          'Permission is granted to temporarily use SuperApp for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title. Under this license you may not:'
        ],
        list: [
          'Modify or copy the underlying codebase without permission.',
          'Attempt to decompile or reverse engineer any software contained in SuperApp.',
          'Use the platform for any illegal or unauthorized purpose.'
        ]
      },
      {
        heading: '3. Account Responsibilities',
        content: [
          'If you create an account on SuperApp, you are responsible for maintaining the security of your account and you are fully responsible for all activities that occur under the account. You must immediately notify us of any unauthorized uses of your account.'
        ]
      },
      {
        heading: '4. Limitations',
        content: [
          'In no event shall SuperApp or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on SuperApp.'
        ]
      }
    ]
  },
  'privacy-policy': {
    title: 'Privacy Policy',
    icon: Lock,
    updated: 'February 15, 2026',
    description: 'How we collect, use, and protect your data.',
    sections: [
      {
        heading: '1. Introduction',
        content: [
          'Welcome to SuperApp. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our application.'
        ]
      },
      {
        heading: '2. The Data We Collect',
        content: [
          'We only collect the data strictly necessary to provide our services. This includes:'
        ],
        list: [
          'Identity Data: First name, last name, and profile avatar.',
          'Contact Data: Email address used for authentication.',
          'Usage Data: Information about how you use our application and tools.'
        ]
      },
      {
        heading: '3. Zero-Trust Local Processing',
        content: [
          'SuperApp is uniquely designed to prioritize your privacy. Many of our core features (including Developer Tools, File Converters, and Media Editors) run entirely on your local device.',
          'Files processed via these local tools are NEVER uploaded to our servers, ensuring absolute zero-trust privacy for your sensitive documents.'
        ]
      },
      {
        heading: '4. Third-Party Services',
        content: [
          'For authenticated features (Cloud Storage, Account Management), we utilize Appwrite BaaS. Your data is securely encrypted at rest and in transit. We do not sell or trade your Personally Identifiable Information.'
        ]
      }
    ]
  },
  'open-source': {
    title: 'Open Source Licenses',
    icon: Layers,
    updated: 'January 01, 2026',
    description: 'Acknowledgments of the open-source software that powers SuperApp.',
    sections: [
      {
        heading: '1. Open Source Commitment',
        content: [
          'SuperApp is built on the shoulders of giants. We utilize several high-quality open-source libraries and frameworks to deliver a fast, secure, and reliable experience. We are deeply grateful to the open-source community.'
        ]
      },
      {
        heading: '2. Core Technologies & Licenses',
        content: [
          'Below is a list of the major open-source tools powering this application:'
        ],
        list: [
          'React (MIT License) - UI Library by Meta.',
          'Appwrite (BSD-3-Clause) - Secure Backend Server.',
          'Tailwind CSS (MIT License) - Utility-first CSS framework.',
          'Lucide React (ISC License) - Beautiful & consistent icon toolkit.',
          'Vite (MIT License) - Next-generation frontend tooling.',
          'FFmpeg.wasm (MIT License) - WebAssembly port of FFmpeg for local media processing.',
          'Html5-Qrcode (Apache-2.0) - Robust QR Code scanning.'
        ]
      }
    ]
  }
};

export default function Legal() {
  const { docId } = useParams();
  const navigate = useNavigate();

  const activeKey = LEGAL_DATA[docId] ? docId : 'terms-of-service';
  const content = LEGAL_DATA[activeKey];
  const Icon = content.icon;

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-200 font-sans selection:bg-purple-500/30 flex flex-col items-center relative overflow-hidden">
      <Seo 
        title={`${content.title} - SuperApp Legal`}
        description={content.description}
        keywords={["privacy policy", "terms of service", "legal", "open source"]}
        url={`/legal/${activeKey}`}
        type="website"
      />
      
      {/* --- BACKGROUND --- */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20 fixed"
        style={{
            backgroundImage: `linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            backgroundPosition: 'center center'
        }}
      >
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#020617_100%)]" />
      </div>

      {/* --- HEADER --- */}
      <div className="w-full max-w-4xl z-20 pt-6 px-4 mb-8">
        <Button 
            onClick={() => navigate('/settings')} 
            variant="ghost" 
            className="text-slate-400 hover:text-white gap-2 mb-6 pl-0 hover:bg-transparent"
        >
            <ArrowLeft size={20} /> Back to Settings
        </Button>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
                <h1 className="text-4xl font-black text-white tracking-tight flex items-center gap-3">
                    <Shield className="text-purple-500 fill-purple-500/20" size={32} />
                    Legal Center
                </h1>
                <p className="text-slate-400 mt-2">Transparency and trust are our core values.</p>
            </div>

            {/* TABS SWITCHER */}
            <div className="flex bg-slate-900/50 p-1 rounded-xl border border-slate-800 backdrop-blur-sm overflow-x-auto no-scrollbar w-full md:w-auto">
                <button
                    onClick={() => navigate('/legal/terms-of-service')}
                    className={cn(
                        "px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap",
                        activeKey === 'terms-of-service' 
                            ? "bg-slate-800 text-white shadow-sm border border-slate-700" 
                            : "text-slate-500 hover:text-slate-300"
                    )}
                >
                    <Scale size={14} /> Terms
                </button>
                <button
                    onClick={() => navigate('/legal/privacy-policy')}
                    className={cn(
                        "px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap",
                        activeKey === 'privacy-policy' 
                            ? "bg-slate-800 text-white shadow-sm border border-slate-700" 
                            : "text-slate-500 hover:text-slate-300"
                    )}
                >
                    <Lock size={14} /> Privacy
                </button>
                <button
                    onClick={() => navigate('/legal/open-source')}
                    className={cn(
                        "px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap",
                        activeKey === 'open-source' 
                            ? "bg-slate-800 text-white shadow-sm border border-slate-700" 
                            : "text-slate-500 hover:text-slate-300"
                    )}
                >
                    <Layers size={14} /> Licenses
                </button>
            </div>
        </div>
      </div>

      {/* --- DOCUMENT CONTENT --- */}
      <div className="w-full max-w-4xl z-10 px-4 pb-20 animate-fade-in">
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl p-6 md:p-12 shadow-2xl relative overflow-hidden">
            
            {/* Top accent glow */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50" />

            {/* Document Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-8 mb-8 gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-500/10 rounded-2xl border border-purple-500/20 text-purple-400 shrink-0">
                        <Icon size={32} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">{content.title}</h2>
                        <p className="text-sm text-slate-500">Last Updated: {content.updated}</p>
                    </div>
                </div>
                <div className="text-left sm:text-right">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        Current Version
                    </div>
                </div>
            </div>

            {/* Document Body */}
            <div className="space-y-10">
                {content.sections.map((section, index) => (
                    <div key={index} className="group">
                        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2 group-hover:text-purple-400 transition-colors">
                            {section.heading}
                        </h3>
                        
                        {/* Render Paragraphs */}
                        {section.content && section.content.map((paragraph, pIdx) => (
                            <p key={pIdx} className="text-slate-400 leading-relaxed text-sm md:text-base mb-3">
                                {paragraph}
                            </p>
                        ))}

                        {/* Render Bullet Points */}
                        {section.list && (
                            <ul className="list-disc list-inside space-y-2 mt-3 text-slate-400 text-sm md:text-base ml-2">
                                {section.list.map((listItem, lIdx) => (
                                    <li key={lIdx} className="leading-relaxed pl-2">{listItem}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                ))}
            </div>

            {/* Footer Note & DISCLAIMER */}
            <div className="mt-16 pt-8 border-t border-slate-800 text-center flex flex-col items-center">
                
                {/* Learning Project Disclaimer */}
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 mb-6 max-w-2xl flex gap-3 text-left items-start">
                    <ShieldCheck className="text-blue-400 shrink-0 mt-0.5" size={20} />
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                        <strong className="text-slate-200">Developer Note:</strong> SuperApp is developed as a learning & portfolio project. While it employs industry-standard security, encryption, and local-first architecture ensuring it is <strong>100% safe and reliable to use</strong>, it is not a registered commercial entity. Your data remains yours.
                    </p>
                </div>

                <p className="text-slate-500 text-sm">
                    Questions? Contact us at <span className="text-purple-400 font-bold cursor-pointer hover:underline">legal@superapp.com</span>
                </p>
            </div>

        </div>
      </div>

    </div>
  );
}
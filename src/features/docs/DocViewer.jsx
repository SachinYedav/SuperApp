import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'; 
import { Check, Copy, FileWarning, Loader2, Terminal, WifiOff } from 'lucide-react';
import Seo from '@/components/seo/Seo';
import { docsSeo } from '@/config/seoData';

export default function DocViewer({ defaultDoc }) {
  const { docId } = useParams();
  const currentDoc = docId || defaultDoc || 'introduction';
  
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isOfflineFallback, setIsOfflineFallback] = useState(false); 

  const pageSeo = docsSeo.tabs[currentDoc] || {};

  useEffect(() => {
    const fetchDocument = async () => {
      setLoading(true);
      setError(false);
      setIsOfflineFallback(false);
      
      try {
        const docModule = await import(`../../content/docs/${currentDoc}.md?raw`);
        setContent(docModule.default);
      } catch (err) {
        console.error("Doc load error:", err);
        if (!navigator.onLine) {
          setIsOfflineFallback(true);
        } else {
          setError(true);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchDocument();
  }, [currentDoc]);

  if (loading) {
    return (
      <div className="h-[50vh] flex flex-col items-center justify-center gap-4 animate-pulse">
        <Loader2 className="animate-spin text-blue-500" size={35} />
        <span className="text-sm font-medium text-slate-400 tracking-widest uppercase">Loading...</span>
      </div>
    );
  }

  if (isOfflineFallback) {
    return (
      <div className="max-w-xl mx-auto p-10 mt-10 text-center border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 rounded-3xl backdrop-blur-sm animate-in zoom-in-95 duration-500">
        <div className="w-20 h-20 mx-auto bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 shadow-inner">
           <WifiOff className="text-slate-500 dark:text-slate-400" size={36} />
        </div>
        <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight mb-2">You're Offline</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-sm mx-auto">
          This document hasn't been saved to your device yet. Connect to the internet to read it. 
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto p-8 text-center border border-red-200 bg-red-50 rounded-2xl dark:bg-red-900/10 dark:border-red-900/30 text-red-500 mt-10">
        <FileWarning className="mx-auto mb-4 opacity-80" size={40} />
        <h2 className="text-xl font-bold mb-1">Document Not Found</h2>
        <p className="text-xs font-medium text-red-400">The page you're looking for doesn't exist or has been moved.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-20 px-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Seo 
      title={pageSeo.title} 
      description={pageSeo.description} 
      keywords={pageSeo.keywords}
      type="docs" 
    />
      <article className="
        prose prose-slate dark:prose-invert max-w-none
        prose-headings:font-bold 
        prose-p:text-slate-600 dark:prose-p:text-slate-300
        prose-pre:bg-transparent prose-pre:p-0 prose-pre:m-0 
      ">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              const [isCopied, setIsCopied] = useState(false);
              const language = match ? match[1] : 'text';

              const handleCopy = () => {
                navigator.clipboard.writeText(String(children).replace(/\n$/, ''));
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2000);
              };

              if (inline || !match) {
                return (
                  <code className="bg-slate-200 dark:bg-slate-800 text-red-500 dark:text-red-400 px-1.5 py-0.5 rounded font-mono text-sm" {...props}>
                    {children}
                  </code>
                );
              }

              return (
                <div className="group relative my-6 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-[#1e1e1e] shadow-xl">
                  <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <Terminal size={14} className="text-slate-400" />
                      <span className="text-xs font-bold text-slate-400 uppercase">{language}</span>
                    </div>
                    <button onClick={handleCopy} className="text-slate-400 hover:text-white transition-colors">
                      {isCopied ? <Check size={14} className="text-green-400"/> : <Copy size={14} />}
                    </button>
                  </div>
                  <div className="relative">
                    <SyntaxHighlighter
                      style={vscDarkPlus}
                      language={language}
                      PreTag="div"
                      customStyle={{ margin: 0, padding: '1.5rem', background: 'transparent', backgroundColor: 'transparent' }}
                      codeTagProps={{ style: { backgroundColor: 'transparent' } }}
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  </div>
                </div>
              );
            },
            blockquote({ children }) {
              return (
                <div className="border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20 p-4 my-4 rounded-r-lg text-slate-700 dark:text-slate-300 italic">
                  {children}
                </div>
              );
            }
          }}
        >
          {content}
        </ReactMarkdown>
      </article>
    </div>
  );
}
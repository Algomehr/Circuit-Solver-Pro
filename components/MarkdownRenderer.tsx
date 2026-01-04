
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <div className="prose prose-invert max-w-none text-right" dir="rtl">
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          p: ({ node, ...props }) => <p className="mb-4 leading-relaxed text-slate-200" {...props} />,
          h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mb-4 text-blue-400 border-b border-blue-900/50 pb-2" {...props} />,
          h2: ({ node, ...props }) => <h2 className="text-xl font-bold mb-3 text-blue-300 mt-6" {...props} />,
          h3: ({ node, ...props }) => <h3 className="text-lg font-bold mb-2 text-indigo-300" {...props} />,
          ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-4 space-y-2 mr-2" {...props} />,
          ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-4 space-y-2 mr-2" {...props} />,
          li: ({ node, ...props }) => <li className="leading-relaxed" {...props} />,
          // بهبود نمایش بلاک‌های کد
          code: ({ node, inline, className, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || '');
            return inline ? (
              <code className="bg-slate-800 px-1.5 py-0.5 rounded text-cyan-400 font-mono text-sm border border-slate-700 mx-1" dir="ltr" {...props}>
                {children}
              </code>
            ) : (
              <div className="relative group my-4" dir="ltr">
                <div className="absolute -top-3 left-4 px-2 py-0.5 bg-slate-700 text-slate-300 text-[10px] rounded uppercase tracking-wider">
                  {match ? match[1] : 'code'}
                </div>
                <pre className="bg-slate-900 p-5 rounded-xl overflow-x-auto border border-slate-700 shadow-xl">
                  <code className="text-sm font-mono text-slate-300" {...props}>
                    {children}
                  </code>
                </pre>
              </div>
            );
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;

import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';

const markdownStyle = {
  fontSize: 18,
  lineHeight: 1.9,
  color: '#222',
  fontFamily: '"Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif',
  textAlign: 'left',
  wordBreak: 'break-word',
  overflowWrap: 'anywhere',
};

const MarkdownDescription = ({ markdownFile, onBack, backText }) => {
  const [content, setContent] = useState('');

  useEffect(() => {
    if (markdownFile) {
      fetch(`/src/markdowns/${markdownFile}`)
        .then(res => res.text())
        .then(setContent)
        .catch(() => setContent('描述加载失败。'));
    }
  }, [markdownFile]);

  useEffect(() => {
    // 代码高亮
    Prism.highlightAll();
  }, [content]);

  if (!markdownFile) return null;

  return (
    <>
      <button
        onClick={onBack}
        style={{
          position: 'fixed',
          top: 32,
          left: 32,
          padding: '10px 32px',
          borderRadius: 24,
          border: 'none',
          background: 'linear-gradient(90deg, #4f8cff 0%, #38e8ff 100%)',
          color: '#fff',
          fontWeight: 700,
          fontSize: 18,
          letterSpacing: 2,
          boxShadow: '0 4px 24px #b6e0ff55',
          cursor: 'pointer',
          transition: 'transform 0.15s, box-shadow 0.15s, opacity 0.15s',
          outline: 'none',
          opacity: 1,
          zIndex: 1001,
        }}
        onMouseOver={e => {
          e.currentTarget.style.transform = 'scale(1.06)';
          e.currentTarget.style.boxShadow = '0 8px 32px #38e8ff55';
          e.currentTarget.style.opacity = 0.92;
        }}
        onMouseOut={e => {
          e.currentTarget.style.transform = 'none';
          e.currentTarget.style.boxShadow = '0 4px 24px #b6e0ff55';
          e.currentTarget.style.opacity = 1;
        }}
      >
        {backText || '返回首页'}
      </button>
      <div style={{ maxWidth: 800, margin: '40px auto 0', padding: '40px 24px 24px 24px', minHeight: 300, background: '#fff', borderRadius: 18, boxShadow: '0 4px 32px #e5e7eb', overflowX: 'auto' }}>
        <ReactMarkdown
          remarkPlugins={[remarkMath]}
          rehypePlugins={[rehypeKatex]}
          components={{
            h1: ({node, ...props}) => <h1 style={{fontSize: 36, fontWeight: 800, margin: '24px 0 18px', textAlign: 'center', letterSpacing: 2, color: '#222'}} {...props} />,
            h2: ({node, ...props}) => <h2 style={{fontSize: 28, fontWeight: 700, margin: '22px 0 14px', color: '#2a4d8f'}} {...props} />,
            h3: ({node, ...props}) => <h3 style={{fontSize: 22, fontWeight: 600, margin: '18px 0 10px', color: '#3a3a3a'}} {...props} />,
            p: ({node, ...props}) => <p style={{margin: '12px 0', ...markdownStyle}} {...props} />,
            ul: ({node, ...props}) => <ul style={{margin: '12px 0 12px 24px', ...markdownStyle}} {...props} />,
            ol: ({node, ...props}) => <ol style={{margin: '12px 0 12px 24px', ...markdownStyle}} {...props} />,
            li: ({node, ...props}) => <li style={{margin: '6px 0', ...markdownStyle}} {...props} />,
            blockquote: ({node, ...props}) => <blockquote style={{borderLeft: '4px solid #4f8cff', background: '#f4faff', margin: '16px 0', padding: '10px 18px', color: '#555', fontStyle: 'italic'}} {...props} />,
            strong: ({node, ...props}) => <strong style={{color: '#1a237e'}} {...props} />,
            em: ({node, ...props}) => <em style={{color: '#00796b'}} {...props} />,
            code: ({inline, className, children, ...props}) => {
              if (inline) {
                return <code style={{background: '#f1f1f1', borderRadius: 4, padding: '2px 6px', fontSize: 16, color: '#d7263d', wordBreak: 'break-all'}} {...props}>{children}</code>;
              }
              return (
                <pre style={{background: '#23272e', borderRadius: 8, padding: '16px 18px', overflow: 'auto', margin: '18px 0', boxShadow: '0 2px 12px #e5e7eb', wordBreak: 'break-all'}}>
                  <code className={className} style={{color: '#fff', fontSize: 16}} {...props}>{children}</code>
                </pre>
              );
            },
            img: ({node, ...props}) => <img style={{display: 'block', margin: '24px auto', maxWidth: '100%', borderRadius: 8, boxShadow: '0 2px 12px #e5e7eb'}} {...props} />,
            a: ({href}) => (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                style={{color: '#1976d2', wordBreak: 'break-all', textDecoration: 'underline', fontWeight: 500}}
              >
                {href}
              </a>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </>
  );
};

export default MarkdownDescription; 
import React, { useEffect } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-java.min.js';

interface CodeBlockProps {
  code: string;
  style?: React.CSSProperties;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, style }) => {
  useEffect(() => {
    Prism.highlightAll();
  }, [code]);

  return (
    <pre style={{textSizeAdjust:'1px', width: '100%', overflowX: 'auto', whiteSpace: 'pre-wrap', ...style }}>
      <code className="language-java">{code}</code>
    </pre>
  );
};

export default CodeBlock;

import React, { useEffect } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-java.min.js';


interface CodeBlockProps {
  code: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code }) => {
  useEffect(() => {
    Prism.highlightAll();
  }, [code]);

  return (
    <pre>
      <code className="language-java">{code}</code>
    </pre>
  );
};

export default CodeBlock;

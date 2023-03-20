import React, { useEffect, useRef } from 'react';

const Utterances = () => {
  const containerRef = useRef();

  useEffect(() => {
    const scriptElement = document.createElement('script');
    scriptElement.src = 'https://utteranc.es/client.js';
    scriptElement.async = true;
    scriptElement.setAttribute('repo', 'LucianBuzzo/blog');
    scriptElement.setAttribute('issue-term', 'title');
    scriptElement.setAttribute('label', 'Comments');
    scriptElement.setAttribute('theme', 'github-light');

    containerRef.current.appendChild(scriptElement);

    return () => {
      containerRef.current.removeChild(scriptElement);
    };
  }, []);

  return <div ref={containerRef} />;
};

export default Utterances;

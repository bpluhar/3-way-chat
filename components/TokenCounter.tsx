'use client';

import { useState, useEffect } from 'react';

interface TokenCounterProps {
  provider: 'openai' | 'anthropic' | 'google';
}

export default function TokenCounter({ provider }: TokenCounterProps) {
  const [tokenCount, setTokenCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
         const response = await fetch('/api/token-counts');
        
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        if (isMounted) {
          setTokenCount(data[provider].totalTokens);
          setError(null);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        if (isMounted) {
          setError('Failed to fetch data. Retrying...');
        }
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 10000); // Poll every 10 seconds

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [provider]);

  return (
    <div className="flex flex-col space-y-2">
      {error && <div className="text-red-500">{error}</div>}
      <div className="text-sm text-yellow-500">
        {tokenCount > 0 ? `Tokens Used: ${tokenCount.toLocaleString()}` : 'Tokens Used: 0'}
      </div>
    </div>
  );
}

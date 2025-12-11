'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui';

interface ShareButtonsProps {
  url: string;
  title: string;
  description?: string;
}

export function ShareButtons({ url, title, description }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('링크 복사 실패:', err);
    }
  }, [url]);

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text: description, url });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('공유 실패:', err);
        }
      }
    } else {
      handleCopyLink();
    }
  }, [url, title, description, handleCopyLink]);

  const handleTwitterShare = useCallback(() => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      `${title}\n${description || ''}`
    )}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank', 'noopener,noreferrer');
  }, [url, title, description]);

  return (
    <div className="flex flex-col gap-3">
      <p className="text-center text-sm font-medium text-gray-600">결과 공유하기</p>
      <div className="flex justify-center gap-3">
        <Button variant="outline" size="sm" onClick={handleCopyLink}>
          {copied ? '복사됨!' : '링크 복사'}
        </Button>
        <Button variant="outline" size="sm" onClick={handleShare}>
          공유하기
        </Button>
        <Button variant="outline" size="sm" onClick={handleTwitterShare}>
          𝕏
        </Button>
      </div>
    </div>
  );
}

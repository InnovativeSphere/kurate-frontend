// components/ShareableLink.tsx
'use client';

import { useState } from 'react';
import { Copy, Check, Share2 } from 'lucide-react';
import { useThemeColors } from '../hooks/useThemeColors';

interface ShareableLinkProps {
  productId: string;
  productName?: string;
}

export function ShareableLink({ productId, productName }: ShareableLinkProps) {
  const [copied, setCopied] = useState(false);
  const { textSecondary, border, accent } = useThemeColors();
  const url = typeof window !== 'undefined' ? `${window.location.origin}/products/${productId}` : '';

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2 mt-2 p-2 rounded-lg border" style={{ borderColor: border }}>
      <Share2 size={14} style={{ color: textSecondary }} />
      <span className="text-xs flex-1 truncate" style={{ color: textSecondary }}>{url}</span>
      <button
        onClick={copyToClipboard}
        className="p-1 rounded-md transition-colors hover:bg-white/10"
        title="Copy link"
      >
        {copied ? <Check size={14} style={{ color: accent }} /> : <Copy size={14} style={{ color: textSecondary }} />}
      </button>
    </div>
  );
}
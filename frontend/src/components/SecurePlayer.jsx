import React, { useEffect, useState } from 'react';
import { Minimize2, Maximize2, AlignVerticalJustifyCenter } from 'lucide-react';

const SecurePlayer = ({ url, type, contentId }) => {
  const [pdfSize, setPdfSize] = useState('normal'); // 'compact' | 'normal' | 'full'

  useEffect(() => {
    const preventContextMenu = (e) => {
      e.preventDefault();
      return false;
    };
    
    // Add global listener to be extra secure inside this component
    document.addEventListener('contextmenu', preventContextMenu);
    
    return () => {
      document.removeEventListener('contextmenu', preventContextMenu);
    };
  }, []);

  if (type === 'Document') {
    const token = (() => { try { return JSON.parse(localStorage.getItem('auth-storage'))?.state?.token; } catch(_) { return ''; } })();
    const streamUrl = contentId 
      ? `https://iam-an-artist-backend.onrender.com/api/content/${contentId}/stream?token=${token}`
      : url;

    const heights = { compact: '45vh', normal: '75vh', full: '92vh' };
    const iframeHeight = heights[pdfSize];

    return (
      <div style={{ width: '100%', background: '#fff', borderRadius: '0.75rem', overflow: 'hidden', boxShadow: '0 2px 12px rgba(107,33,168,0.1)' }}>
        {/* PDF toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1rem', background: '#f3e8ff', borderBottom: '1px solid #e9d5ff' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#3B0764', flex: 1 }}>📄 PDF Viewer</span>
          {[
            { key: 'compact', label: 'Compact', icon: <Minimize2 size={13} /> },
            { key: 'normal',  label: 'Normal',  icon: <AlignVerticalJustifyCenter size={13} /> },
            { key: 'full',    label: 'Full',    icon: <Maximize2 size={13} /> },
          ].map(btn => (
            <button
              key={btn.key}
              onClick={() => setPdfSize(btn.key)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.3rem',
                padding: '0.3rem 0.7rem', borderRadius: '0.4rem', fontSize: '0.75rem', fontWeight: 600,
                border: 'none', cursor: 'pointer', transition: 'all 0.15s',
                background: pdfSize === btn.key ? 'var(--brand-purple)' : '#e9d5ff',
                color: pdfSize === btn.key ? '#fff' : '#6B21A8',
              }}
            >
              {btn.icon} {btn.label}
            </button>
          ))}
        </div>
        <iframe
          src={streamUrl}
          title="Document Viewer"
          style={{ width: '100%', height: iframeHeight, border: 'none', display: 'block', transition: 'height 0.3s ease' }}
        />
      </div>
    );
  }

  if (type === 'Video') {
    return (
      <div className="relative bg-black w-full rounded-lg overflow-hidden flex items-center justify-center aspect-video">
        <video 
          controls 
          controlsList="nodownload" 
          onContextMenu={(e) => e.preventDefault()}
          className="w-full h-full max-h-[70vh]"
          src={url}
          disablePictureInPicture
        >
          Your browser does not support the video tag.
        </video>
        {/* Transparent overlay could be added here to capture clicks but native controls are needed. 
            Disabling context menu and controlsList="nodownload" discourages 90% of basic users. */}
      </div>
    );
  }

  return (
    <div className="flex justify-center bg-gray-200 rounded-lg p-4 min-h-[50vh]">
      <img 
        src={url} 
        alt="Content" 
        className="max-w-full max-h-[70vh] object-contain shadow-lg"
        onContextMenu={(e) => e.preventDefault()}
        style={{ pointerEvents: 'none' }} // Prevents drag and drop
      />
    </div>
  );
};

export default SecurePlayer;

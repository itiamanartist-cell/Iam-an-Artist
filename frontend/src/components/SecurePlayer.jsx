import React, { useEffect } from 'react';

const SecurePlayer = ({ url, type }) => {
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
    // Use backend streaming proxy to avoid Cloudinary CORS/auth issues
    // Extract content ID from the URL path, or use the contentId prop
    const token = (() => { try { return JSON.parse(localStorage.getItem('auth-storage'))?.state?.token; } catch(_) { return ''; } })();
    const streamUrl = contentId 
      ? `https://iam-an-artist-backend.onrender.com/api/content/${contentId}/stream?token=${token}`
      : url;
    return (
      <div className="w-full bg-white rounded-lg overflow-hidden shadow-inner" style={{ minHeight: '70vh' }}>
        <iframe 
          src={streamUrl}
          title="Document Viewer"
          style={{ width: '100%', height: '75vh', border: 'none' }}
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

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
    const viewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`;
    return (
      <div className="w-full bg-white rounded-lg overflow-hidden shadow-inner min-h-[70vh]">
        <iframe 
          src={viewerUrl}
          title="Document Viewer"
          className="w-full h-[70vh] border-none"
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

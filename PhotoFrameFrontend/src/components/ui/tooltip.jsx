import React, { useState } from 'react';

export const Tooltip = ({ content, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      {isVisible && (
        <div className="absolute z-50 w-max px-2 py-1 text-xs text-white bg-gray-800 dark:bg-gray-700 rounded-md shadow-lg bottom-full left-1/2 transform -translate-x-1/2 -translate-y-1 mb-2">
          {content}
          <div className="absolute w-2 h-2 bg-gray-800 dark:bg-gray-700 transform rotate-45 -bottom-1 left-1/2 -translate-x-1/2"></div>
        </div>
      )}
    </div>
  );
};
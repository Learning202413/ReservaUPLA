import React from 'react';

export interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const PageContainer: React.FC<PageContainerProps> = ({ children, className = '' }) => {
  return (
    <div className={`space-y-5 sm:space-y-6 ${className}`}>
      {children}
    </div>
  );
};

export default PageContainer;

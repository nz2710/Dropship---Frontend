// PartnerLayout.js
import React from 'react';
import AppHeader from '../components/AppHeader';
import PartnerSidebar from '../components/PartnerSidebar';

function PartnerLayout({ children }) {
  return (
    <div>
      <PartnerSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1">
          {children}
        </div>
      </div>
    </div>
  );
}

export default PartnerLayout;
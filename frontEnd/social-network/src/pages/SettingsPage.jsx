// 📁 src/pages/SettingsPage.jsx

import React from 'react';
import { SettingsLayout } from '../components/features/settings';
import { AppLayout } from '../components/layout';

const SettingsPage = () => {
  return (
    <AppLayout hideSearchBar={true}>
      <SettingsLayout />
    </AppLayout>
    
  );
};

export default SettingsPage;
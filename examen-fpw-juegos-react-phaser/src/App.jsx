import React from 'react';
import AppLayout from './layouts/AppLayout';
import MenuOptions from './components/MenuOptions';
import './styles/app.css';

function App() {
  return (
    <AppLayout>
      <MenuOptions />
    </AppLayout>
  );
}

export default App;
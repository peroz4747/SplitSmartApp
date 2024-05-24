import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import UserForm from './components/user/UserForm';
import Navbar from './components/navbar/Navbar';
import CostForm from './components/cost/CostForm';
import CostSplit from './components/cost-split/CostSplit';
import History from './components/history/History';

const App: React.FC = () => {

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/users" element={<UserForm />} />
        <Route path="/costs" element={<CostForm />} />
        <Route path="/split" element={<CostSplit />} />
        <Route path="/history" element={<History />} />
        <Route path="*" element={<Navigate to='/split' replace/>}
        />
      </Routes>
    </div>
  );
};

export default App;

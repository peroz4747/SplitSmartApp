import React from 'react';
import { User } from '../../store/reducers/types';
import './UserIncome.scss';

interface UserIncomeProps {
  user: User;
  totalIncome: number;
  onIncomeChange: (id: number, newIncome: number) => void;
}

const UserIncome: React.FC<UserIncomeProps> = ({ user, totalIncome, onIncomeChange }) => {
  const getUserPercentage = (income: number, totalIncome: number): string => {
    return totalIncome > 0 ? ((income / totalIncome) * 100).toFixed(2) + '%' : '0%';
  };

  return (
    <div className="user-card" style={{ background: user.favColor }}>
      <label>{user.name}</label>
      <div className="input-container">
        <input
          type="number"
          min="0"
          step="0.01"
          value={user.income}
          onChange={(e) => onIncomeChange(user.id, parseFloat(e.target.value))}
        />
        <span className="currency-symbol">€</span>
      </div>
      <span>({getUserPercentage(user.income, totalIncome)})</span>
    </div>
  );
};

export default UserIncome;

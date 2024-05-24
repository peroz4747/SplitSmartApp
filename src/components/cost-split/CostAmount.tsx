import React from 'react';
import { Cost } from '../../store/reducers/types';
import './CostAmount.scss';

interface CostAmountProps {
  cost: Cost;
  costUserColor: string;
  onCostAmountChange: (id: number, newAmount: number) => void;
}

const CostAmount: React.FC<CostAmountProps> = ({ cost, costUserColor, onCostAmountChange }) => {
  return (
    <div className="cost-card" style={{ background: costUserColor }}>
      <label>{cost.name}</label>
      <div className="input-container">
        <input
          type="number"
          min="0"
          step="0.01"
          value={cost.amount}
          onChange={(e) => onCostAmountChange(cost.id, parseFloat(e.target.value))}
        />
        <span className="currency-symbol">€</span>
      </div>
    </div>
  );
};

export default CostAmount;

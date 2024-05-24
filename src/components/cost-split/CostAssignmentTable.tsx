import React from 'react';
import { User, Cost } from '../../store/reducers/types';
import './CostAssignmentTable.scss';

interface CostAssignmentTableProps {
  users: User[];
  costs: Cost[];
  costAssignments: { [costId: number]: number | null };
  onUserAssignmentChange: (costId: number, userId: number) => void;
  totalCosts: number;
  onClose: () => void;
}

const CostAssignmentTable: React.FC<CostAssignmentTableProps> = ({
  users,
  costs,
  costAssignments,
  onUserAssignmentChange,
  totalCosts,
  onClose
}) => {
  const getUserCostShare = (user: User): number => {
    return parseFloat((totalCosts * (user.percentage / 100)).toFixed(2));
  };

  const getTotalUserCosts = (userId: number): number => {
    return costs
      .filter(cost => costAssignments[cost.id] === userId)
      .reduce((total, cost) => total + cost.amount, 0);
  };

  const getTotalBalance = (user: User): number => {
    return getTotalUserCosts(user.id) - getUserCostShare(user);
  };

  return (
    <>
      <div className="dialog-overlay" onClick={onClose}></div>
      <div className="cost-assignment-table-dialog">
        <button className="close-button" onClick={onClose}>X</button>
        <table>
          <thead>
            <tr>
              <th>Cost</th>
              {users.map((usr: User) => (
                <th key={usr.id}>{usr.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {costs.map((cst: Cost) => (
              <tr key={cst.id}>
                <td>{cst.name} ({cst.amount}€)</td>
                {users.map((usr: User) => (
                  <td key={usr.id}>
                    <input
                      type="radio"
                      name={`cost-${cst.id}`}
                      checked={costAssignments[cst.id] === usr.id}
                      onChange={() => onUserAssignmentChange(cst.id, usr.id)}
                    />
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <td>User cost share</td>
              {users.map((usr: User) => (
                <td key={usr.id}>{getUserCostShare(usr)}</td>
              ))}
            </tr>
            <tr>
              <td>Selected costs</td>
              {users.map((usr: User) => (
                <td key={usr.id}>{getTotalUserCosts(usr.id).toFixed(2)}</td>
              ))}
            </tr>
            <tr>
              <td>Total Balance</td>
              {users.map((usr: User) => (
                <td key={usr.id}>{getTotalBalance(usr).toFixed(2)}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default CostAssignmentTable;

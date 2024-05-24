import React, { useEffect } from 'react';
import { AppDispatch, RootState } from '../../store/store';
import { useDispatch, useSelector } from 'react-redux';
import { loadAllUserCosts, loadUsers } from '../../store/thunks';
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { MonthYearUserCosts, User } from '../../store/reducers/types';
import './History.scss';

const History: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const storedAllUserCostsData = useSelector((state: RootState) => state.splitSmart.allUserCostData);
  const storedUsers = useSelector((state: RootState) => state.splitSmart.users);

  useEffect(() => {
    dispatch(loadAllUserCosts());
    dispatch(loadUsers());
  }, [dispatch]);

  ChartJS.register(
    LinearScale,
    CategoryScale,
    BarElement,
    PointElement,
    LineElement,
    Legend,
    Tooltip,
    LineController,
    BarController
  );

  const labels = storedAllUserCostsData?.map((aucd: MonthYearUserCosts) => aucd.monthYear);

  const totalCostsByUser = storedAllUserCostsData?.map((aucd: MonthYearUserCosts) => {
    const totalCosts: { [userId: string]: number } = {};

    aucd.userCosts.forEach(userCost => {
      userCost.costs.forEach(cost => {
        if (totalCosts[userCost.id.toString()]) {
          totalCosts[userCost.id.toString()] += cost.amount;
        } else {
          totalCosts[userCost.id.toString()] = cost.amount;
        }
      });
    });

    return totalCosts;
  });

  const result: { [key: string]: number[] } = {};
  const userBalances: { [key: string]: number[] } = {};

  const allKeys = new Set<string>();
  totalCostsByUser?.forEach(entry => {
    Object.keys(entry).forEach(key => {
      allKeys.add(key);
    });
  });

  allKeys.forEach(key => {
    result[key] = [];
    userBalances[key] = [];
  });

  allKeys.forEach(key => {
    totalCostsByUser?.forEach(entry => {
      result[key].push(entry[key] ?? 0);
    });
  });

  const calculateTotalCosts = (userCosts: { [userId: string]: number }): number => {
    return Object.values(userCosts).reduce((sum, cost) => sum + cost, 0);
  };

  const getUserCostShare = (user: User, totalCosts: number): number => {
    return parseFloat((totalCosts * (user.percentage / 100)).toFixed(2));
  };

  const calculateUserBalances = () => {
    if (storedAllUserCostsData && storedUsers) {
      storedAllUserCostsData.forEach((aucd, index) => {
        const totalMonthlyCosts = calculateTotalCosts(totalCostsByUser![index]);
        storedUsers.forEach(user => {
          const userShare = getUserCostShare(user, totalMonthlyCosts);
          const userTotalCosts = totalCostsByUser![index]?.[user.id.toString()] || 0;
          const userId = user.id.toString();
          if (!userBalances[userId]) {
            userBalances[userId] = [];
          }
          userBalances[userId][index] = userTotalCosts - userShare;
        });
      });
    }
  };

  calculateUserBalances();

  const cumulativeBalances: { [key: string]: number[] } = {};
  allKeys.forEach(key => {
    cumulativeBalances[key] = [];
    let cumulativeTotal = 0;
    userBalances[key].forEach(balance => {
      cumulativeTotal += balance;
      cumulativeBalances[key].push(cumulativeTotal);
    });
  });

  const data = {
    labels,
    datasets: [
      ...(Object.keys(cumulativeBalances).map((key, i) => {
        const user = storedUsers.find(usr => usr.id === parseInt(key));
        const label = user ? `${user.name}` : `User ${key}`;
        return {
          type: 'line' as const,
          label,
          backgroundColor: user?.favColor ?? 'gray',
          data: cumulativeBalances[key],
          borderColor: 'red',
          borderWidth: 2,
          fill: true
        };
      })),
      ...(Object.keys(userBalances).map((key, i) => {
        const user = storedUsers.find(usr => usr.id === parseInt(key));
        const label = user ? user.name : `User ${key}`;
        return {
          type: 'bar' as const,
          label,
          backgroundColor: user?.favColor ?? 'gray',
          data: userBalances[key],
          borderColor: 'white',
          borderWidth: 2,
        };
      }))
    ],
  };

  return (
    <div className="history-container">
      <div className="history-header">History of Calculations Per Month</div>
      <div className="chart-container">
        {totalCostsByUser && <Chart type="bar" data={data} />}
      </div>
    </div>
  );
};

export default History;

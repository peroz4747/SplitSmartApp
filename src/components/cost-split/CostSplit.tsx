import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { loadCosts, loadUserCosts, loadUsers, saveCost, saveUser, saveUserCosts } from '../../store/thunks';
import UserIncome from './UserIncome';
import CostAmount from './CostAmount';
import CostAssignmentTable from './CostAssignmentTable';
import './CostSplit.scss'; 
import { Cost, MonthYearUserCosts, User, UserCosts } from '../../store/reducers/types';

const CostSplit: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const storedUsers = useSelector((state: RootState) => state.splitSmart.users);
    const storedCosts = useSelector((state: RootState) => state.splitSmart.costs);
    const storedUserCostsData = useSelector((state: RootState) => state.splitSmart.userCostsData);
    const [toggleSplitCost, setToggleSplitCost] = useState(false);
    const [costAssignments, setCostAssignments] = useState<{ [costId: number]: number | null }>({});
    const [userCostsLoaded, setUserCostsLoaded] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            await dispatch(loadUsers());
            await dispatch(loadCosts());
            await dispatch(loadUserCosts());
            setUserCostsLoaded(true);
            setLoading(false);
        };
        fetchData();
    }, [dispatch]);

    useEffect(() => {
        const loadStoredUserCosts = async () => {
            if (storedUserCostsData) {
                const assignments: { [costId: number]: number | null } = {};
                storedUserCostsData.userCosts.forEach(userCost => {
                    userCost.costs.forEach(cost => {
                        assignments[cost.id] = userCost.id;
                    });
                });
                setCostAssignments(assignments);
            }
        };

        if (userCostsLoaded) {
            loadStoredUserCosts();
        }
    }, [userCostsLoaded, storedUserCostsData]);

    const handleIncomeChange = (id: number, newIncome: number) => {
        const user = storedUsers.find((user: User) => user.id === id);
        if (user) {
            const updatedUser = { ...user, income: newIncome };
            dispatch(saveUser(updatedUser));
        }
    };

    const handleCostAmountChange = (id: number, newAmount: number) => {
        const cost = storedCosts.find((cost: Cost) => cost.id === id);
        if (cost) {
            const updatedCost = { ...cost, amount: newAmount };
            dispatch(saveCost(updatedCost));
        }
    };

    const getTotalIncome = (): number => {
        return storedUsers.reduce((total, user) => total + user.income, 0);
    };

    const getTotalCosts = (): number => {
        return storedCosts.reduce((total, cost) => total + cost.amount, 0);
    };

    const getCostUserColor = (costId: number): string => {
        return storedUsers.find(usr => usr.id === costAssignments[costId])?.favColor ?? ''
    }

    const handleUserAssignmentChange = (costId: number, userId: number) => {
        setCostAssignments(prevAssignments => ({
            ...prevAssignments,
            [costId]: userId
        }));
    };

    const saveUserCostsData = async () => {
        const monthYear = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
        
        const userCostsMap: { [userId: number]: UserCosts } = {};

        storedUsers.forEach(user => {
            userCostsMap[user.id] = {
                id: user.id,
                name: user.name,
                favColor: user.favColor,
                income: user.income,
                percentage: user.percentage,
                costs: []
            };
        });

        Object.entries(costAssignments).forEach(([costId, userId]) => {
            if (userId !== null) {
                const cost = storedCosts.find(c => c.id === parseInt(costId));
                if (cost) {
                    userCostsMap[userId].costs.push(cost);
                }
            }
        });

        const userCostsData: MonthYearUserCosts = {
            monthYear,
            userCosts: Object.values(userCostsMap)
        };
        
        await dispatch(saveUserCosts(userCostsData));
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className='cost-split'>
            <div className="cost-split-header">{new Date().toLocaleString('default', { month: 'long' })}</div>
            {storedUsers.map((usr: User) => (
                <UserIncome
                    key={usr.id}
                    user={usr}
                    totalIncome={getTotalIncome()}
                    onIncomeChange={handleIncomeChange}
                />
            ))}
            <div className="total-section">Total income: {getTotalIncome().toFixed(2)} €</div>
            {storedCosts.map((cst: Cost) => (
                <CostAmount
                    key={cst.id}
                    cost={cst}
                    costUserColor={getCostUserColor(cst.id)}
                    onCostAmountChange={handleCostAmountChange}
                />
            ))}
            <div className="total-section">Total costs: {getTotalCosts().toFixed(2)} €</div>
            <div className="button-group">
                <button onClick={() => setToggleSplitCost(!toggleSplitCost)}>Split costs</button>
                <button className="btn-save" onClick={saveUserCostsData}>Save</button>
            </div>
            {
                toggleSplitCost &&
                <CostAssignmentTable
                    users={storedUsers}
                    costs={storedCosts}
                    costAssignments={costAssignments}
                    onUserAssignmentChange={handleUserAssignmentChange}
                    totalCosts={getTotalCosts()}
                    onClose={() => setToggleSplitCost(false)}
                />
            }
        </div>
    );
};

export default CostSplit;

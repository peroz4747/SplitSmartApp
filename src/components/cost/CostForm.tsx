import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../store/store';
import { Cost } from '../../store/reducers/types';
import { loadCosts, saveAllCosts } from '../../store/thunks';
import { RootState } from '../../store/store';
import { addCost, removeCost, updateCostName } from '../../store/reducers/splitSmartReducer';
import './CostForm.scss';

const CostForm: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const storedCosts = useSelector((state: RootState) => state.splitSmart.costs);

  useEffect(() => {
    dispatch(loadCosts());
  }, [dispatch]);

  const handleAddCost = () => {
    const newCost: Cost = {
      id: Date.now(),
      name: '',
      amount: 0,
    };
    dispatch(addCost(newCost));
  };

  const handleRemoveCost = (id: number) => {
    dispatch(removeCost(id));
  };

  const handleNameChange = (id: number, newName: string) => {
    dispatch(updateCostName({ id, name: newName }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(saveAllCosts(storedCosts));
  };

  return (
    <form className="cost-form" onSubmit={handleSubmit}>
      {storedCosts.map((cost, indx) => (
        <div className="cost-row" key={cost.id}>
          <label htmlFor={`name-${cost.id}`}>Cost Name:</label>
          <input
            type="text"
            id={`name-${cost.id}`}
            value={cost.name}
            onChange={(e) => handleNameChange(cost.id, e.target.value)}
            required
          />
          <button type="button" onClick={handleAddCost}>+</button>
          {indx !== 0 && (
            <button
              type="button"
              className="btn-remove"
              onClick={() => handleRemoveCost(cost.id)}
            >
              -
            </button>
          )}
        </div>
      ))}
      <button type="submit">Save</button>
    </form>
  );
};

export default CostForm;

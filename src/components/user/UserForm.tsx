import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../store/store';
import { User } from '../../store/reducers/types';
import { loadUsers, saveAllUsers } from '../../store/thunks';
import { RootState } from '../../store/store';
import { addNewUser, removeUser, updateUserName, updateUserFavColor } from '../../store/reducers/splitSmartReducer';
import './UserForm.scss';

const UserForm: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const users = useSelector((state: RootState) => state.splitSmart.users);

  useEffect(() => {
    dispatch(loadUsers());
  }, [dispatch]);

  const handleAddUser = () => {
    const newUser: User = {
      id: Date.now(),
      name: '',
      favColor: '#000000',
      income: 0,
      percentage: 0
    };
    dispatch(addNewUser(newUser));
  };

  const handleRemoveUser = (id: number) => {
    dispatch(removeUser(id));
  };

  const handleNameChange = (id: number, newName: string) => {
    dispatch(updateUserName({ id, name: newName }));
  };

  const handleFavColorChange = (id: number, newColor: string) => {
    dispatch(updateUserFavColor({ id, favColor: newColor }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(saveAllUsers(users));
  };

  return (
    <form className="user-form" onSubmit={handleSubmit}>
      {users.map((usr, indx) => (
        <div className="user-row" key={usr.id}>
          <label htmlFor={`name-${usr.id}`}>Name:</label>
          <input
            type="text"
            id={`name-${usr.id}`}
            value={usr.name}
            onChange={(e) => handleNameChange(usr.id, e.target.value)}
            required
          />
          <label htmlFor={`favColor-${usr.id}`}>Favorite Color:</label>
          <input
            type="color"
            id={`favColor-${usr.id}`}
            value={usr.favColor}
            onChange={(e) => handleFavColorChange(usr.id, e.target.value)}
          />
          <button type="button" onClick={handleAddUser}>+</button>
          {indx !== 0 && (
            <button
              type="button"
              className="btn-remove"
              onClick={() => handleRemoveUser(usr.id)}
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

export default UserForm;

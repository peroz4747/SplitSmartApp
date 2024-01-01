import React, { useState, useEffect } from "react";

export default function Intro({ setCostArray, setPeopleObject }) {
  const [users, setUsers] = useState([{ id: "user-0", name: "", color: "" }]);
  const [costs, setCosts] = useState([{ id: "cost-0", name: "" }]);

  function addUser(e) {
    var copyOfUsers = [...users];
    var uniqueIds = new Set();
    users.forEach((usr) => uniqueIds.add(usr.id));
    var randomId;
    do {
      randomId = `user-${Math.floor(Math.random() * 9999999999)}`;
    } while (uniqueIds.has(randomId));
    uniqueIds.add(randomId);
    copyOfUsers.push({
      id: randomId,
      name: e.target.value,
      color: "",
    });
    setUsers(copyOfUsers);
  }

  function addCost(e) {
    var copyOfCosts = [...costs];
    var uniqueIds = new Set();
    costs.forEach((cost) => uniqueIds.add(cost.id));
    var randomId;
    do {
      randomId = `cost-${Math.floor(Math.random() * 9999999999)}`;
    } while (uniqueIds.has(randomId));
    uniqueIds.add(randomId);
    copyOfCosts.push({
      id: randomId,
      name: e.target.value,
    });
    setCosts(copyOfCosts);
  }

  function removeUser(e) {
    var copyOfUsers = [...users];
    var filteredArray = copyOfUsers.filter((usr) => usr.id !== e.target.id);
    setUsers(filteredArray);
  }

  function removeCost(e) {
    var copyOfCosts = [...costs];
    var filteredArray = copyOfCosts.filter((cost) => cost.id !== e.target.id);
    setCosts(filteredArray);
  }

  function renameUser(e) {
    var copyOfUsers = [...users];
    var index = copyOfUsers.findIndex((obj) => obj.id === e.target.id);
    copyOfUsers[index].name = e.target.value;
    setUsers(copyOfUsers);
  }

  function renameCost(e) {
    var copyOfCosts = [...costs];
    var index = copyOfCosts.findIndex((obj) => obj.id === e.target.id);
    copyOfCosts[index].name = e.target.value;
    setCosts(copyOfCosts);
  }

  function colorChange(e) {
    var copyOfUsers = [...users];
    var index = copyOfUsers.findIndex((obj) => obj.id === e.target.id);
    copyOfUsers[index].color = e.target.value;
    setUsers(copyOfUsers);
  }

  function submitTheInfo() {
    var usersObject = {};
    var costArray = [];
    users.forEach((usr) => {
      usersObject[usr.name] = {
        data: {
          income: 0,
          percentage: 100 / users.length,
          color: usr.color,
          choosing: false,
          toPay: 0,
          costs: [],
          totalCosts: 0,
        },
      };
    });
    costs.forEach((cost) => {
      costArray.push({ id: cost.id, name: cost.name, cost: 0 });
    });
    localStorage.setItem(
      "data",
      JSON.stringify({ users: usersObject, costs: costArray })
    );
    setPeopleObject(usersObject);
    setCostArray(costArray);
  }

  return (
    <div id="intro-screen">
      <div className="intro users">
        <label>Define user names and their favorite colors:</label>
        {users.map((usr, indx) => {
          return (
            <div key={usr.id}>
              <br />
              <input
                type="text"
                id={usr.id}
                className="user"
                placeholder="Enter user name"
                onChange={(e) => renameUser(e)}
              />
              <button id={usr.id} onClick={(e) => addUser(e)}>
                +
              </button>
              {indx !== 0 && (
                <button id={usr.id} onClick={(e) => removeUser(e)}>
                  -
                </button>
              )}
              <input
                type="color"
                id={usr.id}
                onChange={(e) => colorChange(e)}
              />
            </div>
          );
        })}
      </div>
      <div className="intro costs">
        <label>Define cost names:</label>
        {costs.map((cost, indx) => {
          return (
            <div key={cost.id} id={cost.id}>
              <input
                type="text"
                id={cost.id}
                className="cost"
                placeholder="Enter cost name"
                onChange={(e) => renameCost(e)}
              />
              <button id={cost.id} onClick={(e) => addCost(e)}>
                +
              </button>
              {indx !== 0 && (
                <button id={cost.id} onClick={(e) => removeCost(e)}>
                  -
                </button>
              )}
            </div>
          );
        })}
      </div>
      <div className="intro submit-btn">
        <button onClick={() => submitTheInfo()}>Submit</button>
      </div>
    </div>
  );
}

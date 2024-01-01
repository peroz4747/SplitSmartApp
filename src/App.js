import React, { useState, useEffect } from "react";
import Intro from "./Intro";
import SplitSmart from "./SplitSmart";

export default function App() {
  const [costArray, setCostArray] = useState([]);
  const [peopleObject, setPeopleObject] = useState({});

  useEffect(() => {
    fetchTheLocalInfo();
  }, []);

  function fetchTheLocalInfo() {
    var cache = JSON.parse(localStorage.getItem("data"));
    if (cache) {
      setPeopleObject(cache.users);
      setCostArray(cache.costs);
    }
  }

  return (
    <div id="app">
      {costArray.length > 0 && Object.keys(peopleObject).length > 0 ? (
        <SplitSmart
          peopleObject={peopleObject}
          setIncome={(key, income) => {
            const newObject = { ...peopleObject };
            newObject[key].data.income = income;
            setPeopleObject(newObject);
          }}
          setPercentage={(key, percent) => {
            const newObject = { ...peopleObject };
            newObject[key].data.percentage = percent;
            setPeopleObject(newObject);
          }}
          setToPay={(key, amount) => {
            const newObject = { ...peopleObject };
            newObject[key].data.toPay = amount;
            setPeopleObject(newObject);
          }}
          setCosts={(key, costObj) => {
            const newObject = { ...peopleObject };
            newObject[key].data.costs = costObj;
            setPeopleObject(newObject);
          }}
          setCostTotal={(key, amount) => {
            const newObject = { ...peopleObject };
            newObject[key].data.totalCosts = amount;
            setPeopleObject(newObject);
          }}
          costArray={costArray}
          setCost={(cost) => {
            const newArray = [...costArray];
            const index = newArray.findIndex((c) => c.id === cost.id);
            newArray[index].cost = cost.cost;
            setCostArray(newArray);
          }}
        />
      ) : (
        <Intro
          setCostArray={(costs) => setCostArray(costs)}
          setPeopleObject={(users) => setPeopleObject(users)}
        />
      )}
    </div>
  );
}

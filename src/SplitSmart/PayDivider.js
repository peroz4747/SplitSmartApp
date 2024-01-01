import React, { useState } from "react";

export default function PayDivider({
  peopleObject,
  setIncome,
  setPercentage,
  setChange,
  change,
}) {
  const [total, setTotal] = useState(0.0);

  async function calculateTotalAndPercentage(key, inputValue) {
    var allIncomes = inputValue;
    setIncome(key, inputValue);
    var otherPeople = Object.keys(peopleObject).filter(
      (otherKey) => otherKey !== key
    );
    otherPeople.forEach((person) => {
      allIncomes += parseFloat(peopleObject[person].data.income);
    });
    setTotal(allIncomes.toFixed(2));
    setPercentage(key, ((inputValue / allIncomes) * 100).toFixed(2));
    otherPeople.forEach((person) => {
      setPercentage(
        person,
        ((peopleObject[person].data.income / allIncomes) * 100).toFixed(2)
      );
    });
    setChange(!change);
  }

  return (
    <div className="pay-divider">
      <div className="people-pay">
        {Object.entries(peopleObject).map(([key, value]) => {
          return (
            <div
              key={key}
              className={"person " + key}
              style={{ background: value.data.color }}
            >
              <label htmlFor={key}>{key}</label>
              <input
                id={key}
                type="number"
                min="0.00"
                max="10000.00"
                step="0.01"
                onChange={(money) =>
                  calculateTotalAndPercentage(
                    key,
                    parseFloat(money.target.value ?? 0)
                  )
                }
              />
              <div className={"percentage " + key}>
                {value.data.percentage + "%"}
              </div>
            </div>
          );
        })}
      </div>
      <div className="total-income">Total income: {total + "€"}</div>
    </div>
  );
}

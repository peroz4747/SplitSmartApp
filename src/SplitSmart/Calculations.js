import React, { useState, useEffect } from "react";

export default function Calculations({ costs, people, change, setToPay }) {
  const [total, setTotal] = useState(0);

  useEffect(() => {
    calculateTotal();
  }, [costs, change]);

  function calculateTotal() {
    const newTotal = costs.reduce(
      (accumulator, currentCost) => accumulator + currentCost.cost,
      0
    );
    setTotal(newTotal.toFixed(2));
    Object.entries(people).map(([key, value]) => {
      setToPay(key, (newTotal * (value.data.percentage / 100)).toFixed(2));
    });
  }

  return (
    <div className="calculations">
      <div className="calc-total">Total costs: {total}€</div>
      {Object.entries(people).map(([key, value]) => {
        return (
          <div key={key} className={"calc " + key}>
            {key} to pay: {value.data.toPay}€
          </div>
        );
      })}
    </div>
  );
}

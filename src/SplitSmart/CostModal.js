import React, { useState, useEffect } from "react";

export default function CostModal({ costs, people, setCosts, setCostTotal }) {
  const [modalState, setModalState] = useState(false);

  useEffect(() => {
    calculateTotalCosts();
  }, [costs]);
  useEffect(() => {
    checkSelectedCosts();
  }, [modalState]);

  function calculateTotalCosts() {
    Object.entries(people).forEach(([key, values]) => {
      var total = values.data.costs.reduce((acc, obj) => {
        return acc + obj.cost;
      }, 0);
      setCostTotal(key, total.toFixed(2));
    });
  }

  function checkSelectedCosts() {
    Object.entries(people).forEach(([key, value]) => {
      value.data.costs.forEach((c) => {
        hanldeCheckboxChange(key, c, true);
      });
    });
  }

  function hanldeCheckboxChange(key, cost, state) {
    // disable other checkbox
    Object.keys(people).forEach((person) => {
      var checkbox = document.querySelector(
        `.cost-chk.cost-name-${cost.name}.user-${person}`
      );
      var selectedPerson = key === person;
      if (checkbox) {
        checkbox.disabled = !selectedPerson && state;
        checkbox.checked = selectedPerson && state;
      }
    });

    // add cost to user total and user object
    addCostToPerson(key, cost, state);

    calculateTotalCosts();
  }

  function addCostToPerson(key, cost, state) {
    var costArrayCopy = [...people[key].data.costs];
    var hasCost = costArrayCopy.some((e) => e.name === cost.name);

    if (state) {
      if (hasCost) {
        var indx = costArrayCopy.findIndex((e) => e.name === cost.name);
        costArrayCopy[indx] = cost;
      } else {
        costArrayCopy.push(cost);
      }
      setCosts(key, costArrayCopy);
    } else {
      setCosts(
        key,
        costArrayCopy.filter((obj) => obj !== cost)
      );
    }
  }

  return (
    <div className="costs-modal-wrapper">
      <button className="costs-modal-btn" onClick={() => setModalState(true)}>
        Choose costs
      </button>
      {modalState && (
        <div className="modal">
          <div className="model-content">
            <div
              className="modal-dissmis-btn"
              onClick={() => setModalState(false)}
            >
              X
            </div>
            <table>
              <tr>
                <th></th>
                {Object.keys(people).map((key) => {
                  return <th key={key}>{key}</th>;
                })}
              </tr>
              {costs.map((cost, index) => {
                return (
                  <tr key={cost + index}>
                    <td key={cost + index}>
                      {cost.name}({cost.cost}€)
                    </td>
                    {Object.keys(people).map((key) => {
                      return (
                        <td
                          key={key + cost}
                          className={
                            "cost-td cost-name-" + cost.name + " user-" + key
                          }
                        >
                          <input
                            className={
                              "cost-chk cost-name-" + cost.name + " user-" + key
                            }
                            type="checkbox"
                            onChange={(e) =>
                              hanldeCheckboxChange(key, cost, e.target.checked)
                            }
                          />
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
              <tr>
                <td>TOTAL</td>
                {Object.entries(people).map(([key, value]) => {
                  return <td key={"total" + key}>{value.data.totalCosts}€</td>;
                })}
              </tr>
              <tr>
                <td>TO PAY</td>
                {Object.entries(people).map(([key, value]) => {
                  return (
                    <td key={"topay" + key}>
                      {(value.data.toPay - value.data.totalCosts).toFixed(2)}€
                    </td>
                  );
                })}
              </tr>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

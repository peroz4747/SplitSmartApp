import { useState } from "react";
import Calculations from "./SplitSmart/Calculations";
import Cost from "./SplitSmart/Cost";
import CostModal from "./SplitSmart/CostModal";
import PayDivider from "./SplitSmart/PayDivider";
import "./SplitSmart/SplitSmart.scss";

export default function SplitSmart({
  peopleObject,
  setIncome,
  setPercentage,
  setToPay,
  setCosts,
  setCostTotal,
  costArray,
  setCost,
}) {
  const [change, setChange] = useState(false);

  function resetAllAppData() {
    localStorage.removeItem("data");
    localStorage.removeItem("pdf-uri");
    location.reload();
  }

  return (
    <div id="split-smart">
      <PayDivider
        peopleObject={peopleObject}
        setIncome={(key, income) => setIncome(key, income)}
        setPercentage={(key, percent) => setPercentage(key, percent)}
        setChange={(status) => setChange(status)}
        change={change}
      />
      <hr />
      <div className="costs-list">
        {costArray.map((costObject, index) => {
          return (
            <Cost
              key={index}
              peopleObject={peopleObject}
              costObject={costObject}
              setCost={(cost) => setCost(cost)}
            />
          );
        })}
      </div>
      <hr />
      <Calculations
        costs={costArray}
        people={peopleObject}
        change={change}
        setToPay={(key, amount) => setToPay(key, amount)}
      />
      <div className="end-buttons">
        <CostModal
          costs={costArray}
          people={peopleObject}
          setCosts={(key, costObj) => setCosts(key, costObj)}
          setCostTotal={(key, amount) => setCostTotal(key, amount)}
        />
        <button className="reset-data" onClick={() => resetAllAppData()}>
          Reset all data
        </button>
      </div>
    </div>
  );
}

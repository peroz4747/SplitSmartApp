import React, { useState } from "react";
import FileViewer from "./FileViewer";

export default function Cost({ peopleObject, costObject, setCost }) {
  const [fileModal, setFileModal] = useState(false);

  function handleCostChange(value) {
    var cost = { ...costObject };
    cost.cost = value;
    setCost(cost);
  }

  function checkSelectedCost() {
    var color = "";
    Object.entries(peopleObject).forEach(([key, value]) => {
      var status = value.data.costs.some((c) => c.name === costObject.name);
      if (status) {
        color = value.data.color;
      }
    });
    return color;
  }

  return (
    <div
      className="cost-wrapper"
      style={{ backgroundColor: checkSelectedCost() }}
    >
      <div className={"cost " + costObject.name}>
        <label htmlFor={costObject.name}>{costObject.name}</label>
        <input
          type="number"
          min="0.00"
          max="10000.00"
          step="0.01"
          id={costObject.name}
          onChange={(cost) => handleCostChange(parseFloat(cost.target.value))}
          defaultValue="0"
        />
        <button onClick={() => setFileModal(true)}>File</button>
        {fileModal && (
          <FileViewer
            costName={costObject.name}
            fileModal={fileModal}
            setFileModal={(state) => setFileModal(state)}
          />
        )}
      </div>
    </div>
  );
}

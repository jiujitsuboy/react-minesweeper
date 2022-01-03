import React from "react";

export default function Cell({ attributes, updateFlag, openCell }) {
  const cellClosedStyle = {
    width: 40,
    height: 40,
    backgroundColor: "grey",
    border: "1px solid white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "10px",
    cursor: "pointer",
  };

  const cellOpenStyle = {
    width: 40,
    height: 40,
    backgroundColor: "white",
    border: "1px solid lightgray",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "20px",
    fontWeight: "bolder",
  };

  const cellFlaggedStyle = {
    width: 40,
    height: 40,
    backgroundImage: `url("flag.png")`,
    backgroundSize: "contain",
    border: "1px solid white",
    cursor: "pointer",
  };

  const cellBombGoneStyle = {
    width: 40,
    height: 40,
    backgroundImage: `url("bombGone.png")`,
    backgroundSize: "contain",
    border: "1px solid white",
  };

  const cellBombStyle = {
    width: 40,
    height: 40,
    backgroundImage: `url("bomb.png")`,
    backgroundSize: "contain",
    border: "1px solid white",
  };

  const handleClick = () => {
    openCell(attributes.row, attributes.column);
  };

  const updateFlagEvent = (event) => {
    updateFlag(event, attributes.row, attributes.column);
  };
  return (
    <div
      style={
        attributes.opened
          ? attributes.value === -1
            ? attributes.detonated
              ? cellBombGoneStyle
              : cellBombStyle
            : cellOpenStyle
          : attributes.flagged
          ? cellFlaggedStyle
          : cellClosedStyle
      }
      onClick={handleClick}
      onContextMenu={updateFlagEvent}
    >
      {attributes.opened ? (
        attributes.value === -1 ? (
          ""
        ) : (
          <span
            style={
              attributes.value === 1
                ? { color: "blue" }
                : attributes.value === 2
                ? { color: "green" }
                : attributes.value === 3
                ? { color: "red" }
                : attributes.value === 4
                ? { color: "darkblue" }
                : attributes.value === 5
                ? { color: "brown" }
                : attributes.value === 6
                ? { color: "lightcyan" }
                : attributes.value === 7
                ? { color: "green" }
                : attributes.value === 8
                ? { color: "lightgray" }
                : { color: "white" }
            }
          >
            {attributes.value}
          </span>
        )
      ) : (
        ""
      )}
    </div>
  );
}

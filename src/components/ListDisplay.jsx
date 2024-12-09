import React from "react";
import PropTypes from "prop-types";

const ListDisplay = ({ items, renderItem, header }) => {
  return (
    <div className="list-display">
      {header && <h2>{header}</h2>}
      {items.length > 0 ? (
        <ul className="list-group">
          {items.map((item) => (
            <li key={item.id} className="list-group-item">
              {renderItem(item)}
            </li>
          ))}
        </ul>
      ) : (
        <p>No items found.</p>
      )}
    </div>
  );
};

ListDisplay.propTypes = {
  items: PropTypes.array.isRequired,
  renderItem: PropTypes.func.isRequired,
  header: PropTypes.string,
};

export default ListDisplay;

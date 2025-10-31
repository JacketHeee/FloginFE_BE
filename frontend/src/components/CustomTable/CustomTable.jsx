import React, { useState } from "react";
import "./CustomTable.scss";

const CustomTable = ({ columns, data, onEdit, onDelete, onView }) => {
  const [openMenuIndex, setOpenMenuIndex] = useState(null);

  const handleMenuToggle = (index) => {
    setOpenMenuIndex(openMenuIndex === index ? null : index);
  };

  const handleView = (row) => {
    setOpenMenuIndex(null);
    if (onView) {
      onView(row);
    }
  };

  const handleEdit = (row) => {
    setOpenMenuIndex(null);
    if (onEdit) {
      onEdit(row);
    }
  };

  const handleDelete = (row) => {
    setOpenMenuIndex(null);
    if (onDelete) {
      onDelete(row);
    }
  };

  return (
    <div className="custom-table">
        <div className="table-header">
            {columns.map((col, index) => (
                <div key={index} className="table-cell header-cell">
                {col}
                </div>
            ))}
            <div className="table-cell header-cell">
                Actions
            </div>
        </div>

        <div className="table-body">
        {data.map((row, rowIndex) => (
            <div key={rowIndex} className="table-row">
                {row.map(item => <div className="table-cell">{item}</div> )}

            <div className="table-cell actions">
                <div
                className="menu-trigger"
                onClick={() => handleMenuToggle(rowIndex)}
                >
                ⋮
                </div>
                {openMenuIndex === rowIndex && (
                <div className="menu-dropdown">
                    <div className="menu-item" onClick={() => handleView(row)}>View</div>
                    <div className="menu-item" onClick={() => handleEdit(row)}>Edit</div>
                    <div className="menu-item delete" onClick={() => handleDelete(row)}>Delete</div>
                </div>
                )}
            </div>
            </div>
        ))}
        </div>
    </div>
  );
};

export default CustomTable;

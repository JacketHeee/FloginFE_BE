import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import "./CustomTable.scss";
import Icon from "../Icon/Icon";
import Button from "../Button/Button";

const CustomTable = ({ columns, data, onEdit, onDelete, onView }) => {
  const [deleteConfirm, setDeleteConfirm] = useState({
    isOpen: false,
    row: null
  });

  const handleView = (row) => {
    if (onView) onView(row);
  };

  const handleEdit = (row) => {
    if (onEdit) onEdit(row);
  };

  const handleDeleteClick = (row) => {
    setDeleteConfirm({
      isOpen: true,
      row: row
    });
  };

  const confirmDelete = useCallback(() => {
    if (onDelete && deleteConfirm.row) {
      onDelete(deleteConfirm.row);
    }
    setDeleteConfirm({ isOpen: false, row: null });
  }, [onDelete, deleteConfirm.row]);

  const cancelDelete = useCallback(() => {
    setDeleteConfirm({ isOpen: false, row: null });
  }, []);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!deleteConfirm.isOpen) return;

      if (e.key === 'Enter') {
        e.preventDefault();
        confirmDelete();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        cancelDelete();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [deleteConfirm.isOpen, confirmDelete, cancelDelete]);

  return (
    <div className="custom-table">
      <div className="table-header">
        {columns.map((col, index) => (
          <div key={index} className="table-cell header-cell">
            {col}
          </div>
        ))}
        <div className="table-cell header-cell">Actions</div>
      </div>

      <div className="table-body">
        {data.map((row, rowIndex) => {
          const actions = [
            {
              key: "view",
              func: () => handleView(row),
              icon: (
                <Icon>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                    />
                  </svg>
                </Icon>
              ),
            },
            {
              key: "edit",
              func: () => handleEdit(row),
              icon: (
                <Icon>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                    />
                  </svg>
                </Icon>
              ),
            },
            {
              key: "delete",
              func: () => handleDeleteClick(row),
              icon: (
                <Icon>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                    />
                  </svg>
                </Icon>
              ),
            },
          ];

          return (
            <div key={rowIndex} className="table-row">
              {row.map((item, i) => (
                <div key={i} className="table-cell">
                  {item}
                </div>
              ))}

              <div className="table-cell actions">
                {actions.map((action) => (
                  <Button key={action.key} onClick={action.func}>
                    {action.icon}
                  </Button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Delete Confirmation Popup */}
      {deleteConfirm.isOpen && (
        <div className="delete-popup-overlay" onClick={cancelDelete}>
          <div className="delete-popup" onClick={(e) => e.stopPropagation()}>
            <div className="delete-popup-header">
              <Icon>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                </svg>
              </Icon>
              <h3>Xác nhận xóa</h3>
            </div>
            <div className="delete-popup-body">
              <p>Bạn có chắc chắn muốn xóa mục này?</p>
              {/* <p className="warning-text">Hành động này không thể hoàn tác!</p>
              <p className="keyboard-hint">Nhấn <kbd>Enter</kbd> để xóa hoặc <kbd>Esc</kbd> để hủy</p> */}
            </div>
            <div className="delete-popup-footer">
              <Button variant="cancel" onClick={cancelDelete}>
                Hủy
              </Button>
              <Button variant="delete" onClick={confirmDelete}>
                Xóa
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

CustomTable.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.string).isRequired,
  data: PropTypes.arrayOf(PropTypes.array).isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onView: PropTypes.func,
};

export default CustomTable;

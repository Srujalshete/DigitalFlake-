import React, { useEffect } from "react";
import WarningIcon from "../assets/Img/log.png";

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, id }) => {
  useEffect(() => {
    if (isOpen) {
      const handleOutsideClick = (e) => {
        if (e.target.classList.contains("modal-overlay")) {
          onClose();
        }
      };
      document.body.addEventListener("click", handleOutsideClick);

      return () => {
        document.body.removeEventListener("click", handleOutsideClick);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay flex items-center justify-center min-h-screen bg-gray-100 bg-opacity-50 fixed top-0 left-0 w-full h-full"
      aria-hidden={!isOpen}
    >
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md mx-auto">
        <div className="flex items-center justify-center mb-4">
          <img src={WarningIcon} alt="Warning" className="w-12 h-12" />
          <h1 className="text-2xl font-bold text-black ml-2">{title}</h1>
        </div>
        <p className="text-gray-500 mb-6">{message}</p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-full text-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(id)}
            className="px-6 py-2 bg-purple-700 text-white rounded-full"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;

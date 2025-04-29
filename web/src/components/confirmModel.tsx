// src/components/ConfirmModal.tsx
import React from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message?: string;
  cancelButtonName: string;
  submitButtonName: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  message = "Are you sure you want to deactivate this user?",
  cancelButtonName,
  submitButtonName,
}) => {
  if (!isOpen) return null;
  const buttonColor =
    submitButtonName === "Activate"
      ? "px-4 py-2 bg-green-600 text-white rounded"
      : "px-4 py-2 bg-red-600 text-white rounded";
  return (
    <div className="fixed inset-0 bg-opacity-5 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
        <p className="mb-4 text-gray-800">{message}</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-black rounded"
          >
            {cancelButtonName}
          </button>
          <button onClick={onConfirm} className={buttonColor}>
            {submitButtonName}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;

import { X } from "lucide-react";

export default function ModalWrapper({ title, isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center  backdrop-blur-sm bg-black/40 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-4xl relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>
        <h2 className="text-xl font-semibold mb-4 text-gray-800">{title}</h2>
        {children}
      </div>
    </div>
  );
}

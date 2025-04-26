import { useState } from "react";
import ModalWrapper from "./ModalWrapper";

export default function EnrollClientModal({ client, isOpen, onClose, onEnroll }) {
  const [program, setProgram] = useState("");

  const handleEnroll = (e) => {
    e.preventDefault();
    if (program.trim() !== "") {
      onEnroll(client.id, program.trim());
      setProgram("");
    }
  };

  if (!client) return null;

  return (
    <ModalWrapper title="Enroll Client to Program" isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleEnroll} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Program Name (e.g. Malaria)"
          className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-200"
          value={program}
          onChange={(e) => setProgram(e.target.value)}
          required
        />
        <button type="submit" className="bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg">
          Enroll
        </button>
      </form>
    </ModalWrapper>
  );
}

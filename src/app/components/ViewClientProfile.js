import ModalWrapper from "./ModalWrapper";

export default function ViewClientProfile({ client, isOpen, onClose }) {
  if (!client) return null;

  return (
    <ModalWrapper title="Client Profile" isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col gap-3 text-gray-700">
        <div><strong>Name:</strong> {client.name}</div>
        <div><strong>Age:</strong> {client.age}</div>
        <div><strong>Gender:</strong> {client.gender}</div>
        <div><strong>ID:</strong> {client.id}</div>
        <div><strong>Status:</strong> {client.status}</div>
        <div>
          <strong>Programs:</strong>
          <div className="flex flex-wrap gap-2 mt-1">
            {client.programs.length > 0 ? client.programs.map((p) => (
              <span key={p} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">{p}</span>
            )) : <span className="text-gray-400 text-sm">None</span>}
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
}

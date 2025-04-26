import { useState } from "react";
import { User, Phone, Mail, MapPin, Calendar, ClipboardList, Droplet, AlertTriangle } from "lucide-react";
import ModalWrapper from "./ModalWrapper";

export default function AddClientModal({ isOpen, onClose, onAdd }) {
  const [clientData, setClientData] = useState({
    name: { first: "", last: "" },
    dob: "",
    gender: "Male",
    pronouns: "",
    contact: {
      phone: "",
      email: "",
      address: "",
      emergencyContact: { name: "", relationship: "", phone: "" }
    },
    medical: {
      bloodType: "",
      allergies: [],
      conditions: [],
      medications: []
    },
    demographics: {
      maritalStatus: "",
      occupation: "",
      language: ""
    }
  });

  const [newAllergy, setNewAllergy] = useState("");
  const [newCondition, setNewCondition] = useState("");
  const [newMedication, setNewMedication] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const newClient = {
      id: `CL-${Math.floor(Math.random() * 10000)}`,
      ...clientData,
      programs: [],
      lastVisit: "-",
      status: "Active",
      registeredAt: new Date().toISOString()
    };
    onAdd(newClient);
    onClose();
  };

  const handleChange = (path, value) => {
    setClientData(prev => {
      const keys = path.split('.');
      const newData = { ...prev };
      let current = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  const addMedicalItem = (type, value, setter) => {
    if (value.trim()) {
      handleChange(`medical.${type}`, [...clientData.medical[type], value]);
      setter("");
    }
  };

  const removeMedicalItem = (type, index) => {
    const updated = [...clientData.medical[type]];
    updated.splice(index, 1);
    handleChange(`medical.${type}`, updated);
  };

  return (
    <ModalWrapper 
      title="Register New Client" 
      isOpen={isOpen} 
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto p-1 w-full">
        {/* Personal Information */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-medium text-blue-800 flex items-center gap-2 mb-3">
            <User size={18} /> Personal Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">First Name *</label>
              <input
                type="text"
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-200"
                value={clientData.name.first}
                onChange={(e) => handleChange("name.first", e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Last Name *</label>
              <input
                type="text"
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-200"
                value={clientData.name.last}
                onChange={(e) => handleChange("name.last", e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Date of Birth *</label>
              <div className="relative">
                <input
                  type="date"
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-200"
                  value={clientData.dob}
                  onChange={(e) => handleChange("dob", e.target.value)}
                  required
                />
                <Calendar className="absolute right-3 top-2.5 text-gray-400" size={18} />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Gender</label>
              <select
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-200"
                value={clientData.gender}
                onChange={(e) => handleChange("gender", e.target.value)}
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-600 mb-1">Pronouns (Optional)</label>
              <input
                type="text"
                placeholder="e.g., they/them, she/her"
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-200"
                value={clientData.pronouns}
                onChange={(e) => handleChange("pronouns", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-medium text-green-800 flex items-center gap-2 mb-3">
            <Phone size={18} /> Contact Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Phone Number *</label>
              <input
                type="tel"
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-200"
                value={clientData.contact.phone}
                onChange={(e) => handleChange("contact.phone", e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Email</label>
              <div className="relative">
                <input
                  type="email"
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-200"
                  value={clientData.contact.email}
                  onChange={(e) => handleChange("contact.email", e.target.value)}
                />
                <Mail className="absolute right-3 top-2.5 text-gray-400" size={18} />
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-600 mb-1">Address</label>
              <div className="relative">
                <input
                  type="text"
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-200"
                  value={clientData.contact.address}
                  onChange={(e) => handleChange("contact.address", e.target.value)}
                />
                <MapPin className="absolute right-3 top-2.5 text-gray-400" size={18} />
              </div>
            </div>
            <div className="md:col-span-2 border-t pt-3 mt-2">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Emergency Contact</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Name</label>
                  <input
                    type="text"
                    className="w-full border rounded-lg px-3 py-1.5 text-sm"
                    value={clientData.contact.emergencyContact.name}
                    onChange={(e) => handleChange("contact.emergencyContact.name", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Relationship</label>
                  <input
                    type="text"
                    className="w-full border rounded-lg px-3 py-1.5 text-sm"
                    value={clientData.contact.emergencyContact.relationship}
                    onChange={(e) => handleChange("contact.emergencyContact.relationship", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Phone</label>
                  <input
                    type="tel"
                    className="w-full border rounded-lg px-3 py-1.5 text-sm"
                    value={clientData.contact.emergencyContact.phone}
                    onChange={(e) => handleChange("contact.emergencyContact.phone", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Medical Information */}
        <div className="bg-red-50 p-4 rounded-lg">
          <h3 className="font-medium text-red-800 flex items-center gap-2 mb-3">
            <ClipboardList size={18} /> Medical Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Blood Type</label>
              <div className="relative">
                <select
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-200"
                  value={clientData.medical.bloodType}
                  onChange={(e) => handleChange("medical.bloodType", e.target.value)}
                >
                  <option value="">Select</option>
                  <option>A+</option>
                  <option>A-</option>
                  <option>B+</option>
                  <option>B-</option>
                  <option>AB+</option>
                  <option>AB-</option>
                  <option>O+</option>
                  <option>O-</option>
                </select>
                <Droplet className="absolute right-3 top-2.5 text-gray-400" size={18} />
              </div>
            </div>
          </div>

          {/* Allergies */}
          <div className="mt-4">
            <label className="block text-sm text-gray-600 mb-1">Allergies</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add allergy (e.g., Penicillin)"
                className="flex-1 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-200"
                value={newAllergy}
                onChange={(e) => setNewAllergy(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addMedicalItem('allergies', newAllergy, setNewAllergy)}
              />
              <button
                type="button"
                className="bg-white border rounded-lg px-3 hover:bg-gray-50"
                onClick={() => addMedicalItem('allergies', newAllergy, setNewAllergy)}
              >
                Add
              </button>
            </div>
            {clientData.medical.allergies.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {clientData.medical.allergies.map((allergy, index) => (
                  <span key={index} className="bg-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
                    <AlertTriangle size={14} className="text-yellow-500" />
                    {allergy}
                    <button 
                      type="button" 
                      onClick={() => removeMedicalItem('allergies', index)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Conditions & Medications (similar to Allergies) */}
          {/* ... Additional medical fields ... */}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md transition"
          >
            Register Client
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
}
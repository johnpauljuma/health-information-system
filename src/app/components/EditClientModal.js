"use client";

import { useState, useEffect } from "react";
import { X, User, Phone, Mail, MapPin, Calendar, ClipboardList, Droplet, AlertTriangle } from "lucide-react";
import { supabase } from "../../../lib/supabase";

export default function EditClientModal({ client, isOpen, onClose, onUpdate }) {
  const [formData, setFormData] = useState({
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
    },
    status: "Active"
  });

  const [newAllergy, setNewAllergy] = useState("");
  const [newCondition, setNewCondition] = useState("");
  const [newMedication, setNewMedication] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form with client data
  useEffect(() => {
    if (client && isOpen) {
      setFormData({
        name: {
          first: client.first_name || "",
          last: client.last_name || ""
        },
        dob: client.dob || "",
        gender: client.gender || "Male",
        pronouns: client.pronouns || "",
        contact: {
          phone: client.phone || "",
          email: client.email || "",
          address: client.address || "",
          emergencyContact: {
            name: client.emergency_contact_name || "",
            relationship: client.emergency_contact_relationship || "",
            phone: client.emergency_contact_phone || ""
          }
        },
        medical: {
          bloodType: client.blood_type || "",
          allergies: client.allergies || [],
          conditions: client.conditions || [],
          medications: client.medications || []
        },
        demographics: {
          maritalStatus: client.marital_status || "",
          occupation: client.occupation || "",
          language: client.language || ""
        },
        status: client.status || "Active"
      });
    }
  }, [client, isOpen]);

  const handleChange = (path, value) => {
    setFormData(prev => {
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
      handleChange(`medical.${type}`, [...formData.medical[type]], value);
      setter("");
    }
  };

  const removeMedicalItem = (type, index) => {
    const updated = [...formData.medical[type]];
    updated.splice(index, 1);
    handleChange(`medical.${type}`, updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Prepare the updated client data
      const updatedClient = {
        first_name: formData.name.first,
        last_name: formData.name.last,
        dob: formData.dob,
        gender: formData.gender,
        pronouns: formData.pronouns,
        phone: formData.contact.phone,
        email: formData.contact.email,
        address: formData.contact.address,
        emergency_contact_name: formData.contact.emergencyContact.name,
        emergency_contact_relationship: formData.contact.emergencyContact.relationship,
        emergency_contact_phone: formData.contact.emergencyContact.phone,
        blood_type: formData.medical.bloodType,
        allergies: formData.medical.allergies,
        conditions: formData.medical.conditions,
        medications: formData.medical.medications,
        marital_status: formData.demographics.maritalStatus,
        occupation: formData.demographics.occupation,
        language: formData.demographics.language,
        status: formData.status,
        updated_at: new Date().toISOString()
      };

      // Update the client in Supabase
      const { data, error } = await supabase
        .from('clients')
        .update(updatedClient)
        .eq('id', client.id)
        .select();
      
      if (error) throw error;
      
      onUpdate(data[0]);
      onClose();
    } catch (error) {
      console.error('Error updating client:', error);
      alert('Failed to update client. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center z-10">
          <h2 className="text-xl font-bold text-gray-800">Edit Client Profile</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700"
            disabled={isLoading}
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Personal Information */}
          <div className="bg-blue-50 p-4 rounded-lg text-gray-800">
            <h3 className="font-medium text-blue-800 flex items-center gap-2 mb-3">
              <User size={18} /> Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">First Name *</label>
                <input
                  type="text"
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-200"
                  value={formData.name.first}
                  onChange={(e) => handleChange("name.first", e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Last Name *</label>
                <input
                  type="text"
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-200"
                  value={formData.name.last}
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
                    value={formData.dob}
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
                  value={formData.gender}
                  onChange={(e) => handleChange("gender", e.target.value)}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-600 mb-1">Pronouns (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g., they/them, she/her"
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-200"
                  value={formData.pronouns}
                  onChange={(e) => handleChange("pronouns", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-green-50 p-4 rounded-lg text-gray-800">
            <h3 className="font-medium text-green-800 flex items-center gap-2 mb-3">
              <Phone size={18} /> Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-200"
                  value={formData.contact.phone}
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
                    value={formData.contact.email}
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
                    value={formData.contact.address}
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
                      value={formData.contact.emergencyContact.name}
                      onChange={(e) => handleChange("contact.emergencyContact.name", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Relationship</label>
                    <input
                      type="text"
                      className="w-full border rounded-lg px-3 py-1.5 text-sm"
                      value={formData.contact.emergencyContact.relationship}
                      onChange={(e) => handleChange("contact.emergencyContact.relationship", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Phone</label>
                    <input
                      type="tel"
                      className="w-full border rounded-lg px-3 py-1.5 text-sm"
                      value={formData.contact.emergencyContact.phone}
                      onChange={(e) => handleChange("contact.emergencyContact.phone", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Medical Information */}
          <div className="bg-red-50 p-4 rounded-lg text-gray-800">  
            <h3 className="font-medium text-red-800 flex items-center gap-2 mb-3">
              <ClipboardList size={18} /> Medical Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Blood Type</label>
                <div className="relative">
                  <select
                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-200"
                    value={formData.medical.bloodType}
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
              {formData.medical.allergies.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.medical.allergies.map((allergy, index) => (
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

            {/* Conditions */}
            <div className="mt-4 ">
              <label className="block text-sm text-gray-600 mb-1">Medical Conditions</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add condition (e.g., Diabetes)"
                  className="flex-1 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-200"
                  value={newCondition}
                  onChange={(e) => setNewCondition(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addMedicalItem('conditions', newCondition, setNewCondition)}
                />
                <button
                  type="button"
                  className="bg-white border rounded-lg px-3 hover:bg-gray-50"
                  onClick={() => addMedicalItem('conditions', newCondition, setNewCondition)}
                >
                  Add
                </button>
              </div>
              {formData.medical.conditions.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.medical.conditions.map((condition, index) => (
                    <span key={index} className="bg-white px-3 py-1 rounded-full text-sm">
                      {condition}
                      <button 
                        type="button" 
                        onClick={() => removeMedicalItem('conditions', index)}
                        className="text-gray-400 hover:text-red-500 ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Medications */}
            <div className="mt-4">
              <label className="block text-sm text-gray-600 mb-1">Medications</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add medication (e.g., Insulin)"
                  className="flex-1 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-200"
                  value={newMedication}
                  onChange={(e) => setNewMedication(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addMedicalItem('medications', newMedication, setNewMedication)}
                />
                <button
                  type="button"
                  className="bg-white border rounded-lg px-3 hover:bg-gray-50"
                  onClick={() => addMedicalItem('medications', newMedication, setNewMedication)}
                >
                  Add
                </button>
              </div>
              {formData.medical.medications.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.medical.medications.map((medication, index) => (
                    <span key={index} className="bg-white px-3 py-1 rounded-full text-sm">
                      {medication}
                      <button 
                        type="button" 
                        onClick={() => removeMedicalItem('medications', index)}
                        className="text-gray-400 hover:text-red-500 ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Demographics */}
          <div className="bg-purple-50 p-4 rounded-lg text-gray-800">
            <h3 className="font-medium text-purple-800 mb-3">Demographics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Marital Status</label>
                <select
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-200"
                  value={formData.demographics.maritalStatus}
                  onChange={(e) => handleChange("demographics.maritalStatus", e.target.value)}
                >
                  <option value="">Select</option>
                  <option>Single</option>
                  <option>Married</option>
                  <option>Divorced</option>
                  <option>Widowed</option>
                  <option>Separated</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Occupation</label>
                <input
                  type="text"
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-200"
                  value={formData.demographics.occupation}
                  onChange={(e) => handleChange("demographics.occupation", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Primary Language</label>
                <input
                  type="text"
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-200"
                  value={formData.demographics.language}
                  onChange={(e) => handleChange("demographics.language", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="bg-yellow-50 p-4 rounded-lg text-gray-800">
            <h3 className="font-medium text-yellow-800 mb-3">Status</h3>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Client Status</label>
              <select
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-200"
                value={formData.status}
                onChange={(e) => handleChange("status", e.target.value)}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="High Risk">High Risk</option>
              </select>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-32"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
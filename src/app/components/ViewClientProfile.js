// components/ViewClientProfile.jsx
"use client";

import { useState } from "react";
import { User, Calendar, Phone, Mail, MapPin, ClipboardList, X } from "lucide-react";
import EditClientModal from "./EditClientModal";

export default function ViewClientProfile({ client, isOpen, onClose }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !client) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', client.id);
      
      if (error) throw error;
      
      onClose();
      // Note: You might want to add a callback to refresh the client list in the parent
    } catch (error) {
      console.error('Error deleting client:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdate = (updatedClient) => {
    // Note: You might want to add a callback to update the client list in the parent
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Client Profile</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            <div className="bg-blue-100 p-6 rounded-xl w-32 h-32 flex items-center justify-center">
              <User className="text-blue-600" size={48} />
            </div>
            
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                {client.first_name} {client.last_name}
              </h1>
              <p className="text-gray-500 mb-4">ID: {client.id}</p>
              
              <div className="flex gap-4">
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Edit Profile
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition disabled:opacity-50"
                >
                  {isDeleting ? 'Deleting...' : 'Delete Profile'}
                </button>
              </div>
            </div>
          </div>
          
          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <User size={18} className="text-gray-500" />
                Personal Information
              </h3>
              <div className="space-y-2">
                <p><span className="text-gray-500">Age:</span> {client.age}</p>
                <p><span className="text-gray-500">Gender:</span> {client.gender}</p>
                <p><span className="text-gray-500">Date of Birth:</span> {client.dob}</p>
              </div>
            </div>
            
            {/* Contact Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <Phone size={18} className="text-gray-500" />
                Contact Information
              </h3>
              <div className="space-y-2">
                <p><span className="text-gray-500">Phone:</span> {client.phone}</p>
                <p><span className="text-gray-500">Email:</span> {client.email}</p>
                <p><span className="text-gray-500">Address:</span> {client.address}</p>
              </div>
            </div>
            
            {/* Medical Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <ClipboardList size={18} className="text-gray-500" />
                Medical Information
              </h3>
              <div className="space-y-2">
                <p><span className="text-gray-500">Conditions:</span> {client.medical_conditions || 'None'}</p>
                <p><span className="text-gray-500">Allergies:</span> {client.allergies || 'None'}</p>
                <p><span className="text-gray-500">Medications:</span> {client.medications || 'None'}</p>
              </div>
            </div>
            
            {/* Programs */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <ClipboardList size={18} className="text-gray-500" />
                Programs
              </h3>
              <div className="flex flex-wrap gap-2">
                {(client.programs || []).map((program, index) => (
                  <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                    {program}
                  </span>
                ))}
                {(!client.programs || client.programs.length === 0) && (
                  <span className="text-gray-500">Not enrolled in any programs</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <EditClientModal
        client={client}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onUpdate={handleUpdate}
      />
    </div>
  );
}
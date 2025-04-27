"use client";

import { useState, useEffect } from "react";
import { Search, Check, X } from "lucide-react";
import ModalWrapper from "./ModalWrapper";
import { supabase } from "../../../lib/supabase";

export default function EnrollClientModal({ 
  client, // single client (optional)
  clients, // multiple clients (optional)
  isOpen, 
  onClose,
  onEnroll 
}) {
  // Combine both props into a single clients array
  const selectedClients = clients || (client ? [client] : []);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [availablePrograms, setAvailablePrograms] = useState([]);
  const [selectedPrograms, setSelectedPrograms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchPrograms = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('programs')
          .select('*');
        
        if (error) throw error;
        
        setAvailablePrograms(data || []);
      } catch (error) {
        console.error('Error fetching programs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchPrograms();
      setSelectedPrograms([]); // Reset selections when modal opens
    }
  }, [isOpen]);

  const filteredPrograms = availablePrograms.filter(program => 
    program.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleProgramSelection = (programId) => {
    setSelectedPrograms(prev => 
      prev.includes(programId)
        ? prev.filter(id => id !== programId)
        : [...prev, programId]
    );
  };

  const handleEnroll = async (e) => {
    e.preventDefault();
    if (selectedPrograms.length === 0 || selectedClients.length === 0) return;

    setIsSubmitting(true);
    
    try {
      const enrollments = [];
      
      for (const client of selectedClients) {
        for (const programId of selectedPrograms) {
          enrollments.push({
            client_id: client.id,
            program_id: programId,
            status: 'active'
          });
        }
      }

      const { data, error } = await supabase
        .from('enrollments')
        .insert(enrollments)
        .select();
      
      if (error) throw error;
      
      setSelectedPrograms([]);
      onClose(true); // Pass true to indicate success
      if (onEnroll) onEnroll(data); // Call optional callback
    } catch (error) {
      console.error('Error creating enrollments:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalWrapper 
      title={`Enroll ${selectedClients.length} Client${selectedClients.length !== 1 ? 's' : ''}`}
      isOpen={isOpen} 
      onClose={() => {
        setSelectedPrograms([]);
        onClose(false);
      }}
    >
      <div className="flex flex-col gap-4">
        {selectedClients.length > 0 && (
          <div className="bg-blue-50 p-3 rounded-lg">
            <h4 className="font-medium text-blue-800">Selected Client{selectedClients.length !== 1 ? 's' : ''}:</h4>
            <ul className="mt-1 text-sm text-blue-700">
              {selectedClients.map(client => (
                <li key={client.id}>
                  {client.first_name} {client.last_name} (ID: {client.id})
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search programs..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {isLoading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}

        {!isLoading && filteredPrograms.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            No programs found {searchQuery ? `matching "${searchQuery}"` : ""}
          </div>
        )}

        {!isLoading && filteredPrograms.length > 0 && (
          <div className="max-h-96 overflow-y-auto border rounded-lg divide-y">
            {filteredPrograms.map(program => (
              <div 
                key={program.id} 
                className={`p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition ${
                  selectedPrograms.includes(program.id) ? "bg-blue-50" : ""
                }`}
                onClick={() => toggleProgramSelection(program.id)}
              >
                <div>
                  <h3 className="font-medium text-gray-900">{program.name}</h3>
                  <p className="text-sm text-gray-500">{program.description || "No description"}</p>
                </div>
                <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                  selectedPrograms.includes(program.id) 
                    ? "bg-blue-600 border-blue-600 text-white" 
                    : "border-gray-300"
                }`}>
                  {selectedPrograms.includes(program.id) && <Check size={14} />}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <span className="text-sm text-gray-500">
            {selectedPrograms.length} program{selectedPrograms.length !== 1 ? 's' : ''} selected
          </span>
          <button
            type="button"
            onClick={handleEnroll}
            disabled={selectedPrograms.length === 0 || isSubmitting || selectedClients.length === 0}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              selectedPrograms.length === 0 || isSubmitting || selectedClients.length === 0
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Enrolling...
              </>
            ) : (
              `Enroll ${selectedClients.length} Client${selectedClients.length !== 1 ? 's' : ''}`
            )}
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
}
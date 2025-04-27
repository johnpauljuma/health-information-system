// components/SelectClientsModal.jsx
"use client";

import { useState, useEffect } from "react";
import { Search, Check, X } from "lucide-react";
import ModalWrapper from "./ModalWrapper";
import { supabase } from "../../../lib/supabase";

export default function SelectClientsModal({ isOpen, onClose, onClientsSelected }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [clients, setClients] = useState([]);
  const [selectedClients, setSelectedClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('clients')
          .select('*')
          .order('first_name', { ascending: true });
        
        if (error) throw error;
        
        setClients(data || []);
      } catch (error) {
        console.error('Error fetching clients:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchClients();
    }
  }, [isOpen]);

  const filteredClients = clients.filter(client => 
    `${client.first_name} ${client.last_name}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleClientSelection = (clientId) => {
    setSelectedClients(prev => 
      prev.includes(clientId)
        ? prev.filter(id => id !== clientId)
        : [...prev, clientId]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedClients.length === 0) return;
    
    const selectedClientObjects = clients.filter(client => 
      selectedClients.includes(client.id)
    );
    
    onClientsSelected(selectedClientObjects);
    setSelectedClients([]);
    onClose();
  };

  return (
    <ModalWrapper 
      title="Select Clients to Enroll" 
      isOpen={isOpen} 
      onClose={() => {
        setSelectedClients([]);
        onClose();
      }}
    >
      <div className="flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search clients..."
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

        {!isLoading && filteredClients.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            No clients found {searchQuery ? `matching "${searchQuery}"` : ""}
          </div>
        )}

        {!isLoading && filteredClients.length > 0 && (
          <div className="max-h-96 overflow-y-auto border rounded-lg divide-y">
            {filteredClients.map(client => (
              <div 
                key={client.id} 
                className={`p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition ${
                  selectedClients.includes(client.id) ? "bg-blue-50" : ""
                }`}
                onClick={() => toggleClientSelection(client.id)}
              >
                <div>
                  <h3 className="font-medium text-gray-900">
                    {client.first_name} {client.last_name}
                  </h3>
                  <p className="text-sm text-gray-500">ID: {client.id}</p>
                </div>
                <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                  selectedClients.includes(client.id) 
                    ? "bg-blue-600 border-blue-600 text-white" 
                    : "border-gray-300"
                }`}>
                  {selectedClients.includes(client.id) && <Check size={14} />}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <span className="text-sm text-gray-500">
            {selectedClients.length} client{selectedClients.length !== 1 ? 's' : ''} selected
          </span>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={selectedClients.length === 0}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              selectedClients.length === 0
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            Continue to Programs
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
}
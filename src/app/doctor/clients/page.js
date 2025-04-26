"use client";

import { useState } from "react";
import { Search, Plus, Filter, MoreVertical, User, Calendar, ClipboardList } from "lucide-react";
import AddClientModal from "../../components/AddClientModal";
import ViewClientProfile from "../../components/ViewClientProfile";
import EnrollClientModal from "../../components/EnrollClientModal";

export default function ClientsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [clients, setClients] = useState([
    {
      id: "CL-1001",
      name: "John Doe",
      age: 32,
      gender: "Male",
      programs: ["Malaria", "HIV"],
      lastVisit: "2023-10-15",
      status: "Active"
    },
    {
      id: "CL-1002",
      name: "Jane Smith",
      age: 28,
      gender: "Female",
      programs: ["Prenatal"],
      lastVisit: "2023-10-10",
      status: "Active"
    },
  ]);
  
  const [selectedClient, setSelectedClient] = useState(null);
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddClient = (newClient) => {
    setClients(prev => [...prev, newClient]);
    setIsAddClientModalOpen(false);
  };

  const handleEnrollClient = (clientId, program) => {
    setClients(prev =>
      prev.map(client =>
        client.id === clientId
          ? { ...client, programs: [...client.programs, program] }
          : client
      )
    );
    setIsEnrollModalOpen(false);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Clients</h1>
          <p className="text-gray-500">Manage patient records and enrollments</p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <button
            onClick={() => setIsAddClientModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          >
            <Plus size={16} />
            <span>New Client</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search clients by name or ID..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
            <Filter size={16} />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Clients Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Programs</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Visit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <User className="text-blue-600" size={18} />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{client.name}</div>
                        <div className="text-sm text-gray-500">ID: {client.id} • {client.age}y • {client.gender}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {client.programs.map((program) => (
                        <span key={program} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                          {program}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar size={14} />
                      {client.lastVisit}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      client.status === "Active" ? "bg-green-100 text-green-800" :
                      client.status === "Inactive" ? "bg-gray-100 text-gray-800" :
                      "bg-yellow-100 text-yellow-800"
                    }`}>
                      {client.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        className="text-blue-600 text-sm hover:underline"
                        onClick={() => { setSelectedClient(client); setIsProfileModalOpen(true); }}
                      >
                        View
                      </button>
                      <button
                        className="text-green-600 text-sm hover:underline"
                        onClick={() => { setSelectedClient(client); setIsEnrollModalOpen(true); }}
                      >
                        Enroll
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredClients.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <ClipboardList className="mx-auto text-gray-300" size={48} />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No clients found</h3>
          <p className="mt-1 text-gray-500">Try adjusting your search or add a new client</p>
        </div>
      )}

      {/* Modals */}
      <AddClientModal isOpen={isAddClientModalOpen} onClose={() => setIsAddClientModalOpen(false)} onAdd={handleAddClient} />
      <ViewClientProfile client={selectedClient} isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
      <EnrollClientModal client={selectedClient} isOpen={isEnrollModalOpen} onClose={() => setIsEnrollModalOpen(false)} onEnroll={handleEnrollClient} />
    </div>
  );
}

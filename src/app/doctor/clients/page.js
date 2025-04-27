"use client";

import { useState, useEffect } from "react";
import { Search, Plus, Filter, User, Calendar, ClipboardList, ChevronLeft, ChevronRight } from "lucide-react";
import AddClientModal from "../../components/AddClientModal";
import ViewClientProfile from "../../components/ViewClientProfile";
import EnrollClientModal from "../../components/EnrollClientModal";
import { supabase } from "../../../../lib/supabase";

export default function ClientsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [clientPrograms, setClientPrograms] = useState({});
  const [allPrograms, setAllPrograms] = useState([]);
  const [selectedProgramFilter, setSelectedProgramFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Fetch clients, programs, and enrollments
  useEffect(() => {
    const fetchData = async () => {
      // Fetch clients
      const { data: clientsData, error: clientsError } = await supabase
        .from('clients')
        .select('*');
      
      if (clientsError) {
        console.error('Error fetching clients:', clientsError);
        return;
      }

      setClients(clientsData || []);

      // Fetch all programs for filter dropdown
      const { data: programsData, error: programsError } = await supabase
        .from('programs')
        .select('*');
      
      if (programsError) {
        console.error('Error fetching programs:', programsError);
        return;
      }

      setAllPrograms(programsData || []);

      // Fetch enrollments with program names
      const { data: enrollmentsData, error: enrollmentsError } = await supabase
        .from('enrollments')
        .select(`
          client_id,
          programs!inner(name)
        `);
      
      if (enrollmentsError) {
        console.error('Error fetching enrollments:', enrollmentsError);
        return;
      }

      // Organize programs by client
      const programsByClient = {};
      enrollmentsData.forEach(enrollment => {
        if (!programsByClient[enrollment.client_id]) {
          programsByClient[enrollment.client_id] = [];
        }
        if (enrollment.programs) {
          programsByClient[enrollment.client_id].push(enrollment.programs.name);
        }
      });

      setClientPrograms(programsByClient);
    };

    fetchData();
  }, []);

  // Filter clients by search query and selected program
  const filteredClients = clients.filter(client => {
    const matchesSearch = `${client.first_name} ${client.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         String(client.id).toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesProgram = !selectedProgramFilter || 
                         (clientPrograms[client.id] && 
                          clientPrograms[client.id].includes(selectedProgramFilter));
    
    return matchesSearch && matchesProgram;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentClients = filteredClients.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleAddClient = (newClient) => {
    setClients(prev => [...prev, newClient]);
    setIsAddClientModalOpen(false);
  };

  const handleEnrollClient = (enrollments) => {
    const updatedClientPrograms = { ...clientPrograms };
    
    enrollments.forEach(enrollment => {
      if (!updatedClientPrograms[enrollment.client_id]) {
        updatedClientPrograms[enrollment.client_id] = [];
      }
      if (enrollment.programs) {
        updatedClientPrograms[enrollment.client_id].push(enrollment.programs.name);
      }
    });

    setClientPrograms(updatedClientPrograms);
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

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search clients by name or ID..."
              className="w-full pl-10 pr-4 py-2 border text-gray-600 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // Reset to first page when searching
              }}
            />
          </div>
          <div className="relative flex-1">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <select
              className="w-full pl-10 pr-4 py-2 border text-gray-600 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-400 appearance-none bg-white"
              value={selectedProgramFilter}
              onChange={(e) => {
                setSelectedProgramFilter(e.target.value);
                setCurrentPage(1); // Reset to first page when filtering
              }}
            >
              <option value="">All Programs</option>
              {allPrograms.map(program => (
                <option key={program.id} value={program.name}>
                  {program.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Clients Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-4">
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
              {currentClients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <User className="text-blue-600" size={18} />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{client.first_name} {client.last_name}</div>
                        <div className="text-sm text-gray-500">ID: {client.id} • {client.gender}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {(clientPrograms[client.id] || []).map((programName, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                          {programName}
                        </span>
                      ))}
                      {(!clientPrograms[client.id] || clientPrograms[client.id].length === 0) && (
                        <span className="text-gray-400 text-xs">No programs</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar size={14} />
                      {client.lastVisit || 'Never'}
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

      {/* Pagination */}
      {filteredClients.length > 0 && (
        <div className="flex items-center justify-between bg-white px-6 py-3 rounded-b-xl shadow-sm">
          <div className="text-sm text-gray-500">
            Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredClients.length)} of {filteredClients.length} clients
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-md ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <ChevronLeft size={18} />
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
              <button
                key={number}
                onClick={() => paginate(number)}
                className={`w-8 h-8 rounded-md text-sm ${currentPage === number ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                {number}
              </button>
            ))}
            
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-md ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      <AddClientModal isOpen={isAddClientModalOpen} onClose={() => setIsAddClientModalOpen(false)} onAdd={handleAddClient} />
      <ViewClientProfile client={selectedClient} isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
      <EnrollClientModal 
        client={selectedClient} 
        isOpen={isEnrollModalOpen} 
        onClose={() => setIsEnrollModalOpen(false)} 
        onEnroll={handleEnrollClient} 
      />
    </div>
  );
}
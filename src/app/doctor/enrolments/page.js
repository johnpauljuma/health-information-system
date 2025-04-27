"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Plus, CheckCircle, Clock, XCircle, ChevronDown, ChevronUp } from "lucide-react";
import SelectClientsModal from "../../components/SelectClientsModal";
import EnrollClientModal from "../../components/EnrollClientModal";
import { supabase } from "../../../../lib/supabase";

export default function EnrollmentsPage() {
  // State for modals and selected clients
  const [isSelectClientsModalOpen, setIsSelectClientsModalOpen] = useState(false);
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [selectedClients, setSelectedClients] = useState([]);

  // State for enrollments data
  const [enrollments, setEnrollments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // State for filters and sorting
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [programFilter, setProgramFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState({ key: "enrollment_date", direction: "desc" });
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isProgramDropdownOpen, setIsProgramDropdownOpen] = useState(false);

  // Fetch enrollments data from Supabase
  useEffect(() => {
    const fetchEnrollments = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('enrollments')
          .select(`
            id,
            enrollment_date,
            status,
            clients(id, first_name, last_name),
            programs(id, name)
          `)
          .order('enrollment_date', { ascending: false });
        
        if (error) throw error;
        
        setEnrollments(data || []);
      } catch (error) {
        console.error('Error fetching enrollments:', error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchEnrollments();
  }, []);

  // Handle clients selection from first modal
  const handleClientsSelected = (clients) => {
    setSelectedClients(clients);
    setIsSelectClientsModalOpen(false);
    setIsEnrollModalOpen(true);
  };

  // Handle enrollment completion
  const handleEnrollmentComplete = async (success) => {
    setIsEnrollModalOpen(false);
    if (success) {
      // Refresh enrollments data
      const { data, error } = await supabase
        .from('enrollments')
        .select(`
          id,
          enrollment_date,
          status,
          clients(id, first_name, last_name),
          programs(id, name)
        `)
        .order('enrollment_date', { ascending: false });
      
      if (!error) {
        setEnrollments(data || []);
      }
    }
  };

  // Filter and sort enrollments
  const filteredEnrollments = enrollments.filter(enrollment => {
    // Safely access nested properties with optional chaining and nullish coalescing
    const clientName = `${enrollment.clients?.first_name ?? ''} ${enrollment.clients?.last_name ?? ''}`.toLowerCase();
    const programName = enrollment.programs?.name?.toLowerCase() ?? '';
    const searchTerm = searchQuery.toLowerCase();
    
    const matchesSearch = 
      clientName.includes(searchTerm) ||
      programName.includes(searchTerm);
    
    const matchesStatus = statusFilter === "all" || enrollment.status === statusFilter;
    const matchesProgram = programFilter === "all" || enrollment.programs?.id?.toString() === programFilter;
    
    return matchesSearch && matchesStatus && matchesProgram;
  }).sort((a, b) => {
    // Safe sorting with fallbacks for missing data
    const getSortValue = (item, key) => {
      if (key.includes('.')) {
        const keys = key.split('.');
        return keys.reduce((obj, k) => obj?.[k] ?? '', item);
      }
      return item[key] ?? '';
    };
  
    const aValue = getSortValue(a, sortConfig.key);
    const bValue = getSortValue(b, sortConfig.key);
  
    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  // Get unique programs for filter dropdown
  const uniquePrograms = [...new Set(
    enrollments
      .map(e => e.programs?.id) // Use optional chaining
      .filter(id => id !== undefined) // Remove undefined values
  )].map(id => {
    const program = enrollments.find(e => e.programs?.id === id)?.programs ?? {};
    return { 
      id: id.toString(), 
      name: program.name ?? 'Unknown Program' 
    };
  }); 

  // Sort handler
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Status icon component
  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "completed":
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case "inactive":
        return <XCircle className="h-4 w-4 text-gray-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  // Badge style getter
  const getBadgeClass = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      case "inactive":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Program Enrollments</h1>
          <p className="text-gray-500">Manage client enrollments in health programs</p>
        </div>
        
        <button 
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          onClick={() => setIsSelectClientsModalOpen(true)}
        >
          <Plus size={16} />
          <span>New Enrollment</span>
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search clients or programs..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Status Filter Dropdown */}
          <div className="relative">
            <button 
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
              onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
            >
              <Filter size={16} />
              <span>Status: {statusFilter === "all" ? "All" : statusFilter}</span>
            </button>
            {isStatusDropdownOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg">
                <button 
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => {
                    setStatusFilter("all");
                    setIsStatusDropdownOpen(false);
                  }}
                >
                  All
                </button>
                <button 
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => {
                    setStatusFilter("active");
                    setIsStatusDropdownOpen(false);
                  }}
                >
                  Active
                </button>
                <button 
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => {
                    setStatusFilter("completed");
                    setIsStatusDropdownOpen(false);
                  }}
                >
                  Completed
                </button>
                <button 
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => {
                    setStatusFilter("inactive");
                    setIsStatusDropdownOpen(false);
                  }}
                >
                  Inactive
                </button>
              </div>
            )}
          </div>

          {/* Program Filter Dropdown */}
          <div className="relative">
            <button 
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
              onClick={() => setIsProgramDropdownOpen(!isProgramDropdownOpen)}
            >
              <Filter size={16} />
              <span>Program: {programFilter === "all" ? "All" : uniquePrograms.find(p => p.id === programFilter)?.name}</span>
            </button>
            {isProgramDropdownOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                <button 
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => {
                    setProgramFilter("all");
                    setIsProgramDropdownOpen(false);
                  }}
                >
                  All Programs
                </button>
                {uniquePrograms.map(program => (
                  <button
                    key={program.id}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => {
                      setProgramFilter(program.id);
                      setIsProgramDropdownOpen(false);
                    }}
                  >
                    {program.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Enrollments Table */}
      {!isLoading && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
                    onClick={() => requestSort("clients.first_name")}
                  >
                    <div className="flex items-center gap-1">
                      Client
                      {sortConfig.key === "clients.first_name" && (
                        sortConfig.direction === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
                    onClick={() => requestSort("programs.name")}
                  >
                    <div className="flex items-center gap-1">
                      Program
                      {sortConfig.key === "programs.name" && (
                        sortConfig.direction === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
                    onClick={() => requestSort("enrollment_date")}
                  >
                    <div className="flex items-center gap-1">
                      Enrollment Date
                      {sortConfig.key === "enrollment_date" && (
                        sortConfig.direction === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
                    onClick={() => requestSort("last_visit")}
                  >
                    <div className="flex items-center gap-1">
                      Last Visit
                      {sortConfig.key === "last_visit" && (
                        sortConfig.direction === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
  {filteredEnrollments.map((enrollment) => {
    const client = enrollment.clients ?? {};
    const program = enrollment.programs ?? {};
    
    return (
      <tr key={enrollment.id} className="hover:bg-gray-50 transition">
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <span className="text-blue-600 text-sm font-medium">
                {(client.first_name?.charAt(0) ?? '') + (client.last_name?.charAt(0) ?? '')}
              </span>
            </div>
            <div>
              <div className="font-medium text-gray-900">
                {client.first_name ?? 'Unknown'} {client.last_name ?? ''}
              </div>
              <div className="text-sm text-gray-500">ID: {client.id ?? 'N/A'}</div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="font-medium text-gray-900">{program.name ?? 'Unknown Program'}</div>
          <div className="text-sm text-gray-500">ID: {program.id ?? 'N/A'}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {enrollment.enrollment_date ? new Date(enrollment.enrollment_date).toLocaleDateString() : 'N/A'}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {enrollment.last_visit ? new Date(enrollment.last_visit).toLocaleDateString() : "Never"}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center gap-2">
            {getStatusIcon(enrollment.status)}
            <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${getBadgeClass(enrollment.status)}`}>
              {enrollment.status}
            </span>
          </div>
        </td>
        <td className="px-6 py-4 text-right whitespace-nowrap">
          <div className="flex justify-end gap-2">
            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
              View
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
              Edit
            </button>
          </div>
        </td>
      </tr>
    );
  })}
</tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredEnrollments.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <Search className="text-gray-400" size={24} />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No enrollments found</h3>
          <p className="mt-1 text-gray-500">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Modals */}
      <SelectClientsModal
        isOpen={isSelectClientsModalOpen}
        onClose={() => setIsSelectClientsModalOpen(false)}
        onClientsSelected={handleClientsSelected}
      />

      <EnrollClientModal
        clients={selectedClients}
        isOpen={isEnrollModalOpen}
        onClose={handleEnrollmentComplete}
      />
    </div>
  );
}
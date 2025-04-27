"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Filter } from "lucide-react";
import { supabase } from "../../../../lib/supabase"; 
import AddProgramModal from "../../components/AddProgramModal";
import ViewProgramModal from "../../components/ViewProgramModal";
import EditProgramModal from "../../components/EditProgramModal";

export default function ProgramsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(null);

  // Fetching programs from the database
  const fetchPrograms = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("programs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching programs:", error.message);
    } else {
      setPrograms(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleProgramAdded = (newProgram) => {
    setPrograms(prev => [...prev, newProgram]);
    handleCloseModal();
  };

  const handleViewProgram = (program) => {
    setSelectedProgram(program); // Save the full program data
    setIsViewModalOpen(true);
  };
  
  const handleEditProgram = (program) => {
    setSelectedProgram(program); // Save the full program data
    setIsEditModalOpen(true);
  };
  
  const toggleDropdown = (programId) => {
    setDropdownOpen(dropdownOpen === programId ? null : programId);
  };
  
  const handleDeleteProgram = async (programId) => {
    if (confirm("Are you sure you want to delete this program?")) {
      const { error } = await supabase
        .from("programs")
        .delete()
        .eq("id", programId);
  
      if (error) {
        console.error("Error deleting program:", error.message);
      } else {
        setPrograms(prev => prev.filter(p => p.id !== programId));
        setDropdownOpen(null);
      }
    }
  };

  const filteredPrograms = programs.filter((program) => {
    const matchesSearch = program.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || program.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Health Programs</h1>
        <button
          onClick={handleOpenModal}
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md text-sm"
        >
          <Plus size={16} className="mr-2" />
          Add Program
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center bg-white px-3 py-2 rounded-md shadow-sm w-full md:w-1/3 text-gray-700">
          <Search size={18} className="mr-2" />
          <input
            type="text"
            placeholder="Search programs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full outline-none text-sm"
          />
        </div>

        <div className="flex items-center gap-2 text-gray-700">
          <Filter size={18} className="text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border rounded-md px-3 py-2 text-sm shadow-sm"
          >
            <option value="All">All</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Programs Table */}
      <div className="overflow-x-auto bg-white rounded-md shadow-md text-gray-700">
        {loading ? (
          <div className="p-6 text-center text-gray-500">Loading programs...</div>
        ) : (
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="text-left px-6 py-3">Program Name</th>
                <th className="text-left px-6 py-3">Description</th>
                <th className="text-left px-6 py-3">Status</th>
                <th className="text-left px-6 py-3">Created At</th>
                <th className="text-center px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPrograms.length > 0 ? (
                filteredPrograms.map((program) => (
                  <tr key={program.id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4">{program.name}</td>
                    <td className="px-6 py-4">{program.description}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${program.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {program.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {program.created_at ? new Date(program.created_at).toLocaleDateString() : "-"}
                    </td>
                    <td className="px-6 py-4 text-center flex items-center justify-center gap-4">
                        <button
                            onClick={() => handleViewProgram(program)}
                            className="text-blue-500 hover:underline text-sm"
                        >
                            View
                        </button>
                        <button
                            onClick={() => handleEditProgram(program)}
                            className="text-green-500 hover:underline text-sm"
                        >
                            Edit
                        </button>
                        <div className="relative">
                            <button
                            onClick={() => toggleDropdown(program.id)}
                            className="text-gray-500 hover:text-gray-700"
                            >
                            &#8942;
                            </button>
                            {dropdownOpen === program.id && (
                            <div className="absolute right-0 mt-2 w-28 bg-white border rounded shadow-md z-10">
                                <button
                                onClick={() => handleDeleteProgram(program.id)}
                                className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 text-sm"
                                >
                                Delete
                                </button>
                            </div>
                            )}
                        </div>
                        </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-6 py-4 text-center text-gray-500" colSpan="5">
                    No programs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <AddProgramModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onProgramAdded={handleProgramAdded}
        />
      )}

      {/* View Program Modal */}
      {isViewModalOpen && (
        <ViewProgramModal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          program={selectedProgram}
        />
      )}
  
      {/* Edit Program Modal */}
      {isEditModalOpen && (
        <EditProgramModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          program={selectedProgram}
          onProgramUpdated={(updatedProgram) => {
            setPrograms(prev => prev.map(p => p.id === updatedProgram.id ? updatedProgram : p));
          }}
        />
      )}
    </div>
  );
}

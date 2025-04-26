"use client";

import { useState } from "react";
import { Plus, Search, Filter } from "lucide-react";
import AddProgramModal from "../../components/AddProgramModal";

export default function ProgramsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const programs = [
    { id: 1, name: "HIV Care", description: "HIV management program", status: "Active", createdAt: "2024-03-12" },
    { id: 2, name: "Malaria Treatment", description: "Malaria treatment initiative", status: "Active", createdAt: "2024-01-05" },
    { id: 3, name: "TB Awareness", description: "Tuberculosis awareness program", status: "Inactive", createdAt: "2023-12-01" },
  ];

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
          onClick={() => setIsModalOpen(true)}
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md text-sm"
        >
          <Plus size={16} className="mr-2" />
          Add Program
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center bg-white px-3 py-2 rounded-md shadow-sm w-full md:w-1/3">
          <Search size={18} className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search programs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full outline-none text-sm"
          />
        </div>

        <div className="flex items-center gap-2">
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
      <div className="overflow-x-auto bg-white rounded-md shadow-md">
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
                  <td className="px-6 py-4">{program.createdAt}</td>
                  <td className="px-6 py-4 text-center">
                    <button className="text-blue-600 hover:underline text-sm">Edit</button>
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
      </div>

      {/* Modal */}
      <AddProgramModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

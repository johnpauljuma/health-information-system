"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { supabase } from "../../../lib/supabase";

export default function AddProgramModal({ isOpen, onClose }) {
  const [newProgram, setNewProgram] = useState({
    name: "",
    code: "",
    description: "",
    category: "",
    targetPopulation: [],
    conditions: [],
    interventions: [],
    startDate: "",
    endDate: "",
    status: "Draft",
    protocols: [],
    responsibleStaff: [],
    locations: []
  });

  const targetOptions = ["Children <5", "Pregnant Women", "Adults 18-60", "Elderly >60"];
  const conditionOptions = ["Malaria", "HIV", "TB", "Diabetes", "Hypertension"];
  const interventionOptions = ["Vaccination", "Screening", "Medication", "Counseling", "Surgery"];
  const locationOptions = ["Main Clinic", "Pediatric Wing", "Community Center", "Mobile Unit"];

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProgram(prev => ({ ...prev, [name]: value }));
  };

  const handleMultiSelect = (field, value) => {
    setNewProgram(prev => {
      const currentValues = [...prev[field]];
      const index = currentValues.indexOf(value);
      if (index === -1) currentValues.push(value);
      else currentValues.splice(index, 1);
      return { ...prev, [field]: currentValues };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const { data, error } = await supabase
        .from("programs")
        .insert([{
          name: newProgram.name,
          code: newProgram.code || `PRG-${Date.now()}`, // auto-generate if missing
          description: newProgram.description,
          category: newProgram.category,
          target_population: newProgram.targetPopulation,
          conditions: newProgram.conditions,
          interventions: newProgram.interventions,
          start_date: newProgram.startDate ? new Date(newProgram.startDate).toISOString() : null,
          end_date: newProgram.endDate ? new Date(newProgram.endDate).toISOString() : null,
          status: newProgram.status,
          protocols: newProgram.protocols.map(f => f.name), // we'll improve this later
          //responsible_staff: newProgram.responsibleStaff,
          locations: newProgram.locations,
        }]);
  
      if (error) {
        console.error("Error inserting program:", error);
        alert("Error saving program: " + error.message);
        return;
      }
  
      console.log("Program inserted:", data);
      alert("Program saved successfully! 🎉");
      onClose(); // Close the modal
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden max-h-[90vh] flex flex-col relative">
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition">
          <X size={28} />
        </button>

        <div className="px-8 py-6 border-b bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-t-3xl">
          <h2 className="text-2xl font-bold">Add New Health Program</h2>
          <p className="text-sm mt-1 opacity-80">Fill out the form to create a program</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8 bg-gray-50">
          {/* Basic Info */}
          <Section title="Basic Information">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-700">
              <Input label="Program Name *" name="name" value={newProgram.name} onChange={handleInputChange} required placeholder="Eg. Malaria" />
              <Input label="Program Code" name="code" value={newProgram.code} onChange={handleInputChange} placeholder="Auto-generated if empty" />
              <Select
                label="Program Category *"
                name="category"
                value={newProgram.category}
                onChange={handleInputChange}
                options={["Infectious Diseases", "Chronic Care", "Maternal Health", "Child Health", "Mental Health"]}
                required
              />
            </div>
            <Textarea className="text-gray-700" label="Description" name="description" value={newProgram.description} onChange={handleInputChange} placeholder="Enter program description" />
          </Section>

          {/* Clinical Details */}
          <Section title="Clinical Details">
            <MultiCheckbox title="Target Population" options={targetOptions} selected={newProgram.targetPopulation} onChange={(option) => handleMultiSelect("targetPopulation", option)} />
            <MultiCheckbox title="Health Conditions" options={conditionOptions} selected={newProgram.conditions} onChange={(option) => handleMultiSelect("conditions", option)} />
            <MultiCheckbox title="Intervention Types" options={interventionOptions} selected={newProgram.interventions} onChange={(option) => handleMultiSelect("interventions", option)} />
          </Section>

          {/* Admin Info */}
          <Section title="Program Administration">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-700">
              <Input label="Start Date" name="startDate" value={newProgram.startDate} onChange={handleInputChange} type="date" />
              <Input label="End Date" name="endDate" value={newProgram.endDate} onChange={handleInputChange} type="date" />
              <Select label="Program Status" name="status" value={newProgram.status} onChange={handleInputChange} options={["Draft", "Active", "Paused", "Completed"]} />
            </div>
            <MultiCheckbox title="Implementation Locations" options={locationOptions} selected={newProgram.locations} onChange={(option) => handleMultiSelect("locations", option)} />
          </Section>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="px-5 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100 transition">
              Cancel
            </button>
            <button type="submit" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-md transition">
              Save Program
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Section Wrapper
function Section({ title, children }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm space-y-6">
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      {children}
    </div>
  );
}

// Input Field
function Input({ label, ...props }) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        {...props}
        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-50 p-2 text-sm"
      />
    </div>
  );
}

// Textarea
function Textarea({ label, className = "", ...props }) {
    return (
    <div>
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <textarea
        {...props}
        rows={3}
        className={`mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm text-sm focus:ring-blue-500 focus:border-blue-500 ${className}`}
        />
    </div>
    );
}

// Select Dropdown
function Select({ label, options, ...props }) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <select
        {...props}
        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-50 p-2 text-sm"
      >
        <option value="">Select an option</option>
        {options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}

// Multi Checkbox
function MultiCheckbox({ title, options, selected, onChange }) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{title}</label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {options.map(option => (
          <label key={option} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={selected.includes(option)}
              onChange={() => onChange(option)}
              className="h-4 w-4 rounded text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span className="text-gray-700">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

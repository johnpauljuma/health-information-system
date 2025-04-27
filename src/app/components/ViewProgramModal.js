"use client";
import { X, ClipboardList, Users, Calendar, FileText, Activity, MapPin, CircleDot } from "lucide-react";

export default function ViewProgramModal({ isOpen, onClose, program }) {
  if (!isOpen || !program) return null;

  // Format dates for display
  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden relative">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition"
        >
          <X size={20} />
        </button>

        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 text-white">
          <div className="flex items-center gap-3">
            <ClipboardList size={24} className="text-white" />
            <h2 className="text-2xl font-bold">{program.name}</h2>
          </div>
          <p className="text-sm opacity-90 mt-1">{program.description}</p>
        </div>

        {/* Program Details */}
        <div className="p-6 space-y-6">
          {/* Status Badge */}
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              program.status === 'Active' ? 'bg-green-100 text-green-800' :
              program.status === 'Draft' ? 'bg-yellow-100 text-yellow-800' :
              program.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {program.status}
            </span>
          </div>

          {/* Grid Layout for Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Basic Info */}
            <DetailCard 
              icon={<FileText size={18} className="text-blue-500" />}
              title="Basic Information"
              items={[
                { label: 'Program Code', value: program.code || 'Not specified' },
                { label: 'Category', value: program.category || 'Not specified' }
              ]}
            />

            {/* Dates */}
            <DetailCard 
              icon={<Calendar size={18} className="text-purple-500" />}
              title="Timeline"
              items={[
                { label: 'Start Date', value: formatDate(program.start_date) },
                { label: 'End Date', value: formatDate(program.end_date) }
              ]}
            />

            {/* Target Population */}
            {program.target_population?.length > 0 && (
              <DetailCard 
                icon={<Users size={18} className="text-green-500" />}
                title="Target Population"
              >
                <div className="flex flex-wrap gap-2 mt-2">
                  {program.target_population.map((group, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                      {group}
                    </span>
                  ))}
                </div>
              </DetailCard>
            )}

            {/* Conditions */}
            {program.conditions?.length > 0 && (
              <DetailCard 
                icon={<Activity size={18} className="text-red-500" />}
                title="Health Conditions"
              >
                <div className="flex flex-wrap gap-2 mt-2">
                  {program.conditions.map((condition, index) => (
                    <span key={index} className="px-2 py-1 bg-red-50 text-red-700 text-xs rounded-full">
                      {condition}
                    </span>
                  ))}
                </div>
              </DetailCard>
            )}

            {/* Locations */}
            {program.locations?.length > 0 && (
              <DetailCard 
                icon={<MapPin size={18} className="text-amber-500" />}
                title="Implementation Locations"
              >
                <div className="flex flex-wrap gap-2 mt-2">
                  {program.locations.map((location, index) => (
                    <span key={index} className="px-2 py-1 bg-amber-50 text-amber-700 text-xs rounded-full">
                      {location}
                    </span>
                  ))}
                </div>
              </DetailCard>
            )}

            {/* Interventions */}
            {program.interventions?.length > 0 && (
              <DetailCard 
                icon={<CircleDot size={18} className="text-indigo-500" />}
                title="Intervention Types"
              >
                <div className="flex flex-wrap gap-2 mt-2">
                  {program.interventions.map((intervention, index) => (
                    <span key={index} className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-full">
                      {intervention}
                    </span>
                  ))}
                </div>
              </DetailCard>
            )}
          </div>

          {/* Metadata */}
          <div className="pt-4 border-t border-gray-200 text-sm text-gray-500">
            <div className="flex justify-between">
              <p>Created: {program.created_at ? new Date(program.created_at).toLocaleString() : 'Unknown'}</p>
              <p>Last Updated: {program.updated_at ? new Date(program.updated_at).toLocaleString() : 'Never'}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// Reusable Detail Card Component
function DetailCard({ icon, title, items, children }) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
      <div className="flex items-center gap-2 text-gray-700 mb-2">
        {icon}
        <h3 className="font-medium">{title}</h3>
      </div>
      {items ? (
        <div className="space-y-1">
          {items.map((item, index) => (
            <div key={index} className="flex text-sm">
              <span className="text-gray-500 w-24">{item.label}:</span>
              <span className="font-medium">{item.value}</span>
            </div>
          ))}
        </div>
      ) : (
        children
      )}
    </div>
  );
}
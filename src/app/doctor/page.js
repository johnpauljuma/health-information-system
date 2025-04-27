"use client";

import { useState, useEffect } from "react";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title as ChartTitle, Tooltip, Legend, ArcElement } from "chart.js";
import { FaUsers, FaNotesMedical, FaChartLine, FaClock, FaSearch, FaCalendarAlt } from "react-icons/fa";
import { supabase } from "../../../lib/supabase";

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ChartTitle, Tooltip, Legend, ArcElement);

export default function DoctorDashboard() {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [healthPrograms, setHealthPrograms] = useState([]);
  const [clients, setClients] = useState([]);
  const [enrollments, setEnrollments] = useState([]); const [appointments, setAppointments] = useState([]);

  // Charts data
  const [lineChartData, setLineChartData] = useState({
    labels: [],
    datasets: [],
  });

  const [barChartData, setBarChartData] = useState({
    labels: [],
    datasets: [],
  });

  const [doughnutChartData, setDoughnutChartData] = useState({
    labels: ["Active", "Inactive", "High-risk"],
    datasets: [{
      data: [0, 0, 0],
      backgroundColor: ["#4CAF50", "#FFC107", "#F44336"],
    }],
  });

  // Card data
  const [cardsData, setCardsData] = useState({
    totalPrograms: 0,
    totalClients: 0,
    enrolledClients: 0,
    programsWithEnrollments: 0,
  });

  // Recent activity
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Fetch programs separately
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const { data: programsData, error } = await supabase.from('programs').select('*');
        if (error) throw error;

        setHealthPrograms(programsData || []);
      } catch (error) {
        console.error("Error fetching programs:", error);
      }
    };
    fetchPrograms();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // First fetch programs separately to debug any issues
      const { data: programsData, error: programsError } = await supabase
        .from('programs')
        .select('*');
      
      if (programsError) {
        console.error('Error fetching programs:', programsError);
        throw programsError;
      }
      
      console.log("Programs data:", programsData);
      setHealthPrograms(programsData || []);
  
      // Then fetch the rest of the data in parallel
      const [
        { data: clientsData, error: clientsError },
        { data: enrollmentsData, error: enrollmentsError },
      ] = await Promise.all([
        supabase.from('clients').select('*'),
        supabase.from('enrollments').select('*'),
      ]);
  
      if (clientsError) throw clientsError;
      if (enrollmentsError) throw enrollmentsError;
  
      setClients(clientsData || []);
      setEnrollments(enrollmentsData || []);
  
      // Process data for cards
      updateCardsData(programsData, clientsData, enrollmentsData);
      
      // Process data for charts
      updateCharts(clientsData, enrollmentsData);
      
      // Process recent activity
      updateRecentActivity(clientsData, enrollmentsData);
  
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateCardsData = (programs, clients, enrollments) => {
    const uniqueEnrolledClients = [...new Set(enrollments.map(e => e.client_id))].length;
    const programsWithEnrollments = [...new Set(enrollments.map(e => e.program_id))].length;

    setCardsData({
      totalPrograms: programs?.length || 0,
      totalClients: clients?.length || 0,
      enrolledClients: uniqueEnrolledClients,
      programsWithEnrollments: programsWithEnrollments,
    });
  };

  const updateCharts = (clients, enrollments) => {
    updateLineChart(enrollments);
    updateBarChart(enrollments);
    updateDoughnutChart(clients);
  };

  const updateLineChart = (enrollments) => {
    // Group enrollments by month
    const monthlyEnrollments = {};
    enrollments.forEach(enrollment => {
      const date = new Date(enrollment.enrollment_date);
      const month = date.toLocaleString('default', { month: 'short' });
      monthlyEnrollments[month] = (monthlyEnrollments[month] || 0) + 1;
    });

    // Last 6 months
    const months = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now);
      date.setMonth(date.getMonth() - i);
      months.push(date.toLocaleString('default', { month: 'short' }));
    }

    const enrollmentCounts = months.map(month => monthlyEnrollments[month] || 0);

    setLineChartData({
      labels: months,
      datasets: [{
        label: "Monthly Enrollments",
        data: enrollmentCounts,
        borderColor: "#4F46E5",
        backgroundColor: "#6366F1",
        tension: 0.3,
      }]
    });
  };

  
  const updateBarChart = async (enrollments) => {
    try {
      // Fetch the programs from Supabase inside the function
      const { data: programs, error: programsError } = await supabase.from('programs').select('*');
  
      if (programsError) {
        console.error("Error fetching programs:", programsError);
        return;
      }
  
      if (!programs || !Array.isArray(programs)) {
        console.error("Programs data is invalid or not an array!");
        return;
      }
  
      // Count enrollments per program_id
      const programEnrollments = {};
      enrollments.forEach(enrollment => {
        programEnrollments[enrollment.program_id] = (programEnrollments[enrollment.program_id] || 0) + 1;
      });
  
      // Get program names from the fetched 'programs' data based on program_id
      const programNames = Object.keys(programEnrollments).map(programId => {
        const program = programs.find(p => p.id === programId);
        return program ? program.name : 'Unknown Program';  // Default to 'Unknown Program' if not found
      });
  
      // Get enrollment counts for each program
      const enrollmentCounts = Object.keys(programEnrollments).map(programId => programEnrollments[programId]);
  
      // Update the bar chart with the new data
      setBarChartData({
        labels: programNames,
        datasets: [{
          label: "Clients per Program",
          data: enrollmentCounts,
          backgroundColor: ["#6366F1", "#EC4899", "#F59E0B", "#10B981", "#3B82F6"],
        }]
      });
    } catch (error) {
      console.error("Error updating bar chart:", error);
    }
  };
  
  
  
  const updateDoughnutChart = (clients) => {
    const active = clients.filter(c => c.status === "Active").length;
    const inactive = clients.filter(c => c.status === "Inactive").length;
    const highRisk = clients.filter(c => c.status === "High Risk").length;

    setDoughnutChartData({
      labels: ["Active", "Inactive", "High-risk"],
      datasets: [{
        data: [active, inactive, highRisk],
        backgroundColor: ["#4CAF50", "#FFC107", "#F44336"],
      }]
    });
  };

  const updateRecentActivity = (clients, enrollments) => {
    // Create recent activity from enrollments (simplified example)
    const activities = enrollments.slice(0, 4).map(enrollment => {
      const client = clients.find(c => c.id === enrollment.client_id);
      const program = healthPrograms.find(p => p.id === enrollment.program_id);
      return {
        action: `Client ${client?.first_name} ${client?.last_name} enrolled in ${program?.name}`,
        time: formatTimeAgo(enrollment.enrollment_date),
      };
    });

    setRecentActivity(activities);
  };

  // Helper functions
  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  // Filter clients based on search
  const filteredClients = clients.filter(client => {
    const clientName = `${client.first_name} ${client.last_name}`.toLowerCase();
    const searchTerm = searchQuery.toLowerCase();
    return clientName.includes(searchTerm);
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 w-full bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900">Health Information System Dashboard</h1>

      {/* Cards Section - Updated with new metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md flex items-start">
          <div className="bg-blue-100 p-3 rounded-full mr-4">
            <FaNotesMedical className="text-blue-600 text-xl" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-700">Health Programs</h2>
            <p className="text-2xl font-bold text-gray-900">{cardsData.totalPrograms}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md flex items-start">
          <div className="bg-purple-100 p-3 rounded-full mr-4">
            <FaUsers className="text-purple-600 text-xl" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-700">Registered Clients</h2>
            <p className="text-2xl font-bold text-gray-900">{cardsData.totalClients}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md flex items-start">
          <div className="bg-green-100 p-3 rounded-full mr-4">
            <FaUsers className="text-green-600 text-xl" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-700">Enrolled Clients</h2>
            <p className="text-2xl font-bold text-gray-900">{cardsData.enrolledClients}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md flex items-start">
          <div className="bg-yellow-100 p-3 rounded-full mr-4">
            <FaChartLine className="text-yellow-600 text-xl" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-700">Active Programs</h2>
            <p className="text-2xl font-bold text-gray-900">{cardsData.programsWithEnrollments}</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Enrollment Trends</h2>
          <Line data={lineChartData} options={{ responsive: true }} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md text-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Program Distribution</h2>
          <Bar data={barChartData} options={{ responsive: true }} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Client Status</h2>
          <div className="flex justify-center">
            <Doughnut data={doughnutChartData} options={{ responsive: true }} />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                <p className="text-gray-800">{activity.action}</p>
                <p className="text-sm text-gray-500">{activity.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">

        {/* Quick Client List */}
        <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Clients</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Visit</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredClients.slice(0, 5).map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-600">
                            {client.first_name.charAt(0)}{client.last_name.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {client.first_name} {client.last_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {client.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        client.status === "active" ? "bg-green-100 text-green-800" :
                        client.status === "high-risk" ? "bg-red-100 text-red-800" :
                        "bg-yellow-100 text-yellow-800"
                      }`}>
                        {client.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {client.last_visit ? new Date(client.last_visit).toLocaleDateString() : 'Never'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
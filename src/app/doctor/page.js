"use client";

import { useState, useEffect } from "react";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title as ChartTitle, Tooltip, Legend, ArcElement } from "chart.js";
import { FaUsers, FaNotesMedical, FaChartLine, FaClock, FaSearch, FaCalendarAlt } from "react-icons/fa";

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ChartTitle, Tooltip, Legend, ArcElement);

export default function DoctorDashboard() {
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Sample health programs data
  const healthPrograms = ["TB Program", "Malaria Program", "HIV Program", "Diabetes Program", "Hypertension Program"];

  // Sample clients data
  const [clients, setClients] = useState([
    { id: 1, name: "John Doe", enrolledPrograms: ["TB Program", "HIV Program"], status: "active" },
    { id: 2, name: "Jane Smith", enrolledPrograms: ["Malaria Program"], status: "active" },
    { id: 3, name: "Robert Johnson", enrolledPrograms: [], status: "inactive" },
    { id: 4, name: "Emily Davis", enrolledPrograms: ["Diabetes Program"], status: "high-risk" },
    { id: 5, name: "Michael Brown", enrolledPrograms: ["Hypertension Program"], status: "active" },
  ]);

  // Filtered clients based on search
  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.enrolledPrograms.some(program =>
      program.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

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
    totalClients: 0,
    activePrograms: 0,
    enrollmentsThisMonth: 0,
    pendingFollowups: 0,
  });

  // Recent activity
  const [recentActivity, setRecentActivity] = useState([
    { action: "Dr. Smith enrolled John Doe in Malaria Program", time: "2 hours ago" },
    { action: "New client Robert Johnson registered", time: "4 hours ago" },
    { action: "Dr. Smith updated Jane Smith's treatment plan", time: "1 day ago" },
    { action: "Emily Davis marked as high-risk", time: "2 days ago" },
  ]);

  // Upcoming appointments
  const [upcomingAppointments, setUpcomingAppointments] = useState([
    { client: "John Doe", program: "TB Program", date: "Today, 2:00 PM" },
    { client: "Jane Smith", program: "Malaria Program", date: "Tomorrow, 10:00 AM" },
  ]);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      // Simulate data loading
      updateCharts();
      updateCardsData();
      setLoading(false);
    }, 1000);
  }, []);

  const updateCharts = () => {
    updateLineChart();
    updateBarChart();
    updateDoughnutChart();
  };

  const updateLineChart = () => {
    const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    const enrollments = [15, 22, 18, 30, 25, 20]; // Example enrollment data

    setLineChartData({
      labels,
      datasets: [{
        label: "Monthly Enrollments",
        data: enrollments,
        borderColor: "#4F46E5",
        backgroundColor: "#6366F1",
        tension: 0.3,
      }]
    });
  };

  const updateBarChart = () => {
    // Count clients in each program
    const programCounts = healthPrograms.map(program => 
      clients.filter(client => client.enrolledPrograms.includes(program)).length
    );

    setBarChartData({
      labels: healthPrograms,
      datasets: [{
        label: "Clients per Program",
        data: programCounts,
        backgroundColor: ["#6366F1", "#EC4899", "#F59E0B", "#10B981", "#3B82F6"],
      }]
    });
  };

  const updateDoughnutChart = () => {
    const active = clients.filter(c => c.status === "active").length;
    const inactive = clients.filter(c => c.status === "inactive").length;
    const highRisk = clients.filter(c => c.status === "high-risk").length;

    setDoughnutChartData({
      labels: ["Active", "Inactive", "High-risk"],
      datasets: [{
        data: [active, inactive, highRisk],
        backgroundColor: ["#4CAF50", "#FFC107", "#F44336"],
      }]
    });
  };

  const updateCardsData = () => {
    setCardsData({
      totalClients: clients.length,
      activePrograms: healthPrograms.length,
      enrollmentsThisMonth: 15, // Example data
      pendingFollowups: clients.filter(c => c.status === "high-risk").length,
    });
  };

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

      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaSearch className="text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Search clients or programs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md flex items-start">
          <div className="bg-blue-100 p-3 rounded-full mr-4">
            <FaUsers className="text-blue-600 text-xl" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-700">Total Clients</h2>
            <p className="text-2xl font-bold text-gray-900">{cardsData.totalClients}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md flex items-start">
          <div className="bg-purple-100 p-3 rounded-full mr-4">
            <FaNotesMedical className="text-purple-600 text-xl" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-700">Active Programs</h2>
            <p className="text-2xl font-bold text-gray-900">{cardsData.activePrograms}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md flex items-start">
          <div className="bg-green-100 p-3 rounded-full mr-4">
            <FaChartLine className="text-green-600 text-xl" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-700">Enrollments This Month</h2>
            <p className="text-2xl font-bold text-gray-900">{cardsData.enrollmentsThisMonth}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md flex items-start">
          <div className="bg-yellow-100 p-3 rounded-full mr-4">
            <FaClock className="text-yellow-600 text-xl" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-700">Pending Follow-ups</h2>
            <p className="text-2xl font-bold text-gray-900">{cardsData.pendingFollowups}</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Monthly Enrollments</h2>
          <Line data={lineChartData} options={{ responsive: true }} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Program Distribution</h2>
          <Bar data={barChartData} options={{ responsive: true }} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Client Status</h2>
          <div className="flex justify-center">
            <Doughnut data={doughnutChartData} options={{ responsive: true }} />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Appointments */}
        <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-1">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <FaCalendarAlt className="mr-2 text-blue-500" />
            Upcoming Appointments
          </h2>
          <div className="space-y-4">
            {upcomingAppointments.map((appointment, index) => (
              <div key={index} className="border rounded-lg p-3 hover:bg-gray-50">
                <h3 className="font-medium text-gray-900">{appointment.client}</h3>
                <p className="text-sm text-gray-600">{appointment.program}</p>
                <p className="text-sm text-blue-600 font-medium">{appointment.date}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Client List */}
        <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Clients</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Programs</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredClients.slice(0, 5).map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{client.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {client.enrolledPrograms.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {client.enrolledPrograms.map((program, i) => (
                            <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              {program}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400">Not enrolled</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        client.status === "active" ? "bg-green-100 text-green-800" :
                        client.status === "high-risk" ? "bg-red-100 text-red-800" :
                        "bg-yellow-100 text-yellow-800"
                      }`}>
                        {client.status}
                      </span>
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
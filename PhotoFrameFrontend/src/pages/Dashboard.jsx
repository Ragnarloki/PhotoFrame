import { useState, useEffect, useContext } from "react";
import {
  FaUsers,
  FaBox,
  FaShoppingCart,
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
  FaBell,
  FaSun,
  FaMoon,
  FaChartBar,
  FaMoneyBillAlt,
} from "react-icons/fa";
import { Line, Pie, Bar } from "react-chartjs-2";
import axios from "axios";
import API_URL, { deleteProduct, fetchProducts } from "../api";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from "chart.js";
import { motion } from "framer-motion";
import {  FaCheck } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { GlobalContext } from "../components/context/GlobalContext";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);



const cardVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};


const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const { user } = useContext(GlobalContext);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();



  const [searchQuerys, setSearchQuerys] = useState("");
  const [productToDelete, setProductToDelete] = useState(null);
  
  const [isDeleting, setIsDeleting] = useState(false);

  // Filter products based on search query
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  // Handle delete confirmation
  const handleDelete = (productId) => {
    setProductToDelete(productId);
  };

  // const confirmDelete = async () => {
  //   if (!productToDelete) return;

  //   setIsDeleting(true);
  //   try {
  //     await deleteProduct(productToDelete, token);
     console.log("Product deleted successfully:", productToDelete);

  //     fetchProducts(); // Refresh product list after deletion
  //   } catch (error) {
  //     console.error("Error deleting product:", error);
  //   } finally {
  //     setIsDeleting(false);
  //     setProductToDelete(null);
  //   }
  // };
  const confirmDelete = async () => {
    if (!productToDelete) return;

    // ✅ Get token from localStorage or context
    const token = user?.token || localStorage.getItem("token");
    if (!token) {
      console.error("Error: No token found");
      return;
    }

    setIsDeleting(true);
    try {
      await deleteProduct(productToDelete, token);
      console.log("Product deleted successfully:", productToDelete);

      // ✅ Reload the page after successful deletion
      window.location.reload();

    } catch (error) {
      console.error("Error deleting product:", error);
    } finally {
      setIsDeleting(false);
      setProductToDelete(null);
    }
  };

useEffect(() => {
  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/orders`);
      
      // Get the current timestamp
      const now = new Date();

      // Filter orders from the last 20 minutes
      const newNotifications = response.data
        .filter(order => {
          const orderTime = new Date(order.createdAt);
          return (now - orderTime) / (1000 * 60) <= 20; // Check if within 20 minutes
        })
        .map(order => ({
          id: order._id,
          message: `New order from ${order.name} for ${order.productName}`,
          timestamp: new Date(order.createdAt).toLocaleString(),
        }));

      setNotifications(newNotifications);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  fetchOrders();

  // Poll every 30 seconds for new orders
  const interval = setInterval(fetchOrders, 30000);
  return () => clearInterval(interval);
}, []);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Mark a notification as read
  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  // Clear all notifications
  const clearAll = () => {
    setNotifications([]);
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
  };


  // Dummy data for income/expense
  const incomeExpenseData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "Income",
        data: [5000, 6000, 7000, 8000, 9000, 10000, 11000],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
      },
      {
        label: "Expenses",
        data: [3000, 4000, 3500, 4500, 5000, 5500, 6000],
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgba(255, 99, 132, 1)",
      },
    ],
  };




  useEffect(() => {
    // Fetch users
    axios.get(`${API_URL}/api/auth/users`)
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Error fetching users:", err));

    // Fetch products
    axios.get(`${API_URL}/api/products`)
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Error fetching products:", err));

    // Fetch orders
    axios.get(`${API_URL}/api/orders`)
      .then((res) => setOrders(res.data))
      .catch((err) => console.error("Error fetching orders:", err));
  }, []);

  // Filter orders based on search query
  const filteredOrders = orders.filter((order) =>
    order.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Data for the line chart (order trends)
  const orderTrendsData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "Orders",
        data: [65, 59, 80, 81, 56, 55, 40],
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4,
      },
    ],
  };

  

  // Data for the pie chart (order status distribution)
  const orderStatusData = {
    labels: ["Completed", "Pending", "Cancelled"],
    datasets: [
      {
        data: [65, 15, 20],
        backgroundColor: ["#10B981", "#FBBF24", "#EF4444"],
        hoverBackgroundColor: ["#059669", "#F59E0B", "#DC2626"],
      },
    ],
  };

  // Animation variants for cards
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className={`p-6 min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gradient-to-br from-gray-50 to-gray-200"}`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            {darkMode ? <FaSun className="text-yellow-500" /> : <FaMoon className="text-gray-700" />}
          </button>
          <div>
     {/* Notification Icon */}
<div className="relative">
  {/* Notification Bell Icon */}
  <div
    className={`relative ${notifications.length === 0 ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
    onClick={() => notifications.length > 0 && toggleDropdown()} // Prevent toggle if empty
  >
    <FaBell className="text-2xl hover:text-blue-500 transition-colors" />
    {notifications.length > 0 && (
      <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">
        {notifications.length}
      </span>
    )}
  </div>

  {/* Notification Dropdown */}
  {isDropdownOpen && notifications.length > 0 && (
    <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg p-2 z-10">
      {/* Dropdown Header */}
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-sm">Notifications</h3>
        <div className="flex space-x-2">
          <button
            onClick={markAllAsRead}
            className="p-1 hover:bg-gray-100 rounded-full"
            title="Mark all as read"
          >
            <FaCheck className="text-sm text-green-500" />
          </button>
          <button
            onClick={clearAll}
            className="p-1 hover:bg-gray-100 rounded-full"
            title="Clear all"
          >
            <FaTrash className="text-sm text-red-500" />
          </button>
        </div>
      </div>

      {/* Notification List */}
      <div className="max-h-64 overflow-y-auto">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-2 border-b text-sm ${
              notification.read ? "bg-gray-50" : "bg-white"
            }`}
          >
            <p>{notification.message}</p>
            <span className="text-gray-400 text-xs">
              {notification.timestamp}
            </span>
            {!notification.read && (
              <button
                onClick={() => markAsRead(notification.id)}
                className="mt-1 text-xs text-blue-500 hover:underline"
              >
                Mark as read
              </button>
            )}
          </div>
        ))}
      </div>

      {/* View All Link */}
      {/* <div className="mt-2 text-center">
        <a
          href="/notifications"
          className="text-sm text-blue-500 hover:underline"
        >
          View All
        </a>
      </div> */}
    </div>
  )}
</div>

    </div>

    
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Users Card */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className={`p-6 rounded-lg shadow-lg flex items-center justify-between ${
            darkMode ? "bg-gray-800" : "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
          }`}
        >
          <FaUsers className="text-4xl" />
          <div>
            <h3 className="text-lg font-semibold">Total Users</h3>
            <p className="text-2xl font-bold">{users.length}</p>
          </div>
        </motion.div>

        {/* Products Card */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className={`p-6 rounded-lg shadow-lg flex items-center justify-between ${
            darkMode ? "bg-gray-800" : "bg-gradient-to-r from-green-500 to-green-600 text-white"
          }`}
        >
          <FaBox className="text-4xl" />
          <div>
            <h3 className="text-lg font-semibold">Total Products</h3>
            <p className="text-2xl font-bold">{products.length}</p>
          </div>
        </motion.div>

        {/* Orders Card */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className={`p-6 rounded-lg shadow-lg flex items-center justify-between ${
            darkMode ? "bg-gray-800" : "bg-gradient-to-r from-red-500 to-red-600 text-white"
          }`}
        >
          <FaShoppingCart className="text-4xl" />
          <div>
            <h3 className="text-lg font-semibold">Total Orders</h3>
            <p className="text-2xl font-bold">{orders.length}</p>
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Order Trends Line Chart */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className={`p-6 rounded-lg shadow-lg h-[350px] ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <h3 className="text-lg font-semibold mb-4">Order Trends</h3>
          <div className="h-[300px]">
            <Line
              data={orderTrendsData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
        </motion.div>

        {/* Order Status Pie Chart */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className={`p-6 rounded-lg shadow-lg h-[350px] ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <h3 className="text-lg font-semibold mb-4">Order Status Distribution</h3>
          <div className="h-[300px] flex justify-center items-center">
            <Pie
              data={orderStatusData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: "bottom" },
                },
              }}
            />
          </div>
        </motion.div>
      </div>

      {/* Income/Expense Bar Chart */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className={`p-6 rounded-lg shadow-lg mb-8 ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <h3 className="text-lg font-semibold mb-4">Income vs Expenses</h3>
        <div className="h-[300px]">
          <Bar
            data={incomeExpenseData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: "top" },
              },
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
        </div>
      </motion.div>

      {/* Recent Orders Section */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className={`overflow-scroll md:overflow-hidden p-6 rounded-lg shadow-lg mb-8 ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Recent Orders</h3>
          <div className="relative">
            <input
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        <table className="w-full border-collapse">
          <thead>
            <tr className={`${darkMode ? "bg-gray-700" : "bg-gray-200"}`}>
              <th className="p-3 text-left">Customer</th>
              <th className="p-3 text-left">Product</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-left">Payment</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.slice(0, 5).map((order, index) => (
              <tr
                key={index}
                className={`border-b ${
                  darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
                }`}
              >
                <td className="p-3">{order.name}</td>
                <td className="p-3">{order.productName}</td>
                <td className="p-3">{order.price}</td>
                <td className="p-3">{order.paymentMethod}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      order.status === "Completed"
                        ? "bg-green-100 text-green-700"
                        : order.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {/* Notifications Section */}
      {/* <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className={`p-6 rounded-lg shadow-lg mb-8 ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <h3 className="text-lg font-semibold mb-4">Notifications</h3>
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-3 rounded-lg ${
                darkMode ? "bg-gray-700" : "bg-gray-100"
              }`}
            >
              <p className="font-semibold">{notification.message}</p>
              <p className="text-sm text-gray-500">{notification.timestamp}</p>
            </div>
          ))}
        </div>
      </motion.div> */}

      {/* Quick Actions Section */}
      <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.5 } }}
      className={`p-6 rounded-lg shadow-lg ${
        darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      }`}
    >
      {/* Title */}
      <h3 className="text-lg font-semibold mb-4 text-center md:text-left">
        Quick Actions
      </h3>

      {/* Grid Layout for Buttons & Product List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Add Product Button */}
        <Link to="/upload" className="w-full">
          <button
            className={`flex items-center justify-center w-full p-4 rounded-lg transition ${
              darkMode
                ? "bg-blue-700 text-white hover:bg-blue-600"
                : "bg-blue-100 text-blue-700 hover:bg-blue-200"
            }`}
          >
            <FaPlus className="mr-2" /> Add Product
          </button>
        </Link>

        {/* Search Bar */}
        <div className="relative sm:col-span-2 lg:col-span-1">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
              darkMode
                ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500"
                : "border-gray-300 focus:ring-blue-500"
            }`}
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>

        {/* Product List Section */}
        <div className="sm:col-span-2 lg:col-span-3 w-full">
          <div
            className={`overflow-y-auto max-h-60 p-2 border rounded-lg shadow-inner ${
              darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"
            }`}
          >
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div
                  key={product._id}
                  className={`p-4 mb-3 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center ${
                    darkMode ? "bg-gray-600" : "bg-gray-100"
                  }`}
                >
                  {/* Product Info */}
                  <div className="mb-2 sm:mb-0">
                    <h2 className="text-lg font-bold">{product.name}</h2>
                    <p className="text-sm">{product.description}</p>
                    <p className="text-green-600 font-semibold">
                      ${product.price}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {/* Edit Product Button */}
                    <button
                      className={`flex items-center justify-center p-3 rounded-lg transition ${
                        darkMode
                          ? "bg-green-600 text-white hover:bg-green-500"
                          : "bg-green-100 text-green-700 hover:bg-green-200"
                      }`}
                      onClick={() => navigate(`/edit/${product._id}`)}
                    >
                      <FaEdit className="mr-2" /> Edit
                    </button>

                    {/* Delete Product Button */}
                    <button
                      className={`flex items-center justify-center p-3 rounded-lg transition ${
                        darkMode
                          ? "bg-red-600 text-white hover:bg-red-500"
                          : "bg-red-100 text-red-700 hover:bg-red-200"
                      }`}
                      onClick={() => handleDelete(product._id)}
                    >
                      <FaTrash className="mr-2" /> Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">No products found.</p>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div
            className={`p-6 rounded-lg shadow-lg ${
              darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
            }`}
          >
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p>Are you sure you want to delete this product?</p>
            <div className="flex justify-end mt-4 space-x-2">
              <button
                onClick={() => setProductToDelete(null)}
                className={`px-4 py-2 rounded-lg transition ${
                  darkMode
                    ? "bg-gray-600 text-white hover:bg-gray-500"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className={`px-4 py-2 rounded-lg transition ${
                  darkMode
                    ? "bg-red-600 text-white hover:bg-red-500"
                    : "bg-red-100 text-red-700 hover:bg-red-200"
                }`}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
    </div>
  );
};

export default Dashboard;
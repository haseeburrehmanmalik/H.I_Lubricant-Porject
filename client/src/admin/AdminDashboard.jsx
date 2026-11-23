import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  ShoppingBag,
  Clock,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  Plus,
  RefreshCw,
  Eye,
  Sliders,
  DollarSign,
  Layers,
} from 'lucide-react';
import { adminService } from '../services/adminService';
import { orderService } from '../services/orderService';

const AdminDashboard = () => {
  const [summary, setSummary] = useState(null);
  const [sales, setSales] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockAlerts, setLowStockAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusUpdating, setStatusUpdating] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [sumRes, salesRes, actRes] = await Promise.all([
        adminService.getDashboardSummary(),
        adminService.getSalesChart(),
        adminService.getRecentActivity(),
      ]);

      if (sumRes.success) setSummary(sumRes.summary || sumRes.metrics);
      if (salesRes.success) setSales(salesRes.sales || salesRes.chartData || []);
      if (actRes.success) {
        setRecentOrders(actRes.recentOrders || actRes.orders || []);
        setLowStockAlerts(actRes.lowStockAlerts || []);
      }
    } catch (err) {
      console.error('Failed to load dashboard metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleQuickStatusChange = async (orderId, newStatus) => {
    setStatusUpdating(orderId);
    try {
      const res = await orderService.updateOrderStatus(orderId, { status: newStatus });
      if (res.success) {
        // Refresh recent orders and summary
        await fetchDashboardData();
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setStatusUpdating(null);
    }
  };

  if (loading && !summary) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-48 bg-[#141414] rounded-lg animate-pulse"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-28 rounded-2xl bg-[#141414] animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  // Find max revenue for chart scaling
  const maxRevenue = Math.max(...sales.map((s) => s.revenue), 10000);

  return (
    <div className="space-y-8">
      {/* Header & Quick Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#292722]">
        <div>
          <h1 className="text-2xl font-extrabold text-[#F5F2EA] tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs text-[#A5A19A] mt-1">
            Real-time business performance, inventory alerts, and order metrics from MongoDB.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchDashboardData}
            className="p-2 rounded-xl bg-[#141414] border border-[#292722] hover:border-[#D7AD55] text-[#A5A19A] hover:text-[#D7AD55] transition-colors"
            title="Refresh Real-time Metrics"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>

          <Link
            to="/admin/products"
            className="px-4 py-2 rounded-xl btn-gold text-xs font-bold flex items-center space-x-1.5 shadow-gold-sm"
          >
            <Plus size={14} />
            <span>Add New Product</span>
          </Link>
        </div>
      </div>

      {/* 8 REAL KPI STATISTIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="p-5 rounded-2xl bg-[#141414] border border-[#292722] space-y-2">
          <div className="flex items-center justify-between text-xs text-[#A5A19A]">
            <span className="font-semibold uppercase tracking-wider">Total Sales Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-[#D7AD55]/15 border border-[#D7AD55]/30 flex items-center justify-center text-[#D7AD55]">
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#D7AD55]">
            Rs. {(summary?.totalRevenue || 0).toLocaleString()}
          </div>
          <div className="text-[11px] text-[#A5A19A]">From confirmed & completed orders</div>
        </div>

        {/* Total Orders */}
        <div className="p-5 rounded-2xl bg-[#141414] border border-[#292722] space-y-2">
          <div className="flex items-center justify-between text-xs text-[#A5A19A]">
            <span className="font-semibold uppercase tracking-wider">Total Orders</span>
            <div className="w-8 h-8 rounded-lg bg-[#191919] border border-[#292722] flex items-center justify-center text-[#F5F2EA]">
              <ShoppingBag size={16} />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#F5F2EA]">
            {summary?.totalOrders || 0}
          </div>
          <div className="text-[11px] text-[#A5A19A]">Lifetime recorded orders</div>
        </div>

        {/* Pending Orders */}
        <div className="p-5 rounded-2xl bg-[#141414] border border-[#292722] space-y-2">
          <div className="flex items-center justify-between text-xs text-[#A5A19A]">
            <span className="font-semibold uppercase tracking-wider">Pending Orders</span>
            <div className="w-8 h-8 rounded-lg bg-amber-950/40 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Clock size={16} />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-amber-400">
            {summary?.pendingOrders || 0}
          </div>
          <div className="text-[11px] text-[#A5A19A]">Awaiting admin dispatch/confirmation</div>
        </div>

        {/* Confirmed & Completed */}
        <div className="p-5 rounded-2xl bg-[#141414] border border-[#292722] space-y-2">
          <div className="flex items-center justify-between text-xs text-[#A5A19A]">
            <span className="font-semibold uppercase tracking-wider">Completed Orders</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-400">
            {summary?.completedOrders || 0}
          </div>
          <div className="text-[11px] text-[#A5A19A]">
            {summary?.confirmedOrders || 0} currently in confirmation
          </div>
        </div>

        {/* Cancelled Orders */}
        <div className="p-5 rounded-2xl bg-[#141414] border border-[#292722] space-y-2">
          <div className="flex items-center justify-between text-xs text-[#A5A19A]">
            <span className="font-semibold uppercase tracking-wider">Cancelled Orders</span>
            <div className="w-8 h-8 rounded-lg bg-red-950/40 border border-red-500/30 flex items-center justify-center text-red-400">
              <AlertTriangle size={16} />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-red-400">
            {summary?.cancelledOrders || 0}
          </div>
          <div className="text-[11px] text-[#A5A19A]">Stock automatically restored</div>
        </div>

        {/* Active Products */}
        <div className="p-5 rounded-2xl bg-[#141414] border border-[#292722] space-y-2">
          <div className="flex items-center justify-between text-xs text-[#A5A19A]">
            <span className="font-semibold uppercase tracking-wider">Active Products</span>
            <div className="w-8 h-8 rounded-lg bg-[#191919] border border-[#292722] flex items-center justify-center text-[#D7AD55]">
              <Package size={16} />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#F5F2EA]">
            {summary?.totalProducts || 0}
          </div>
          <div className="text-[11px] text-[#A5A19A]">
            {summary?.allProductsCount || 0} total catalog items
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="p-5 rounded-2xl bg-[#141414] border border-[#292722] space-y-2">
          <div className="flex items-center justify-between text-xs text-[#A5A19A]">
            <span className="font-semibold uppercase tracking-wider">Low Stock SKUs</span>
            <div className="w-8 h-8 rounded-lg bg-amber-950/40 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Layers size={16} />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-amber-400">
            {summary?.lowStockProducts || 0}
          </div>
          <div className="text-[11px] text-[#A5A19A]">Stock ≤ threshold (needs restock)</div>
        </div>

        {/* Out of Stock */}
        <div className="p-5 rounded-2xl bg-[#141414] border border-[#292722] space-y-2">
          <div className="flex items-center justify-between text-xs text-[#A5A19A]">
            <span className="font-semibold uppercase tracking-wider">Out of Stock</span>
            <div className="w-8 h-8 rounded-lg bg-red-950/40 border border-red-500/30 flex items-center justify-center text-red-400">
              <AlertTriangle size={16} />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-red-400">
            {summary?.outOfStockProducts || 0}
          </div>
          <div className="text-[11px] text-[#A5A19A]">0 available units</div>
        </div>
      </div>

      {/* SALES REVENUE CHART & ORDER BREAKDOWN */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart (2 cols) */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#141414] border border-[#292722] space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#292722]">
            <div>
              <h2 className="text-sm font-bold text-[#F5F2EA]">Sales Revenue Velocity (PKR)</h2>
              <p className="text-[11px] text-[#A5A19A]">Daily aggregated order value</p>
            </div>
            <span className="text-xs text-[#D7AD55] font-semibold">MongoDB Aggregation</span>
          </div>

          {/* SVG Bar Chart */}
          <div className="h-56 w-full flex items-end gap-3 pt-6 pb-2 px-2 border-b border-[#292722]">
            {sales.length > 0 ? (
              sales.map((item, idx) => {
                const heightPercent = Math.max(8, Math.round((item.revenue / maxRevenue) * 100));
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-[#D7AD55] font-bold">
                      Rs. {item.revenue.toLocaleString()}
                    </div>
                    <div
                      className="w-full rounded-t-md bg-gradient-to-t from-[#D7AD55] to-[#F2D28A] group-hover:brightness-125 transition-all"
                      style={{ height: `${heightPercent}%` }}
                    ></div>
                    <span className="text-[10px] text-[#A5A19A] truncate w-full text-center">
                      {item.date?.slice(5)}
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-[#A5A19A]">
                No sales recorded in the current timeframe
              </div>
            )}
          </div>
        </div>

        {/* Order Status Breakdown (1 col) */}
        <div className="p-6 rounded-2xl bg-[#141414] border border-[#292722] space-y-5">
          <h2 className="text-sm font-bold text-[#F5F2EA] pb-3 border-b border-[#292722]">
            Order Status Distribution
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[#A5A19A] flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                <span>Pending</span>
              </span>
              <strong className="text-[#F5F2EA]">{summary?.pendingOrders || 0}</strong>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#A5A19A] flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-400"></span>
                <span>Confirmed</span>
              </span>
              <strong className="text-[#F5F2EA]">{summary?.confirmedOrders || 0}</strong>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#A5A19A] flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-400"></span>
                <span>Processing</span>
              </span>
              <strong className="text-[#F5F2EA]">{summary?.processingOrders || 0}</strong>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#A5A19A] flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                <span>Completed</span>
              </span>
              <strong className="text-[#F5F2EA]">{summary?.completedOrders || 0}</strong>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#A5A19A] flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
                <span>Cancelled</span>
              </span>
              <strong className="text-[#F5F2EA]">{summary?.cancelledOrders || 0}</strong>
            </div>
          </div>

          <div className="pt-4 border-t border-[#292722]">
            <Link
              to="/admin/orders"
              className="w-full py-2.5 rounded-xl bg-[#191919] border border-[#292722] hover:border-[#D7AD55] text-xs font-semibold text-[#D7AD55] flex items-center justify-center space-x-1.5 transition-colors"
            >
              <span>Manage All Orders</span>
              <ArrowUpRight size={13} />
            </Link>
          </div>
        </div>
      </div>

      {/* RECENT ORDERS TABLE & LOW STOCK ALERTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Recent Orders (2 cols) */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#141414] border border-[#292722] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#292722]">
            <h2 className="text-sm font-bold text-[#F5F2EA]">Recent Customer Orders</h2>
            <Link to="/admin/orders" className="text-xs text-[#D7AD55] hover:underline">
              View All
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#292722] text-[#A5A19A]">
                  <th className="pb-2 font-semibold">Order #</th>
                  <th className="pb-2 font-semibold">Customer</th>
                  <th className="pb-2 font-semibold">Total Amount</th>
                  <th className="pb-2 font-semibold">Status</th>
                  <th className="pb-2 font-semibold text-right">Quick Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#292722]/60">
                {recentOrders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-[#191919]/50 transition-colors">
                    <td className="py-3 font-bold text-[#D7AD55]">{ord.orderNumber}</td>
                    <td className="py-3 text-[#F5F2EA]">
                      <div>{ord.customer?.name}</div>
                      <div className="text-[10px] text-[#A5A19A]">{ord.customer?.phone}</div>
                    </td>
                    <td className="py-3 font-extrabold text-[#F5F2EA]">
                      Rs. {(ord.total ?? ord.totalAmount ?? 0).toLocaleString()}
                    </td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          (ord.orderStatus || ord.status) === 'Completed' || (ord.orderStatus || ord.status) === 'Delivered'
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                            : (ord.orderStatus || ord.status) === 'Pending'
                            ? 'bg-amber-950/60 text-amber-400 border border-amber-500/30'
                            : (ord.orderStatus || ord.status) === 'Cancelled'
                            ? 'bg-red-950/60 text-red-400 border border-red-500/30'
                            : 'bg-blue-950/60 text-blue-400 border border-blue-500/30'
                        }`}
                      >
                        {ord.orderStatus || ord.status || 'Pending'}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <select
                        value={ord.orderStatus || ord.status || 'Pending'}
                        disabled={statusUpdating === ord._id}
                        onChange={(e) => handleQuickStatusChange(ord._id, e.target.value)}
                        className="px-2 py-1 rounded bg-[#191919] border border-[#292722] text-[11px] text-[#F5F2EA] focus:outline-none focus:border-[#D7AD55]"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Processing">Processing</option>
                        <option value="Completed">Completed</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts (1 col) */}
        <div className="p-6 rounded-2xl bg-[#141414] border border-[#292722] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#292722]">
            <h2 className="text-sm font-bold text-[#F5F2EA] flex items-center space-x-1.5">
              <AlertTriangle size={15} className="text-amber-400" />
              <span>Low Stock Alerts</span>
            </h2>
            <Link to="/admin/inventory" className="text-xs text-[#D7AD55] hover:underline">
              Inventory
            </Link>
          </div>

          <div className="space-y-3">
            {lowStockAlerts.length > 0 ? (
              lowStockAlerts.map((prod) => (
                <div
                  key={prod._id}
                  className="p-3 rounded-xl bg-[#191919] border border-[#292722] flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="font-semibold text-[#F5F2EA] line-clamp-1">{prod.name}</div>
                    <div className="text-[11px] text-[#A5A19A]">
                      {prod.brand} • {prod.viscosity}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="px-2 py-0.5 rounded bg-amber-950/60 border border-amber-500/40 text-amber-400 font-bold text-[11px]">
                      {prod.stock} left
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-xs text-[#A5A19A] text-center py-6">
                All lubricant stock levels are currently healthy!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

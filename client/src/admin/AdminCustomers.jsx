import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Phone,
  Mail,
  MapPin,
  ShoppingBag,
  Eye,
  X,
  ExternalLink,
} from 'lucide-react';
import { adminService } from '../services/adminService';

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Customer Orders Modal
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerOrders, setCustomerOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await adminService.getCustomers({
        search: search.trim() || undefined,
        limit: 30,
      });
      if (res.success) {
        setCustomers(res.customers || []);
        setTotal(res.total || 0);
      }
    } catch (err) {
      console.error('Failed to fetch customers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [search]);

  const handleViewCustomer = async (cust) => {
    setSelectedCustomer(cust);
    setLoadingOrders(true);
    try {
      const res = await adminService.getCustomerById(cust._id);
      if (res.success) {
        setCustomerOrders(res.orders || []);
      }
    } catch (err) {
      console.error('Failed to load customer orders:', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#292722]">
        <div>
          <h1 className="text-2xl font-extrabold text-[#F5F2EA] tracking-tight">
            Customer Directory
          </h1>
          <p className="text-xs text-[#A5A19A] mt-1">
            Aggregated client records, order frequency, and total purchasing metrics ({total} customers).
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-xl bg-[#141414] border border-[#292722] flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A5A19A]" size={15} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer name, phone, city..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#191919] border border-[#292722] text-xs text-[#F5F2EA] placeholder-[#A5A19A] focus:outline-none focus:border-[#D7AD55]"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="rounded-2xl bg-[#141414] border border-[#292722] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#292722] bg-[#191919] text-[#A5A19A]">
                <th className="py-3 px-4 font-semibold">Customer Name</th>
                <th className="py-3 px-4 font-semibold">Contact Phone</th>
                <th className="py-3 px-4 font-semibold">City / Location</th>
                <th className="py-3 px-4 font-semibold">Total Orders</th>
                <th className="py-3 px-4 font-semibold">Total Spent (PKR)</th>
                <th className="py-3 px-4 font-semibold">Last Order Date</th>
                <th className="py-3 px-4 font-semibold text-right">Order History</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#292722]/60">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-[#A5A19A]">
                    Loading customer database...
                  </td>
                </tr>
              ) : customers.length > 0 ? (
                customers.map((c) => (
                  <tr key={c._id} className="hover:bg-[#191919]/50 transition-colors">
                    <td className="py-3 px-4 font-bold text-[#F5F2EA]">
                      <div>{c.name}</div>
                      {c.email && <div className="text-[10px] text-[#A5A19A]">{c.email}</div>}
                    </td>

                    <td className="py-3 px-4 font-semibold text-[#D7AD55]">
                      <a href={`tel:${c.phone}`} className="hover:underline">
                        {c.phone}
                      </a>
                    </td>

                    <td className="py-3 px-4 text-[#A5A19A]">
                      <span className="text-[#F5F2EA]">{c.city}: </span>
                      {c.address}
                    </td>

                    <td className="py-3 px-4 font-extrabold text-[#F5F2EA]">
                      {c.totalOrders || 0} orders
                    </td>

                    <td className="py-3 px-4 font-extrabold text-[#D7AD55]">
                      Rs. {(c.totalSpent || 0).toLocaleString()}
                    </td>

                    <td className="py-3 px-4 text-[11px] text-[#A5A19A]">
                      {c.lastOrderDate ? new Date(c.lastOrderDate).toLocaleDateString() : '—'}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleViewCustomer(c)}
                        className="px-3 py-1.5 rounded-lg bg-[#191919] border border-[#292722] hover:border-[#D7AD55] text-xs font-semibold text-[#F5F2EA] hover:text-[#D7AD55] transition-colors inline-flex items-center space-x-1"
                      >
                        <Eye size={12} />
                        <span>View Orders</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-[#A5A19A]">
                    No customer records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CUSTOMER ORDER HISTORY MODAL */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-[#141414] border border-[#292722] rounded-3xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#292722]">
              <div>
                <span className="text-xs uppercase tracking-wider font-bold text-[#A5A19A]">
                  Client Purchase History
                </span>
                <h2 className="text-lg font-extrabold text-[#D7AD55]">
                  {selectedCustomer.name} ({selectedCustomer.phone})
                </h2>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="text-[#A5A19A] hover:text-[#F5F2EA]"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-[#191919] border border-[#292722] grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[#A5A19A] block">Total Orders Placed:</span>
                <strong className="text-[#F5F2EA] text-sm">
                  {selectedCustomer.totalOrders} orders
                </strong>
              </div>
              <div>
                <span className="text-[#A5A19A] block">Lifetime Value (PKR):</span>
                <strong className="text-[#D7AD55] text-sm">
                  Rs. {selectedCustomer.totalSpent.toLocaleString()}
                </strong>
              </div>
            </div>

            {/* Orders List */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#F5F2EA]">
                Orders on Record ({customerOrders.length})
              </h3>

              {loadingOrders ? (
                <div className="py-8 text-center text-xs text-[#A5A19A]">Loading orders...</div>
              ) : customerOrders.length > 0 ? (
                <div className="space-y-2">
                  {customerOrders.map((ord) => (
                    <div
                      key={ord._id}
                      className="p-3.5 rounded-xl bg-[#191919] border border-[#292722] flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="font-bold text-[#D7AD55]">{ord.orderNumber}</div>
                        <div className="text-[11px] text-[#A5A19A]">
                          {new Date(ord.createdAt).toLocaleDateString()} • {ord.items?.length} items
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-extrabold text-[#F5F2EA]">
                          Rs. {ord.total.toLocaleString()}
                        </div>
                        <span className="text-[10px] font-bold text-[#D7AD55]">
                          {ord.orderStatus}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-xs text-[#A5A19A]">
                  No orders found for this customer.
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-6 py-2.5 rounded-xl btn-gold text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCustomers;

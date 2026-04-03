"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Loader2,
  Plus,
  X,
  ToggleLeft,
  ToggleRight,
  Trash2,
  Shuffle,
} from "lucide-react";

interface Coupon {
  id: string;
  code: string;
  discount: number;
  maxUses: number;
  currentUses: number;
  active: boolean;
  expiresAt: string | null;
  createdAt: string;
}

function generateCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "PP-";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formCode, setFormCode] = useState("");
  const [formDiscount, setFormDiscount] = useState("20");
  const [formMaxUses, setFormMaxUses] = useState("0");
  const [formExpiry, setFormExpiry] = useState("");

  const fetchCoupons = useCallback(() => {
    setLoading(true);
    fetch("/api/admin/coupons")
      .then((r) => r.json())
      .then((d) => setCoupons(d.coupons))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  function resetForm() {
    setFormCode("");
    setFormDiscount("20");
    setFormMaxUses("0");
    setFormExpiry("");
    setShowForm(false);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!formCode || !formDiscount) return;
    setSaving(true);
    await fetch("/api/admin/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: formCode,
        discount: formDiscount,
        maxUses: formMaxUses,
        expiresAt: formExpiry || null,
      }),
    });
    setSaving(false);
    resetForm();
    fetchCoupons();
  }

  async function handleToggle(coupon: Coupon) {
    await fetch("/api/admin/coupons", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: coupon.id, active: !coupon.active }),
    });
    fetchCoupons();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this coupon code?")) return;
    await fetch("/api/admin/coupons", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchCoupons();
  }

  function getCouponStatus(coupon: Coupon) {
    if (!coupon.active) return { label: "Inactive", color: "bg-slate-800 text-slate-400" };
    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return { label: "Expired", color: "bg-red-500/10 text-red-400" };
    }
    return { label: "Active", color: "bg-emerald-500/10 text-emerald-400" };
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-100">
          Coupon Management
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-600 text-white text-sm font-medium hover:bg-teal-500 transition"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? "Cancel" : "Create Coupon"}
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <form
          onSubmit={handleCreate}
          className="bg-slate-900 border border-slate-800 rounded-xl p-5 mb-6"
        >
          <h3 className="text-sm font-medium text-slate-300 mb-4">
            New Coupon Code
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Code</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formCode}
                  onChange={(e) => setFormCode(e.target.value.toUpperCase())}
                  placeholder="SAVE20"
                  required
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-teal-500/50"
                />
                <button
                  type="button"
                  onClick={() => setFormCode(generateCode())}
                  className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-200 transition"
                  title="Auto-generate code"
                >
                  <Shuffle className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">
                Discount %
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={formDiscount}
                onChange={(e) => setFormDiscount(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-teal-500/50"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">
                Max Uses (0 = unlimited)
              </label>
              <input
                type="number"
                min="0"
                value={formMaxUses}
                onChange={(e) => setFormMaxUses(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-teal-500/50"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">
                Expiry Date
              </label>
              <input
                type="date"
                value={formExpiry}
                onChange={(e) => setFormExpiry(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-teal-500/50"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-teal-600 text-white text-sm font-medium hover:bg-teal-500 transition disabled:opacity-50"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              Create Coupon
            </button>
          </div>
        </form>
      )}

      {/* Coupons Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left px-4 py-3 text-slate-400 font-medium">
                  Code
                </th>
                <th className="text-left px-4 py-3 text-slate-400 font-medium">
                  Discount
                </th>
                <th className="text-left px-4 py-3 text-slate-400 font-medium">
                  Uses
                </th>
                <th className="text-left px-4 py-3 text-slate-400 font-medium">
                  Status
                </th>
                <th className="text-left px-4 py-3 text-slate-400 font-medium">
                  Expires
                </th>
                <th className="text-left px-4 py-3 text-slate-400 font-medium">
                  Created
                </th>
                <th className="text-right px-4 py-3 text-slate-400 font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-10">
                    <Loader2 className="w-5 h-5 animate-spin text-teal-500 mx-auto" />
                  </td>
                </tr>
              ) : coupons.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-500">
                    No coupons created yet
                  </td>
                </tr>
              ) : (
                coupons.map((coupon, i) => {
                  const status = getCouponStatus(coupon);
                  return (
                    <tr
                      key={coupon.id}
                      className={`border-b border-slate-800 last:border-0 ${
                        i % 2 === 1 ? "bg-slate-800/50" : ""
                      }`}
                    >
                      <td className="px-4 py-3 font-mono text-slate-200">
                        {coupon.code}
                      </td>
                      <td className="px-4 py-3 text-slate-300">
                        {coupon.discount}%
                      </td>
                      <td className="px-4 py-3 text-slate-300">
                        {coupon.currentUses}
                        {coupon.maxUses > 0 ? ` / ${coupon.maxUses}` : " / -"}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${status.color}`}
                        >
                          {status.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-400 text-xs">
                        {coupon.expiresAt
                          ? new Date(coupon.expiresAt).toLocaleDateString()
                          : "Never"}
                      </td>
                      <td className="px-4 py-3 text-slate-400 text-xs">
                        {new Date(coupon.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleToggle(coupon)}
                            className="p-1.5 rounded-md text-slate-400 hover:text-teal-400 hover:bg-teal-500/10 transition"
                            title={coupon.active ? "Deactivate" : "Activate"}
                          >
                            {coupon.active ? (
                              <ToggleRight className="w-5 h-5 text-teal-400" />
                            ) : (
                              <ToggleLeft className="w-5 h-5" />
                            )}
                          </button>
                          <button
                            onClick={() => handleDelete(coupon.id)}
                            className="p-1.5 rounded-md text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition"
                            title="Delete coupon"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

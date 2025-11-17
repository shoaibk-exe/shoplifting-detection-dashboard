"use client";
import React, { ChangeEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Icons } from "@/images/Icons";
import toast from "react-hot-toast";
import { useFlaskCameras } from "@/hooks/useFlaskCameras";

const Deviceregistration: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [rtsp, setRtsp] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const { cameras, loading: listLoading, error, refetch } = useFlaskCameras(15000);

  const onSubmit = async () => {
    if (!name || !rtsp) {
      toast.error("Please provide both name and RTSP link");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`/api/flask/cameras`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, rtsp_url: rtsp }),
      });
      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(t || "Failed to add camera");
      }
      toast.success("Camera added");
      setName("");
      setRtsp("");
      refetch();
    } catch (e: any) {
      toast.error(e?.message || "Failed to add camera");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const ok = confirm("Delete this camera?");
      if (!ok) return;
      const res = await fetch(`/api/flask/cameras/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(t || "Failed to delete camera");
      }
      toast.success("Camera deleted");
      refetch();
    } catch (e: any) {
      toast.error(e?.message || "Failed to delete camera");
    }
  };

  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState<string>("");
  const [editRtsp, setEditRtsp] = useState<string>("");

  const startEdit = (id: number, name: string, rtsp?: string) => {
    setEditId(id);
    setEditName(name);
    setEditRtsp(rtsp || "");
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditName("");
    setEditRtsp("");
  };

  const saveEdit = async () => {
    if (editId == null) return;
    
    // Validate inputs
    if (!editName || !editName.trim()) {
      toast.error("Camera name is required");
      return;
    }
    
    if (!editRtsp || !editRtsp.trim()) {
      toast.error("RTSP link is required");
      return;
    }
    
    try {
      const res = await fetch(`/api/flask/cameras/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName.trim(), rtsp_url: editRtsp.trim() }),
      });
      
      const data = await res.json().catch(() => ({}));
      
      if (!res.ok) {
        const errorMessage = data?.error || data?.message || `Failed to update camera (${res.status})`;
        throw new Error(errorMessage);
      }
      
      toast.success(data?.message || "Camera updated successfully");
      cancelEdit();
      refetch();
    } catch (e: any) {
      console.error("Error updating camera:", e);
      toast.error(e?.message || "Failed to update camera");
    }
  };

  return (
    <div className="grid grid-cols-1 gap-8 rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card lg:grid-cols-3">
      <div className="col-span-1">
        <div className="mb-3 flex items-center justify-between text-1xl text-dark dark:text-white">
          Camera Name
        </div>
        <div className="relative mb-4 w-full">
          <input
            type="text"
            placeholder="e.g. Entrance Cam 1"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-stroke bg-transparent p-4 font-medium text-dark outline-none focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
          />
        </div>
      </div>

      <div className="col-span-1">
        <label
          htmlFor="rtsp"
          className="mb-3 flex items-center justify-between text-1xl text-dark dark:text-white"
        >
          RTSP Link
        </label>
        <div className="relative">
          <input
            id="rtsp"
            type="text"
            placeholder="rtsp://user:pass@ip:port/stream"
            name="rtsp"
            value={rtsp}
            onChange={(e) => setRtsp(e.target.value)}
            className="w-full rounded-lg border border-stroke bg-transparent p-4 font-medium text-dark outline-none focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
          />
          <span className="absolute right-4.5 top-1/2 -translate-y-1/2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6v12m-7.5 0V6" />
            </svg>
          </span>
        </div>
        <div className="mt-5 text-right">
          <button onClick={onSubmit} className="block w-full rounded-[5px] border border-primary bg-primary p-4 text-center font-medium text-white transition hover:bg-opacity-90">
            Register Camera
            {loading && (
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent dark:border-white dark:border-t-transparent"></span>
            )}
          </button>
        </div>
      </div>

      <div className="col-span-1 lg:col-span-3">
        <div className="relative overflow-x-auto sm:rounded-lg">
          <div className="flex items-center justify-between pb-4">
            <div className="font-semibold text-dark dark:text-white">Registered Devices</div>
            {listLoading && <div className="text-sm text-gray-500">Refreshing…</div>}
          </div>
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="border-b border-gray-300 bg-gray-50 text-xs uppercase text-gray-700 dark:border-gray-600 dark:bg-dark-2 dark:text-gray-300">
              <tr>
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Processed Stream</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(cameras || []).map((c, index) => (
                <tr key={c.id} className="border-b bg-white hover:bg-gray-50 dark:border-gray-600 dark:bg-dark-2 dark:text-gray-300 dark:hover:bg-gray-700">
                  <td className="px-6 py-4">{index + 1}</td>
                  <td className="px-6 py-4">
                    {editId === c.id ? (
                      <input
                        className="w-full rounded border border-stroke bg-transparent p-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                      />
                    ) : (
                      c.name
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {editId === c.id ? (
                      <input
                        className="w-full rounded border border-stroke bg-transparent p-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                        value={editRtsp}
                        onChange={(e) => setEditRtsp(e.target.value)}
                        placeholder="rtsp://..."
                      />
                    ) : (
                      <a className="text-primary underline" href={c.processed_url} target="_blank" rel="noreferrer">
                        {c.processed_url}
                      </a>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-semibold ${c.status === "Active"
                        ? "bg-green-100 text-green-800 dark:bg-gray-dark dark:text-green-800"
                        : "bg-red-100 text-red-800 dark:bg-gray-dark dark:text-red-800"
                        }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {editId === c.id ? (
                      <div className="flex items-center space-x-3.5">
                        <button className="hover:text-primary" onClick={saveEdit}>
                          Save
                        </button>
                        <button className="hover:text-primary" onClick={cancelEdit}>
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-3.5">
                        <button className="hover:text-primary" onClick={() => startEdit(c.id, c.name, c.rtsp_url)}>
                          <Icons.edit />
                        </button>
                        <button className="hover:text-primary" onClick={() => handleDelete(c.id)}>
                          <Icons.delete />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {cameras.length === 0 && !listLoading && (
                <tr>
                  <td className="px-6 py-6 text-center text-gray-500" colSpan={5}>
                    No devices found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Deviceregistration;

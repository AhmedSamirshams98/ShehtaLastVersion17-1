"use client";

import React, { useState, useEffect } from "react";
import { useVideoStore } from "@/stores/videoStore";

// دالة لاستخراج رابط iframe من كود iframe كامل
function extractIframeSrc(iframeCode: string) {
  const match = iframeCode.match(/src="([^"]+)"/);
  if (!match) return null;
  return match[1];
}

const VideoDashboard = () => {
  const {
    reels,
    clients,
    fetchReels,
    fetchClients,
    addReel,
    addClient,
    removeReel,
    removeClient,
    updateReel,
    updateClient,
  } = useVideoStore();

  const [newReel, setNewReel] = useState("");
  const [newClient, setNewClient] = useState("");

  // جلب الفيديوهات عند فتح الصفحة
  useEffect(() => {
    fetchReels();
    fetchClients();
  }, [fetchReels, fetchClients]);

  return (
    <div className="p-6 space-y-10">

      {/* إدارة الريلز */}
      <section>
        <h2 className="text-xl font-bold mb-4">إدارة الريلز</h2>
        <p className="mb-2 text-gray-600 text-sm">
          انسخ كود &lt;iframe&gt; بالكامل من فيسبوك والصقه هنا. سيتم التحويل تلقائيًا.
        </p>
        <div className="flex mb-4">
          <input
            type="text"
            placeholder="ألصق كود iframe هنا"
            className="border p-2 flex-1"
            value={newReel}
            onChange={(e) => setNewReel(e.target.value)}
          />
          <button
            className="bg-blue-500 text-white px-4 ml-2 rounded"
            onClick={() => {
              if (!newReel.trim()) return;
              const src = extractIframeSrc(newReel);
              if (!src) {
                alert("يرجى التأكد من لصق كود iframe صحيح");
                return;
              }
              addReel(src);
              setNewReel("");
            }}
          >
            إضافة
          </button>
        </div>
        <ul className="space-y-2">
          {reels.map((video) => (
            <li key={video.id} className="flex items-center space-x-2">
              <input
                type="text"
                className="border p-1 flex-1"
                value={video.src}
                onChange={(e) => updateReel(video.id, e.target.value)}
              />
              <button
                className="text-red-500"
                onClick={() => removeReel(video.id)}
              >
                حذف
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* إدارة فيديوهات العملاء */}
      <section>
        <h2 className="text-xl font-bold mb-4">إدارة فيديوهات العملاء</h2>
        <p className="mb-2 text-gray-600 text-sm">
          انسخ كود &lt;iframe&gt; بالكامل من فيسبوك والصقه هنا. سيتم التحويل تلقائيًا.
        </p>
        <div className="flex mb-4">
          <input
            type="text"
            placeholder="ألصق كود iframe هنا"
            className="border p-2 flex-1"
            value={newClient}
            onChange={(e) => setNewClient(e.target.value)}
          />
          <button
            className="bg-green-500 text-white px-4 ml-2 rounded"
            onClick={() => {
              if (!newClient.trim()) return;
              const src = extractIframeSrc(newClient);
              if (!src) {
                alert("يرجى التأكد من لصق كود iframe صحيح");
                return;
              }
              addClient(src);
              setNewClient("");
            }}
          >
            إضافة
          </button>
        </div>
        <ul className="space-y-2">
          {clients.map((video) => (
            <li key={video.id} className="flex items-center space-x-2">
              <input
                type="text"
                className="border p-1 flex-1"
                value={video.src}
                onChange={(e) => updateClient(video.id, e.target.value)}
              />
              <button
                className="text-red-500"
                onClick={() => removeClient(video.id)}
              >
                حذف
              </button>
            </li>
          ))}
        </ul>
      </section>

    </div>
  );
};

export default VideoDashboard;

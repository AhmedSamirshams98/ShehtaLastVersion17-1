"use client";

import React, { useState, useEffect } from "react";
import { useVideoStore } from "@/stores/videoStore";
import HomeReels from "@/app/components/HomeComponents/HomeReels";
import HomeClients from "@/app/components/HomeComponents/HomeClients";

function extractIframeSrc(input: string) {
  const iframe = input.match(/src="([^"]+)"/);
  if (iframe) return iframe[1];
  if (input.startsWith("http")) return input;
  return null;
}

const VideoDashboard = () => {
  const {
    fetchReels,
    fetchClients,
    addReel,
    addClient,
    removeReel,
    removeClient,
      makeLatestReel,    // <-- جديد

  } = useVideoStore();

  const [reelInput, setReelInput] = useState("");
  const [clientInput, setClientInput] = useState("");

  useEffect(() => {
    fetchReels();
    fetchClients();
  }, []);

  return (
    <div className="p-6 space-y-12">
      {/* REELS */}
      <section>
        <h2 className="text-xl font-bold mb-3">إدارة الريلز</h2>

        <div className="flex mb-4 gap-2">
          <input
            className="border p-2 flex-1"
            placeholder="iframe أو src"
            value={reelInput}
            onChange={(e) => setReelInput(e.target.value)}
          />
          <button
            className="bg-blue-600 text-white px-4 rounded"
            onClick={() => {
              const src = extractIframeSrc(reelInput);
              if (!src) return alert("رابط غير صحيح");
              addReel(src);
              setReelInput("");
            }}
          >
            إضافة
          </button>
        </div>

        <HomeReels
          isDashboard
          onDelete={removeReel}
          onEdit={(src) => setReelInput(src)}
            onMakeLatest={(id) => makeLatestReel(id)} // <-- جديد

        />
      </section>

      {/* CLIENTS */}
      <section>
        <h2 className="text-xl font-bold mb-3">فيديوهات العملاء</h2>

        <div className="flex mb-4 gap-2">
          <input
            className="border p-2 flex-1"
            placeholder="iframe أو src"
            value={clientInput}
            onChange={(e) => setClientInput(e.target.value)}
          />
          <button
            className="bg-green-600 text-white px-4 rounded"
            onClick={() => {
              const src = extractIframeSrc(clientInput);
              if (!src) return alert("رابط غير صحيح");
              addClient(src);
              setClientInput("");
            }}
          >
            إضافة
          </button>
        </div>

        <HomeClients
          isDashboard
          onDelete={removeClient}
          onEdit={(src) => setClientInput(src)}
        />
      </section>
    </div>
  );
};

export default VideoDashboard;

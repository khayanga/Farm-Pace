
"use client";
import { useEffect, useState } from "react";

const categories = [
  "Vegetable",
  "Fruit",
  "Herb",
  "Grain",
  "Legume",
  "Root",
  "Leafy",
  "Spice",
];

export default function CropsPage() {
  const [name, setName] = useState("");
  const [farmId, setFarmId] = useState("");
  const [category, setCategory] = useState("");
  const [farms, setFarms] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [farmCrops, setFarmCrops] = useState([]);
  const [variety, setVariety] = useState("");
  const [seedlings, setSeedlings] = useState("");

  // Fetch farms
  useEffect(() => {
    async function fetchFarms() {
      const res = await fetch("/api/farms");
      const data = await res.json();
      setFarms(data);
    }
    fetchFarms();
  }, []);

  // Fetch templates
  useEffect(() => {
    async function fetchTemplates() {
      const res = await fetch("/api/crop-templates");
      const data = await res.json();
      setTemplates(data);
    }
    fetchTemplates();
  }, []);

 useEffect(() => {
  async function fetchAllFarmCrops() {
    try {
      const res = await fetch("/api/farm-crops");
      const data = await res.json();
      setFarmCrops(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch farm crops", err);
    }
  }
  fetchAllFarmCrops();
}, []);

  // Create new crop template
  async function handleSubmit() {
    if (!name || !farmId || !category) return alert("All fields are required");

    const res = await fetch("/api/crop-templates", {
      method: "POST",
      body: JSON.stringify({ name, farmId, category }),
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) return alert("Failed to create template");

    const newTemplate = await res.json();
    setTemplates((prev) => [...prev, newTemplate]);
    setName("");
    setFarmId("");
    setCategory("");
  }

  // Open modal for a template
  function openModal(template) {
    setSelectedTemplate(template);
    setVariety("");
    setSeedlings("");
  }

  // Close modal
  function closeModal() {
    setSelectedTemplate(null);
  }

  // Register new farm crop
  async function handleRegisterFarmCrop() {
    if (!variety) return alert("Variety is required");

    const res = await fetch("/api/farm-crops", {
      method: "POST",
      body: JSON.stringify({
        farmId: selectedTemplate.farm.id,
        templateId: selectedTemplate.id,
        variety,
        seedlings: seedlings ? parseInt(seedlings) : undefined,
      }),
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) return alert("Failed to register farm crop");

    const newCrop = await res.json();
    setFarmCrops((prev) => [...prev, newCrop]);
    setVariety("");
    setSeedlings("");
    closeModal();
  }

  return (
    <div className="p-4">
      {/* Add Crop Template Form */}
      <div className="p-4 border rounded-md w-full max-w-md mb-6">
        <h2 className="font-bold mb-2 text-lg">Add Crop Template</h2>

        <input
          type="text"
          placeholder="Crop Name"
          className="border p-2 w-full mb-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <select
          className="border p-2 w-full mb-2 rounded"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <select
          className="border p-2 w-full mb-2 rounded"
          value={farmId}
          onChange={(e) => setFarmId(e.target.value)}
        >
          <option value="">Select Farm</option>
          {farms.map((farm) => (
            <option key={farm.id} value={farm.id}>
              {farm.name} ({farm.code})
            </option>
          ))}
        </select>

        <button
          onClick={handleSubmit}
          className="bg-green-500 text-white px-4 py-2 rounded mt-2"
        >
          Create Template
        </button>
      </div>

      {/* Crop Templates Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {templates.map((template) => (
          <div
            key={template.id}
            className="border rounded-md p-4 shadow hover:shadow-lg cursor-pointer"
            onClick={() => openModal(template)}
          >
            <h3 className="font-bold text-lg">{template.name}</h3>
            <p className="text-sm text-gray-600">Category: {template.category}</p>
            <p className="text-sm text-gray-600">
              Farm: {template.farm?.name} ({template.farm?.code})
            </p>
          </div>
        ))}
      </div>

      {/* Farm Crops Table (always visible) */}
      <div className="overflow-x-auto mb-6">
        <h2 className="text-xl font-bold mb-2">Registered Farm Crops</h2>
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1">Template</th>
              <th className="border px-2 py-1">Variety</th>
              <th className="border px-2 py-1">Seedlings</th>
              <th className="border px-2 py-1">Planted At</th>
              <th className="border px-2 py-1">Farm</th>
            </tr>
          </thead>
          <tbody>
            {farmCrops.map((crop) => (
              <tr key={crop.id}>
                <td className="border px-2 py-1">{crop.template?.name}</td>
                <td className="border px-2 py-1">{crop.variety}</td>
                <td className="border px-2 py-1">{crop.seedlings || "-"}</td>
                <td className="border px-2 py-1">{new Date(crop.plantedAt).toLocaleDateString()}</td>
                <td className="border px-2 py-1">{crop.farm?.code}</td>
              </tr>
            ))}
            {farmCrops.length === 0 && (
              <tr>
                <td className="border px-2 py-1 text-center" colSpan={5}>
                  No farm crops registered yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              onClick={closeModal}
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4">
              Register Farm Crop: {selectedTemplate.name}
            </h2>

            {/* Registration Form */}
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="Variety"
                value={variety}
                onChange={(e) => setVariety(e.target.value)}
                className="border p-2 flex-1"
              />
              <input
                type="number"
                placeholder="Seedlings"
                value={seedlings}
                onChange={(e) => setSeedlings(e.target.value)}
                className="border p-2 w-32"
              />
              <button
                onClick={handleRegisterFarmCrop}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


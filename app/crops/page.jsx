"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";

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
  const [open, setOpen] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [farmCrops, setFarmCrops] = useState([]);
  const [variety, setVariety] = useState("");
  const [seedlings, setSeedlings] = useState("");

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

  function openModal(template) {
    setSelectedTemplate(template);
    setVariety("");
    setSeedlings("");
  }

  function closeModal() {
    setSelectedTemplate(null);
  }

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
    <div className="p-4 space-y-6">

      <div className="flex justify-between">
        <div>
          <h1 className="text-md font-bold">Registered crop templates</h1>
          <p className="text-sm font-light ">You can add your template </p>
        </div>
        
         <Dialog open={open} onOpenChange={setOpen}>
        {/* Trigger Button */}
        <DialogTrigger asChild>
          <Button className="mb-4">
            <Plus className="w-5 h-5 text-white"/> 
            Add Crop Template</Button>
        </DialogTrigger>

        <DialogContent className="max-w-md w-full">
          <DialogHeader>
            <DialogTitle>Add Crop Template</DialogTitle>
          </DialogHeader>
          <div className="space-y-1">
            <Label>Crop Name</Label>
            <Input
              placeholder="Crop Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <Label>Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label>Farm</Label>
            <Select value={farmId} onValueChange={setFarmId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Farm" />
              </SelectTrigger>
              <SelectContent className="max-h-60 overflow-y-auto">
                {farms.map((farm) => (
                  <SelectItem key={farm.id} value={farm.id}>
                    {farm.name} ({farm.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleSubmit} className="w-full">
            Create Template
          </Button>
        </DialogContent>
      </Dialog>
      </div>
     

      {/* Crop Templates Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <Card
            key={template.id}
            className="cursor-pointer hover:shadow-lg"
            onClick={() => openModal(template)}
          >
            <CardContent className="space-y-1">
              <h3 className="font-bold text-lg">{template.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Category: {template.category}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Farm: {template.farm?.name} ({template.farm?.code})
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Farm Crops Table */}
      <Card>
        <CardHeader>
          <CardTitle>Registered Farm Crops</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Template</TableHead>
                <TableHead>Variety</TableHead>
                <TableHead>Seedlings</TableHead>
                <TableHead>Planted At</TableHead>
                <TableHead>Farm</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {farmCrops.map((crop) => (
                <TableRow key={crop.id}>
                  <TableCell>{crop.template?.name}</TableCell>
                  <TableCell>{crop.variety}</TableCell>
                  <TableCell>{crop.seedlings || "-"}</TableCell>
                  <TableCell>
                    {new Date(crop.plantedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{crop.farm?.code}</TableCell>
                </TableRow>
              ))}
              {farmCrops.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No farm crops registered yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal */}
      {selectedTemplate && (
        <Dialog
          open={!!selectedTemplate}
          onOpenChange={(val) => !val && closeModal()}
        >
          <DialogHeader>
            <DialogTitle></DialogTitle>
          </DialogHeader>

          <DialogContent className="max-w-2xl w-full">
            <h1>{selectedTemplate?.name} template</h1>

            <div className="space-y-1">
              <Label>Variety of template</Label>
              <Input
                placeholder="variety type"
                value={variety}
                onChange={(e) => setVariety(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label>No of seedlings </Label>
              <Input
                placeholder="0"
                type="number"
                value={seedlings}
                onChange={(e) => setSeedlings(e.target.value)}
              />
            </div>

            <Button onClick={handleRegisterFarmCrop}>Add</Button>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

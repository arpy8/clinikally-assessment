"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { useAuth } from "@/components/auth-provider";
import { useToast } from "@/hooks/use-toast";
import { mockProducts } from "./data";

export default function CreateRecommendationPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const [patientName, setPatientName] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setAvailableProducts(mockProducts);
  }, []);

  useEffect(() => {
    if (!user?.is_doctor) {
      router.push("/");
    }
  }, [user, router]);

  const filteredProducts = availableProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !selectedProducts.some((selected) => selected.id === product.id)
  );

  const addProduct = (product: Product) => {
    setSelectedProducts([...selectedProducts, product]);
    setSearchTerm("");
  };

  const removeProduct = (productId: number) => {
    setSelectedProducts(selectedProducts.filter((p) => p.id !== productId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!patientName.trim()) {
      toast({
        title: "Patient name required",
        description: "Please enter the patient's name.",
        variant: "destructive",
      });
      return;
    }

    if (selectedProducts.length === 0) {
      toast({
        title: "Products required",
        description: "Please select at least one product.",
        variant: "destructive",
      });
      return;
    }

    if (!notes.trim()) {
      toast({
        title: "Notes required",
        description: "Please add notes for this recommendation.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/recommendations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          patient_name: patientName,
          product_ids: selectedProducts.map((p) => p.id),
          notes: notes,
        }),
      }); 

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Recommendation created!",
          description: "The recommendation has been successfully created.",
        });
        router.push(data.recommendation_link);
      } else {
        throw new Error("Failed to create recommendation");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create recommendation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user?.is_doctor) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Create Product Recommendation
            </h1>
            <p className="text-gray-600">
              Create a personalized product recommendation for your patient
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recommendation Details</CardTitle>
              <CardDescription>
                Fill in the patient information and select recommended products
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="patient-name">Patient Name</Label>
                  <Input
                    id="patient-name"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="Enter patient's name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Recommended Products</Label>
                  <div className="space-y-2">
                    <Input
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    {searchTerm && filteredProducts.length > 0 && (
                      <div className="border rounded-md max-h-40 overflow-y-auto">
                        {filteredProducts.map((product) => (
                          <button
                            key={product.id}
                            type="button"
                            onClick={() => addProduct(product)}
                            className="w-full text-left p-3 hover:bg-gray-50 border-b last:border-b-0"
                          >
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-gray-500">
                              {product.description}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {selectedProducts.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Selected Products:
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {selectedProducts.map((product) => (
                          <Badge
                            key={product.id}
                            variant="secondary"
                            className="flex items-center gap-1"
                          >
                            {product.name}
                            <button
                              type="button"
                              onClick={() => removeProduct(product.id)}
                              className="ml-1 hover:text-red-500"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes & Instructions</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add usage instructions, dosage, or any other relevant notes..."
                    rows={4}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading
                    ? "Creating Recommendation..."
                    : "Create Recommendation"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
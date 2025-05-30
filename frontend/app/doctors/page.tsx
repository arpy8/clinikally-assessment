"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Filter } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { DoctorCard } from "@/components/doctor-card";

interface Doctor {
  id: number;
  name: string;
  specialization: string;
  average_rating: number;
  review_count: number;
}

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [minRating, setMinRating] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        min_rating: minRating.toString(),
        page: page.toString(),
        limit: limit.toString(),
      });

      const response = await fetch(`/api/doctors?${params}`);
      if (response.ok) {
        const data = await response.json();
        setDoctors(data);
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [minRating, page]);

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchDoctors();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Find Dermatologists
          </h1>
          <p className="text-gray-600">
            Browse and filter dermatologists by rating and specialization
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleFilterSubmit}
              className="flex flex-col sm:flex-row gap-4"
            >
              <div className="flex-1">
                <Label htmlFor="min-rating">Minimum Rating</Label>
                <Input
                  id="min-rating"
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={minRating}
                  onChange={(e) =>
                    setMinRating(Number.parseFloat(e.target.value) || 0)
                  }
                  placeholder="0.0"
                />
              </div>
              <div className="flex items-end">
                <Button type="submit">Apply Filters</Button>
              </div>
              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setMinRating(0);
                    setPage(1);
                  }}
                  className="mt-4"
                >
                  Clear Filters
                </Button>
                {/* <Button type="submit">Apply Filters</Button> */}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {doctors.map((doctor) => (
                <DoctorCard key={doctor.id} doctor={doctor} />
              ))}
            </div>

            {doctors.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  No doctors found matching your criteria.
                </p>
                {/* <Button
                  variant="outline"
                  onClick={() => {
                    setMinRating(0);
                    setPage(1);
                  }}
                  className="mt-4"
                >
                  Clear Filters
                </Button> */}
              </div>
            )}

            {/* Pagination */}
            {doctors.length === limit && (
              <div className="flex justify-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <span className="flex items-center px-4">Page {page}</span>
                <Button variant="outline" onClick={() => setPage(page + 1)}>
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

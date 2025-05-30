"use client"

import type React from "react"

import { useState, useEffect, use } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, FileText, Share2 } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { useToast } from "@/hooks/use-toast"

interface Recommendation {
  uuid: string
  doctor_name: string
  patient_name: string
  products: Array<{
    id: number
    name: string
    description: string
  }>
  notes: string
  created_at: string
  expires_at: string
}

export default function RecommendationPage({ params }: { params: Promise<{ uuid: string }> }) {
  const resolvedParams = use(params)
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (!resolvedParams?.uuid) {
      console.log("UUID not available yet")
      return
    }

    const fetchRecommendation = async () => {
      try {
        const response = await fetch(`/api/recommendation/${resolvedParams.uuid}`)
        if (response.ok) {
          const data = await response.json()
          setRecommendation(data)
        } else if (response.status === 404) {
          setError("Recommendation not found or has expired.")
        } else {
          setError("Failed to load recommendation.")
        }
      } catch (error) {
        setError("Failed to load recommendation.")
      } finally {
        setLoading(false)
      }
    }

    fetchRecommendation()
  }, [resolvedParams?.uuid]) // Make sure to depend on the actual uuid value

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href)
    toast({
      title: "Link copied!",
      description: "Recommendation link has been copied to clipboard.",
    })
  }

  const shareRecommendation = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Product Recommendation from Dr. ${recommendation?.doctor_name}`,
          text: `View your personalized product recommendation`,
          url: window.location.href,
        })
      } catch (error) {
        copyToClipboard()
      }
    } else {
      copyToClipboard()
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8 pt-24">
          <div className="max-w-2xl mx-auto">
            <Card className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-20 bg-gray-200 rounded"></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8 pt-24">
          <div className="max-w-2xl mx-auto text-center">
            <Card>
              <CardContent className="pt-6">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Recommendation Not Found</h2>
                <p className="text-gray-600">{error}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (!recommendation) return null

  const isExpired = new Date(recommendation.expires_at) < new Date()

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6 flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Product Recommendation</h1>
              <p className="text-gray-600">Personalized recommendation from your dermatologist</p>
            </div>
            <Button onClick={shareRecommendation} variant="outline" className="flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>

          {isExpired && (
            <Card className="mb-6 border-yellow-200 bg-yellow-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-yellow-800">
                  <Calendar className="h-5 w-5" />
                  <span className="font-medium">This recommendation has expired</span>
                </div>
                <p className="text-yellow-700 mt-1">
                  Please consult with your dermatologist for an updated recommendation.
                </p>
              </CardContent>
            </Card>
          )}

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Recommendation Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Patient</Label>
                  <p className="font-medium">{recommendation.patient_name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Doctor</Label>
                  <p className="font-medium">Dr. {recommendation.doctor_name}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Created</Label>
                  <p>{new Date(recommendation.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Expires</Label>
                  <p className={isExpired ? "text-red-600" : ""}>
                    {new Date(recommendation.expires_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Recommended Products</CardTitle>
              <CardDescription>Products specifically recommended for your skin condition</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recommendation.products.map((product, index) => (
                  <div key={product.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{product.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                      </div>
                      <Badge variant="outline">#{index + 1}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Instructions & Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-gray-800 whitespace-pre-wrap">{recommendation.notes}</p>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 text-center text-sm text-gray-500">
            <p>This recommendation is valid until {new Date(recommendation.expires_at).toLocaleDateString()}</p>
            <p className="mt-1">
              For questions about this recommendation, please contact Dr. {recommendation.doctor_name}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>
}

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { RatingDialog } from "@/components/rating-dialog"
import { ReviewDialog } from "@/components/review-dialog"

interface Doctor {
  id: number
  name: string
  specialization: string
  average_rating: number
  review_count: number
}

interface DoctorCardProps {
  doctor: Doctor
}

export function DoctorCard({ doctor }: DoctorCardProps) {
  const { user } = useAuth()
  const [showRatingDialog, setShowRatingDialog] = useState(false)
  const [showReviewDialog, setShowReviewDialog] = useState(false)

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
      />
    ))
  }

  return (
    <>
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{doctor.name}</span>
            <Badge variant="secondary">{doctor.specialization}</Badge>
          </CardTitle>
          <CardDescription className="flex items-center gap-2">
            <div className="flex items-center">{renderStars(doctor.average_rating)}</div>
            <span className="font-medium">{doctor.average_rating.toFixed(1)}</span>
            <span className="text-sm text-gray-500">({doctor.review_count} reviews)</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {user && !user.is_doctor && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowRatingDialog(true)}>
                Rate Doctor
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowReviewDialog(true)}>
                Write Review
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <RatingDialog
        open={showRatingDialog}
        onOpenChange={setShowRatingDialog}
        doctorId={doctor.id}
        doctorName={doctor.name}
      />

      <ReviewDialog
        open={showReviewDialog}
        onOpenChange={setShowReviewDialog}
        doctorId={doctor.id}
        doctorName={doctor.name}
      />
    </>
  )
}

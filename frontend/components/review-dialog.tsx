"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

interface ReviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  doctorId: number
  doctorName: string
}

export function ReviewDialog({ open, onOpenChange, doctorId, doctorName }: ReviewDialogProps) {
  const [reviewText, setReviewText] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async () => {
    if (reviewText.trim().length === 0) {
      toast({
        title: "Please write a review",
        description: "Review text cannot be empty.",
        variant: "destructive",
      })
      return
    }

    if (reviewText.length > 500) {
      toast({
        title: "Review too long",
        description: "Please keep your review under 500 characters.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          doctor_id: doctorId,
          review_text: reviewText,
        }),
      })

      if (response.ok) {
        toast({
          title: "Review submitted!",
          description: `Your review for Dr. ${doctorName} has been posted.`,
        })
        onOpenChange(false)
        setReviewText("")
      } else {
        throw new Error("Failed to submit review")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Write a Review for Dr. {doctorName}</DialogTitle>
          <DialogDescription>Share your experience to help other patients make informed decisions.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="review">Your Review</Label>
            <Textarea
              id="review"
              placeholder="Write your review here..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              rows={4}
              maxLength={500}
            />
            <p className="text-sm text-gray-500 mt-1">{reviewText.length}/500 characters</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Submitting..." : "Submit Review"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

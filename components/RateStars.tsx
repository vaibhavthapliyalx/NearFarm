/**
 * @fileoverview This file contains the RateStars component.
 * This component is used to take the rating input from the user.
 */

// Imports.
import { Star } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

// Interface for the props of the RateStars component.
interface IProps {
  onRatingChange: (rating: number) => void;
  defaultRating?: number;
}

/**
 * This function renders the RateStars component.
 *
 * @param onRatingChange The function to change the rating.
 * @returns The rendered RateStars component.
 */
export default function RateStars({ onRatingChange, defaultRating }: IProps) {
  // State variable.
  const [rating, setRating] = useState<number>(defaultRating || 0);
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <Button
          key={star}
          type="button"
          variant={'secondary'}
          onClick={() => {
            setRating(star);
            onRatingChange(star);
          }}
          className={"p-0 m-0 cursor-pointer bg-transparent"}
        >
          {rating >= star ? <Star strokeWidth={0} fill={`${rating >= star ? "#ea580b" : ""}`} />  : <Star color="#f0be8f" strokeWidth={1} />}
        </Button>
      ))}
    </div>
  );
}
import { useState } from "react";
import { Label } from "./ui/label";

interface StarRatingProps {
    maxStars?: number;
    onChange?: (value: number) => void;
    displayMode?:boolean;
  }

const StarRating = ({ maxStars = 5, onChange, displayMode= false }:  StarRatingProps) => {
  const [rating, setRating] = useState<number>(displayMode ? maxStars : 0);

  const handleClick = (value:number) => {
    setRating(value);
    if (onChange) onChange(value);
  };

  return (
    <div className=" space-x-1">
      { !displayMode ? <Label className="block" htmlFor="importance">Importance</Label> : <></> }
      {Array.from({ length: maxStars }, (_, i) => i + 1).map((star) => (
        <button type="button" disabled={displayMode}
          id="importance"
          key={star}
          onClick={(e) =>{e.preventDefault; handleClick(star);}}
          className={`text-2xl  ${
            star <= rating ? "text-yellow-500" : "text-gray-400"
          }`}
        >
          ★
        </button>
      ))}
    </div>
  );
};

export default StarRating;

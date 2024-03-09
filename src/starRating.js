import { useState } from "react";
import PropType from "prop-types";

const ContainerStyle = {
  display: "flex",
  alignItems: "center",
  gap: "16px",
};

const starContainerStyle = {
  display: "flex",
};

StarRating.prototype = {
  maxRate: PropType.number,
  color: PropType.string,
  size: PropType.number,
  className: PropType.string,
  message: PropType.array,
  defaultRating: PropType.number,
  onSetRating: PropType.func,
};

export default function StarRating({
  maxRate = 5,
  color = "#fcc149",
  size = 48,
  className = "",
  message = [],
  defaultRating = 0,
  onSetRating,
}) {
  const [rating, setRate] = useState(defaultRating);
  const [hoverRating, setHoverRating] = useState(0);

  const textSyle = {
    lineHeight: "1",
    fontSize: `${size / 1.5}px`,
    margin: "0",
    color: `${color}`,
  };
  function ratingHandler(rate) {
    setRate(rate);
    typeof onSetRating === "function" && onSetRating(rate);
  }

  function hoverRatingHnadler(hoverRate) {
    setHoverRating(hoverRate);
  }

  return (
    <div style={ContainerStyle} className={className}>
      <div style={starContainerStyle}>
        {Array.from({ length: maxRate }, (_, i) => (
          <Star
            key={i + 1}
            full={hoverRating ? hoverRating >= i + 1 : rating >= i + 1}
            onRating={() => ratingHandler(i + 1)}
            OnHoverRating={() => hoverRatingHnadler(i + 1)}
            OnOutRating={() => setHoverRating(0)}
            color={color}
            size={size}
          />
        ))}
        <p style={textSyle}>
          {message.length === maxRate
            ? message[hoverRating ? hoverRating - 1 : rating - 1]
            : hoverRating || rating || ""}
        </p>
      </div>
    </div>
  );
  // <svg
  //   xmlns="http://www.w3.org/2000/svg"
  //   viewBox="0 0 20 20"
  //   fill="#000"
  //   stroke="#000"
  // >
  //   <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  // </svg>
}

function Star({ OnOutRating, OnHoverRating, onRating, full, size, color }) {
  const starStyel = {
    width: `${size}px`,
    height: `${size}px`,
    display: "block",
    margin: "0",
    cursor: "pointer",
  };

  return (
    <span
      role="button"
      onMouseLeave={OnOutRating}
      onMouseEnter={OnHoverRating}
      onClick={onRating}
      style={starStyel}
    >
      {full ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill={color}
          stroke={color}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke={color}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="{2}"
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      )}
    </span>
  );
}

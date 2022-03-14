import React from "react";
import { MotionDiv } from "..";
import { useWindowDimensions } from "../../hooks";

export default function H2HItem({ dir, barWidth, title, value }) {
  const { width } = useWindowDimensions();

  const type = dir === "left" ? "slideLeft" : "slideRight";

  return (
    <MotionDiv type={type} className="h2h-detail-item">
      {width > 510 && (
        <div className="bar-container">
          <div className="bar" style={{ width: barWidth }}></div>
        </div>
      )}
      <small className="item-value">{value ?? 0}</small>
      <small className="item-title">{title}</small>
    </MotionDiv>
  );
}

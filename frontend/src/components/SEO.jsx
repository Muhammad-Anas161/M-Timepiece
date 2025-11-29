"use client";

import React from "react";

const SEO = ({ title, description }) => {
  if (typeof document !== "undefined") {
    document.title = title
      ? `${title} | M Timepiece`
      : "M Timepiece - Luxury Timepieces";

    const descTag =
      document.querySelector('meta[name="description"]') ||
      document.createElement("meta");

    descTag.name = "description";
    descTag.content =
      description ||
      "Discover our collection of premium timepieces designed for the modern individual.";

    document.head.appendChild(descTag);
  }

  return null;
};

export default SEO;

import React from "react";
import { Link } from "react-router-dom";

export const FinalizationCard = ({
  icon: Icon,
  iconBg = "bg-green-500",
  iconColor = "text-white",
  title = "Success!",
  description = "",
  ctaText = "Continue",
  ctaLink = "/",
}) => {
  return (
    <div className="w-full px-8 py-5 border bg-white rounded-2xl shadow-xl flex flex-col items-center gap-6 animate-fade-in">
      {/* Icon */}
      <div className={`flex items-center justify-center w-20 h-20 rounded-full ${iconBg} shadow-md`}>
        {Icon && <Icon className={`w-10 h-10 ${iconColor}`} />}
      </div>

      {/* Heading */}
      <h2 className="text-2xl font-bold text-gray-800 text-center">{title}</h2>

      {/* Description */}
      <p className="text-gray-600 text-center leading-relaxed">{description}</p>

      {/* CTA Button */}
      <Link
        to={ctaLink}
        className="mt-4 px-8 py-2 bg-blue-600 hover:bg-blue-700 transition-colors duration-200 text-white text-sm font-medium rounded-lg shadow"
      >
        {ctaText}
      </Link>
    </div>
  );
};

import React from "react";

function PremiumUser() {
  return (
    <div
      className="
        flex items-center gap-2 px-5 py-2 
        rounded-xl 
        bg-yellow-500/20 
        border border-yellow-400 
        shadow-[0_0_8px_rgba(255,215,0,0.7)] 
        text-dark-a0 
        font-semibold
      "
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="gold"
        viewBox="0 0 24 24"
        stroke="goldenrod"
        className="w-5 h-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 3l2.25 6.75H21l-5.75 4.25L17.5 21 12 16.75 6.5 21l2.25-7L3 9.75h6.75L12 3z"
        />
      </svg>
      Premium User
    </div>
  );
}

export default PremiumUser;

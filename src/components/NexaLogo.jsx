import React from 'react';

/**
 * NexaLogo - Futuristic AI core geometric SVG logo for Nexa AI
 */
export default function NexaLogo({ className = "w-8 h-8", animated = true }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Dynamic neon gradient for N and nexus core */}
        <linearGradient id="nexaPrimaryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="50%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>

        <linearGradient id="nexaAccentGrad" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#c084fc" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>

        <filter id="nexaGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Outer Hexagonal Tech Frame */}
      <polygon
        points="50,6 88,27 88,73 50,94 12,73 12,27"
        stroke="url(#nexaPrimaryGrad)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="#13101d"
        fillOpacity="0.85"
        className={animated ? "animate-pulse" : ""}
      />

      {/* Cybernetic Inner Accent Border */}
      <polygon
        points="50,14 80,31 80,69 50,86 20,69 20,31"
        stroke="url(#nexaAccentGrad)"
        strokeWidth="1.2"
        strokeOpacity="0.45"
        strokeDasharray="4 4"
        fill="none"
      />

      {/* Stylized 'N' Geometry with Multimodal Neural Bridge */}
      {/* Left Vertical Pillar */}
      <path
        d="M32 30 L32 70"
        stroke="url(#nexaPrimaryGrad)"
        strokeWidth="6.5"
        strokeLinecap="round"
      />

      {/* Right Vertical Pillar */}
      <path
        d="M68 30 L68 70"
        stroke="url(#nexaPrimaryGrad)"
        strokeWidth="6.5"
        strokeLinecap="round"
      />

      {/* Futuristic Diagonal Bridge */}
      <path
        d="M32 32 L68 68"
        stroke="url(#nexaAccentGrad)"
        strokeWidth="6"
        strokeLinecap="round"
        filter="url(#nexaGlow)"
      />

      {/* Glowing Neural Nodes */}
      <circle cx="32" cy="30" r="4.5" fill="#f3e8ff" />
      <circle cx="68" cy="70" r="4.5" fill="#f3e8ff" />
      <circle cx="50" cy="50" r="3.5" fill="#ffffff" filter="url(#nexaGlow)" />
    </svg>
  );
}

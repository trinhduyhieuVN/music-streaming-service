"use client";

import React from 'react';
import { FaCrown } from 'react-icons/fa';
import { RiVipCrownFill, RiVipDiamondFill } from 'react-icons/ri';

interface PremiumBadgeProps {
  planId?: string | null;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

/**
 * Premium Badge Component
 * - Monthly (2k): Vương miện bạc
 * - Yearly (29k): Vương miện vàng + kim cương
 */
const PremiumBadge: React.FC<PremiumBadgeProps> = ({
  planId,
  size = 'md',
  showLabel = false,
  className = ''
}) => {
  if (!planId) return null;

  const isYearly = planId === 'yearly';
  
  // Size configurations
  const sizeConfig = {
    sm: {
      icon: 'w-3 h-3',
      badge: 'px-1.5 py-0.5 text-[10px]',
      gap: 'gap-0.5'
    },
    md: {
      icon: 'w-4 h-4',
      badge: 'px-2 py-1 text-xs',
      gap: 'gap-1'
    },
    lg: {
      icon: 'w-5 h-5',
      badge: 'px-3 py-1.5 text-sm',
      gap: 'gap-1.5'
    }
  };

  const config = sizeConfig[size];

  if (isYearly) {
    // Yearly Plan - Gold Crown with Diamond effect
    return (
      <div 
        className={`
          inline-flex items-center ${config.gap} ${config.badge}
          bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-500
          text-black font-bold rounded-full
          shadow-lg shadow-yellow-500/30
          animate-pulse
          ${className}
        `}
        title="Premium Yearly - VIP Member"
      >
        <RiVipDiamondFill className={`${config.icon} text-yellow-900`} />
        {showLabel && <span>VIP</span>}
        <RiVipCrownFill className={`${config.icon} text-yellow-900`} />
      </div>
    );
  }

  // Monthly Plan - Silver Crown
  return (
    <div 
      className={`
        inline-flex items-center ${config.gap} ${config.badge}
        bg-gradient-to-r from-slate-400 via-gray-300 to-slate-400
        text-slate-800 font-bold rounded-full
        shadow-md shadow-slate-400/30
        ${className}
      `}
      title="Premium Monthly"
    >
      <FaCrown className={`${config.icon}`} />
      {showLabel && <span>Premium</span>}
    </div>
  );
};

export default PremiumBadge;

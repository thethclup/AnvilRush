import React, { ReactNode } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'mythic' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

export function Button({ variant = 'primary', size = 'md', className, children, ...props }: ButtonProps) {
  const baseClasses = "inline-flex items-center justify-center rounded-md font-medium transition-all active:scale-95 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50";
  
  const variants = {
    primary: "bg-mystic-blue text-white hover:bg-mystic-blue/90 shadow-[0_0_15px_rgba(59,130,246,0.5)]",
    secondary: "bg-slate-800 text-slate-100 hover:bg-slate-700 border border-slate-700",
    mythic: "bg-gradient-to-r from-forge-orange to-divine-gold text-white font-bold shadow-[0_0_20px_rgba(245,158,11,0.6)] hover:shadow-[0_0_30px_rgba(245,158,11,0.8)]",
    ghost: "text-slate-300 hover:text-white hover:bg-slate-800",
  };

  const sizes = {
    sm: "h-9 px-4 text-sm",
    md: "h-11 px-6 text-base",
    lg: "h-14 px-8 text-lg uppercase tracking-wider",
  };

  return (
    <button className={cn(baseClasses, variants[variant], sizes[size], className)} {...props}>
      {children}
    </button>
  );
}

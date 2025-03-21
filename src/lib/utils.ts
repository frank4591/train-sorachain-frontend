
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Color scheme management - these can be used to switch between color schemes
export const colorSchemes = {
  default: {
    primary: "hsl(var(--primary))",
    secondary: "hsl(var(--secondary))",
    accent: "hsl(var(--accent))"
  },
  original: {
    primary: "hsl(221.2, 83.2%, 53.3%)", // Original primary color
    secondary: "hsl(210, 40%, 96.1%)", // Original secondary color
    accent: "hsl(210, 40%, 96.1%)" // Original accent color
  },
  custom: {
    primary: "#29647c", // Custom primary color
    secondary: "#CDF683", // Custom secondary color
    accent: "#CDF683" // Custom accent color
  }
}

// Function to create style object for inline color overrides
export function getColorStyles(scheme: keyof typeof colorSchemes) {
  const colors = colorSchemes[scheme];
  return {
    "--primary-color": colors.primary,
    "--secondary-color": colors.secondary,
    "--accent-color": colors.accent,
  } as React.CSSProperties;
}

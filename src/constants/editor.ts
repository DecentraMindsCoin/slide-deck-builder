// Font options for font family selector
export const FONT_FAMILIES = [
  { value: 'inherit', label: 'Default' },
  { value: 'Inter', label: 'Inter' },
  { value: 'Helvetica', label: 'Helvetica' },
  { value: 'Arial', label: 'Arial' },
  { value: 'Times New Roman', label: 'Times New Roman' },
  { value: 'Georgia', label: 'Georgia' },
] as const;

// Font size constraints
export const FONT_SIZE_LIMITS = {
  MIN: 8,
  MAX: 72,
} as const;

// Text style toggle values
export const TEXT_STYLES = {
  FONT_WEIGHT: {
    NORMAL: 'normal' as const,
    BOLD: 'bold' as const,
  },
  FONT_STYLE: {
    NORMAL: 'normal' as const,
    ITALIC: 'italic' as const,
  },
  TEXT_DECORATION: {
    NONE: 'none' as const,
    UNDERLINE: 'underline' as const,
  },
} as const;
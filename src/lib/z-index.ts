/**
 * Z-Index Configuration
 * 
 * Centralized z-index values to prevent layering conflicts across the app.
 * Lower values are behind higher values.
 */

export const Z_INDEX = {
  // Base layers
  BASE: 1,
  CONTENT: 10,
  
  // Navigation and headers
  HEADER: 40,
  NAVIGATION: 50,
  
  // Form elements and inputs (ensure they're above backgrounds)
  FORM_ELEMENT: 100,
  INPUT: 110,
  SELECT: 120,
  DROPDOWN: 130,
  
  // Interactive components
  BUTTON: 200,
  CARD: 210,
  TABLE: 220,
  
  // Overlays and popups
  TOOLTIP: 500,
  POPOVER: 600,
  
  // Modals and dialogs
  MODAL_BACKDROP: 1000,
  MODAL: 1010,
  MODAL_CONTENT: 1020,
  
  // Toast notifications (highest priority)
  TOAST: 2000,
  
  // Emergency layer (for critical UI elements that must be on top)
  EMERGENCY: 9999
} as const;

/**
 * Utility function to get z-index value with optional offset
 */
export function getZIndex(layer: keyof typeof Z_INDEX, offset: number = 0): number {
  return Z_INDEX[layer] + offset;
}

/**
 * CSS classes for common z-index values
 */
export const Z_CLASSES = {
  base: `z-[${Z_INDEX.BASE}]`,
  content: `z-[${Z_INDEX.CONTENT}]`,
  header: `z-[${Z_INDEX.HEADER}]`,
  navigation: `z-[${Z_INDEX.NAVIGATION}]`,
  formElement: `z-[${Z_INDEX.FORM_ELEMENT}]`,
  input: `z-[${Z_INDEX.INPUT}]`,
  select: `z-[${Z_INDEX.SELECT}]`,
  dropdown: `z-[${Z_INDEX.DROPDOWN}]`,
  button: `z-[${Z_INDEX.BUTTON}]`,
  card: `z-[${Z_INDEX.CARD}]`,
  table: `z-[${Z_INDEX.TABLE}]`,
  tooltip: `z-[${Z_INDEX.TOOLTIP}]`,
  popover: `z-[${Z_INDEX.POPOVER}]`,
  modalBackdrop: `z-[${Z_INDEX.MODAL_BACKDROP}]`,
  modal: `z-[${Z_INDEX.MODAL}]`,
  modalContent: `z-[${Z_INDEX.MODAL_CONTENT}]`,
  toast: `z-[${Z_INDEX.TOAST}]`,
  emergency: `z-[${Z_INDEX.EMERGENCY}]`
} as const;
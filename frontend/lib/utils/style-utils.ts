export function cleanStyleConflicts(styles: Record<string, any>): Record<string, any> {
  const cleaned = { ...styles };

  // Si borderWidth existe, supprimer les propriétés spécifiques
  if (cleaned.borderWidth) {
    delete cleaned.borderTop;
    delete cleaned.borderRight;
    delete cleaned.borderBottom;
    delete cleaned.borderLeft;
  }

  // Si borderStyle existe, supprimer les propriétés spécifiques
  if (cleaned.borderStyle) {
    delete cleaned.borderTopStyle;
    delete cleaned.borderRightStyle;
    delete cleaned.borderBottomStyle;
    delete cleaned.borderLeftStyle;
  }

  // Si borderColor existe, supprimer les propriétés spécifiques
  if (cleaned.borderColor) {
    delete cleaned.borderTopColor;
    delete cleaned.borderRightColor;
    delete cleaned.borderBottomColor;
    delete cleaned.borderLeftColor;
  }

  // Si border existe, supprimer toutes les propriétés spécifiques
  if (cleaned.border) {
    delete cleaned.borderTop;
    delete cleaned.borderRight;
    delete cleaned.borderBottom;
    delete cleaned.borderLeft;
    delete cleaned.borderWidth;
    delete cleaned.borderStyle;
    delete cleaned.borderColor;
  }

  return cleaned;
}

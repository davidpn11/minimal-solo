const GRADIENT_ROTATION = "315deg" as const;

export const COLORS = {
  blackBase: "#363436",
  blackLight: "#444144",
  blackShadow: "#272627",
  blackest: "#171717",
  blueBase: "#2F80ED",
  blueLight: "#4D92F0",
  blueShadow: "#1470EB",
  greenBase: "#27AE60",
  greenLight: "#2DC86E",
  greenShadow: "#229653",
  redBase: "#EB5757",
  redLight: "#EE7272",
  redShadow: "#E83B3B",
  yellowBase: "#F2C94C",
  yellowLight: "#F4D167",
  yellowShadow: "#F0C02E",
  white: "#FFFFFF",
  border: "#F0EFF0",
} as const;

export const GRADIENTS = {
  blackGradient: `linear-gradient(${GRADIENT_ROTATION}, ${COLORS.blackBase} 0%, ${COLORS.blackLight} 100%)`,
  blackestGradient: `linear-gradient(${GRADIENT_ROTATION}, ${COLORS.blackest} 0%, ${COLORS.blackShadow} 100%)`,
  blueGradient: `linear-gradient(${GRADIENT_ROTATION}, ${COLORS.blueBase} 0%, ${COLORS.blueLight} 100%)`,
  greenGradient: `linear-gradient(${GRADIENT_ROTATION}, ${COLORS.greenBase} 0%, ${COLORS.greenLight} 100%)`,
  redGradient: `linear-gradient(${GRADIENT_ROTATION}, ${COLORS.redBase} 0%, ${COLORS.redLight} 100%)`,
  whiteGradient: `linear-gradient(${GRADIENT_ROTATION}, ${COLORS.border} 0%, ${COLORS.white} 100%)`,
  yellowGradient: `linear-gradient(${GRADIENT_ROTATION}, ${COLORS.yellowBase} 0%, ${COLORS.yellowLight} 100%)`,
} as const;

export const THEME = {
  backgrounds: {
    base: COLORS.blackBase,
    card: COLORS.white,
    admin: GRADIENTS.blueGradient,
    ready: GRADIENTS.greenGradient,
    notReady: GRADIENTS.redGradient,
    winner: GRADIENTS.greenGradient,
    closest: GRADIENTS.blueGradient,
    others: COLORS.white,
    primaryButton: GRADIENTS.blueGradient,
    secondaryButton: GRADIENTS.greenGradient,
  },
  playingCards: {
    back: GRADIENTS.blackestGradient,
    black: GRADIENTS.blackGradient,
    blue: GRADIENTS.blueGradient,
    green: GRADIENTS.greenGradient,
    red: GRADIENTS.redGradient,
    yellow: GRADIENTS.yellowGradient,
  },
  colors: COLORS,
  gradients: GRADIENTS,
  spacing: {
    none: 0,
    small: 4,
    base: 8,
    medium: 16,
    mediumLarge: 24,
    large: 32,
    huge: 48,
    high: 64,
    highest: 96,
  }
} as const;
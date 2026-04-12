/**
 * Returns interaction configuration based on the product category
 * for Tilt and Framer Motion components.
 */
export const getCategoryInteraction = (category) => {
  const base = {
    tiltMaxAngleX: 10,
    tiltMaxAngleY: 10,
    scale: 1.05,
    transitionSpeed: 2000,
    whileHover: { y: -10, scale: 1.05 },
    whileTap: { scale: 0.95 },
    className: 'effect-dairy'
  };

  switch (category) {
    case 'Vegan':
      return {
        ...base,
        tiltMaxAngleX: 8,
        tiltMaxAngleY: 8,
        scale: 1.04,
        whileHover: { y: -12, scale: 1.04, transition: { type: 'spring', stiffness: 300 } },
        className: 'effect-vegan'
      };
    case 'Sorbet':
      return {
        ...base,
        tiltMaxAngleX: 12,
        tiltMaxAngleY: 12,
        scale: 1.1,
        whileHover: { scale: 1.1, transition: { type: 'spring', stiffness: 400, damping: 10 } },
        className: 'effect-sorbet'
      };
    case 'Specialty':
      return {
        ...base,
        tiltMaxAngleX: 18,
        tiltMaxAngleY: 18,
        scale: 1.08,
        whileHover: { y: -15, scale: 1.08, z: 50 },
        className: 'effect-specialty'
      };
    case 'Milkshake':
      return {
        ...base,
        tiltMaxAngleX: 10,
        tiltMaxAngleY: 10,
        whileHover: { rotate: [0, -1, 1, -1, 0], scale: 1.05, transition: { duration: 0.5 } },
        className: 'effect-milkshake'
      };
    case 'Thick Shake':
      return {
        ...base,
        tiltMaxAngleX: 15,
        tiltMaxAngleY: 15,
        scale: 1.03,
        transitionSpeed: 1000,
        className: 'effect-thickshake'
      };
    default:
      return base;
  }
};

export const formatCuil = (cuil) => {
  return cuil.replace(/(\d{2})(\d{2})(\d{3})(\d{3})(\d{1})/, '$1-$2.$3.$4-$5');
};

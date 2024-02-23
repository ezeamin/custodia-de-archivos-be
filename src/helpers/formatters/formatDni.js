export const formatDni = (dni) => {
  return dni.replace(/(\d{2})(\d{3})(\d{3})/g, '$1.$2.$3');
};

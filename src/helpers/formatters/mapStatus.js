export const mapStatus = (status) => {
  switch (status) {
    case 'active':
      return 'Activo';
    case 'inactive':
      return 'Inactivo';
    case 'suspended':
      return 'Suspendido';
    case 'deleted':
      return 'Eliminado';
    default:
      return 'Desconocido';
  }
};

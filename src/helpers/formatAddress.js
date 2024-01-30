export const formatAddress = (address) => {
  return `${address.street.street} ${address.street_number}${address.door ? ` - ${address.door}` : ''}, ${address.street.locality.locality}, ${address.street.locality.province.province}`;
};

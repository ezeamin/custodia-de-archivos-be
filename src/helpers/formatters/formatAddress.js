export const formatAddressAsString = (address) => {
  return `${address.street.street} ${address.street_number}${address.door ? ` - ${address.door}` : ''}, ${address.street.locality.locality}, ${address.street.locality.province.province} ${address.observations ? `(${address.observations})` : ''}`;
};

export const formatAddress = (address) => ({
  street: {
    id: address.street.street_api_id,
    description: address.street.street,
  },
  locality: {
    id: address.street.locality.locality_api_id,
    description: address.street.locality.locality,
  },
  state: {
    id: address.street.locality.province.province_api_id,
    description: address.street.locality.province.province,
  },
  observations: address.observations,
  streetNumber: address.street_number,
  apt: address.door,
});

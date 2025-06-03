import React from 'react';
import type { AddressInfo } from '../types';

interface AddressDisplayProps {
  address: AddressInfo;
  className?: string;
  title?: string;
}

const AddressDisplay: React.FC<AddressDisplayProps> = ({ address, className, title }) => (
  <div className={className || ''}>
    {title && <h3 className="text-sm font-semibold text-gray-600 mb-1">{title}</h3>}
    <address className="text-sm text-gray-700 not-italic">
      <p className="font-medium">{address.recipientName}</p>
      {address.companyName && <p>{address.companyName}</p>}
      <p>{address.street}</p>
      {address.apartment && <p>{address.apartment}</p>}
      <p>{address.postalCode} {address.city}</p>
      <p>{address.country}</p>
    </address>
  </div>
);

export default AddressDisplay;
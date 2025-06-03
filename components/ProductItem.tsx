import React from 'react';
import type { OrderItemInfo } from '../types';
import { TagIcon } from './Icons';

interface ProductItemProps {
  item: OrderItemInfo;
  currency: string;
}

const formatCurrency = (amount: number, currency: string) => {
  return amount.toLocaleString('fr-FR', { style: 'currency', currency: currency });
};

const ProductItem: React.FC<ProductItemProps> = ({ item, currency }) => {
  return (
    <div className="flex py-3 items-start">
      <div className="bg-sky-100 p-1.5 rounded-md mr-3 shrink-0">
        <img src={item.imageUrl} alt={item.name} className="w-12 h-12 sm:w-14 sm:h-14 object-cover rounded" />
      </div>
      <div className="flex-grow">
        <h3 className="text-sm font-medium text-gray-700 leading-tight">
          {item.name}
          {item.quantity > 1 && <span className="text-gray-500 font-normal"> (x{item.quantity})</span>}
        </h3>
        {/* <p className="text-xs text-gray-500">Marque: {item.brand}</p> */}
        {/* <p className="text-xs text-gray-500">Quantité: {item.quantity}</p> */}
        {item.discountApplied && (
          <p className="text-xs text-green-600 flex items-center mt-0.5">
            <TagIcon className="w-3 h-3 mr-1"/> {item.discountApplied}
          </p>
        )}
      </div>
      <div className="text-right ml-2 shrink-0">
        <p className="text-sm font-medium text-gray-700">{formatCurrency(item.finalPrice, currency)}</p>
        {item.unitPrice * item.quantity !== item.finalPrice && !item.discountApplied && ( // Adjust logic if discount is applied elsewhere
           <p className="text-xs text-gray-500 line-through">{formatCurrency(item.unitPrice * item.quantity, currency)}</p>
        )}
      </div>
    </div>
  );
};

export default ProductItem;
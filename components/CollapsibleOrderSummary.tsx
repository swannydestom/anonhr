import React from 'react';
import type { OrderConfirmationDetails } from '../types';
import ProductItem from './ProductItem';
import { ChevronUpIcon, ChevronDownIcon, TagIcon, ShoppingCartIcon } from './Icons';

interface CollapsibleOrderSummaryProps {
  order: OrderConfirmationDetails;
  isOpen: boolean;
  onToggle: () => void;
}

const formatCurrency = (amount: number, currency: string) => {
  return amount.toLocaleString('fr-FR', { style: 'currency', currency: currency });
};

const CollapsibleOrderSummary: React.FC<CollapsibleOrderSummaryProps> = ({ order, isOpen, onToggle }) => {
  const { items, costSummary } = order;
  const originalTotal = costSummary.subtotal + costSummary.shipping;

  return (
    <div className="bg-sky-50 lg:h-full lg:border-l border-gray-200">
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls="order-summary-content"
        className="w-full flex justify-between items-center p-4 lg:p-6 text-left border-b border-gray-200"
      >
        <div className="flex items-center">
          <ShoppingCartIcon className="w-5 h-5 mr-2 text-cloud-pink-600 hidden lg:block" />
          <span className="font-medium text-cloud-pink-600 hover:text-cloud-pink-700">
            {isOpen ? 'Masquer le résumé de la commande' : 'Afficher le résumé de la commande'}
          </span>
          {isOpen ? <ChevronUpIcon className="w-5 h-5 ml-1 text-cloud-pink-600" /> : <ChevronDownIcon className="w-5 h-5 ml-1 text-cloud-pink-600" />}
        </div>
        <div className="text-right">
           {costSummary.totalSavings && costSummary.totalSavings > 0 && (
            <p className="text-xs text-gray-500 line-through">{formatCurrency(originalTotal, costSummary.currency)}</p>
           )}
          <p className="text-lg font-semibold text-gray-800">{formatCurrency(costSummary.total, costSummary.currency)}</p>
        </div>
      </button>

      <div id="order-summary-content" className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'} lg:max-h-full lg:opacity-100`}>
        <div className="p-4 lg:p-6 space-y-4">
          {items.map(item => (
            <ProductItem key={item.id} item={item} currency={costSummary.currency} />
          ))}
          
          <div className="pt-4 border-t border-gray-200 space-y-1 text-sm text-gray-700">
            <div className="flex justify-between">
              <span>Sous-total:</span>
              <span>{formatCurrency(costSummary.subtotal, costSummary.currency)}</span>
            </div>
            <div className="flex justify-between">
              <span>Expédition:</span>
              <span>{formatCurrency(costSummary.shipping, costSummary.currency)}</span>
            </div>
             {costSummary.totalSavings && costSummary.totalSavings > 0 && (
              <div className="flex justify-between text-green-600 font-medium">
                <span className="flex items-center"><TagIcon className="w-4 h-4 mr-1"/>ÉCONOMIES TOTALES:</span>
                <span>{formatCurrency(costSummary.totalSavings, costSummary.currency)}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold text-gray-800 pt-2 border-t border-gray-200 mt-2">
              <span>Total:</span>
              <span>{formatCurrency(costSummary.total, costSummary.currency)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollapsibleOrderSummary;
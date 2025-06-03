
import React, { useState } from 'react';
import type { OrderConfirmationDetails, VerificationFormData, AddressInfo } from './types';
import VerificationForm from './components/VerificationForm';
import MapDisplay from './components/MapDisplay';
import CollapsibleOrderSummary from './components/CollapsibleOrderSummary';
import AddressDisplay from './components/AddressDisplay';
import { CreditCardIcon, CheckCircleIcon, ChevronDownIcon, ArrowDownCircleIcon, TagIcon } from './components/Icons';

const orderData: OrderConfirmationDetails = {
  orderNumber: "4489", 
  trackingNumber: "94232853", 
  customerEmail: "djondobella@gmail.com",
  shippingAddress: {
    recipientName: "AUTO SECURITE", 
    street: "13 RUE DENIS PAPIN",
    city: "ROISSY EN BRIE", 
    postalCode: "77680", 
    country: "France", 
  },
  shippingMethod: "Livraison en point de retrait Mondial Relay (choix après le paiement)", 
  paymentDetails: { 
    method: "Carte de crédit",
    amountPaid: "62,63 €", 
  },
  billingAddress: { 
    recipientName: "Bella Djondo",
    street: "2 Rue des Aulnes",
    apartment: "Appartement 2",
    city: "Roissy-en-Brie",
    postalCode: "77680",
    country: "France",
  },
  items: [
    {
      id: "item001",
      name: "Curl Me Baby - Gelée capillaire bouclante et hydratante à l’aloe vera",
      brand: "Cloud Curls", 
      quantity: 3, 
      unitPrice: 19.70, 
      finalPrice: 59.10, 
      imageUrl: "https://cdn.shopify.com/s/files/1/0759/2732/2965/files/Curl-Me-Baby-Gel-e-capillaire-bouclante-et-hydratante-l-aloe-vera-Cloud-Curls-50006360818005_small.jpg?v=1747336988" 
    }
  ],
  costSummary: { 
    subtotal: 59.10, 
    shipping: 5.50,
    total: 62.63, 
    currency: "EUR",
    totalSavings: 1.97, 
  },
};

const formatAddressForMap = (address: AddressInfo): string => {
  let parts = [];
  if (address.companyName) parts.push(address.companyName);
  else parts.push(address.recipientName);
  parts.push(address.street);
  if (address.apartment) parts.push(address.apartment);
  parts.push(`${address.postalCode} ${address.city}`);
  return parts.filter(Boolean).join('<br>');
};

const HEADER_HEIGHT_PX = 85;


const App: React.FC = () => {
  const [isOrderSummaryOpen, setIsOrderSummaryOpen] = useState(true);
  const [isNotMyOrderFlow, setIsNotMyOrderFlow] = useState(false);
  const [showVerificationArea, setShowVerificationArea] = useState(false);
  
  // handleVerificationSubmit function is removed

  const toggleOrderSummary = () => {
    setIsOrderSummaryOpen(!isOrderSummaryOpen);
  };

  const handleReportOrderIssueClick = () => {
    setIsNotMyOrderFlow(true);
    setShowVerificationArea(true);
    
    setTimeout(() => {
      const section = document.getElementById('not-my-order-message-section');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 0); 
  };
  
  const shippingLatitude = 48.7950;
  const shippingLongitude = 2.6500;
  const shippingAddressStringForMap = formatAddressForMap(orderData.shippingAddress);
  const billingFirstName = orderData.billingAddress.recipientName.split(' ')[0] || "Client";

  return (
    <>
      <header className="w-full bg-white py-5 px-6 sm:px-8 border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-semibold text-gray-800">
            <a href="https://cloudcurls.fr" target="_blank" rel="noopener noreferrer">Cloud Curls</a>
          </h1>
        </div>
      </header>

      <div className={`flex flex-col lg:flex-row lg:h-[calc(100vh-${HEADER_HEIGHT_PX}px)]`}>
        <aside className={`w-full lg:w-2/5 xl:w-1/3 order-first lg:order-last ${isOrderSummaryOpen ? 'block' : 'hidden'} lg:block bg-sky-50 lg:overflow-y-auto border-l border-gray-200`}>
          <CollapsibleOrderSummary 
            order={orderData}
            isOpen={isOrderSummaryOpen}
            onToggle={toggleOrderSummary}
          />
        </aside>

        <main className="w-full lg:w-3/5 xl:w-2/3 order-last lg:order-first lg:overflow-y-auto bg-white">
          <div className="max-w-2xl mx-auto p-6 sm:p-8 space-y-8">
            
            {!isOrderSummaryOpen && (
              <div className="lg:hidden border-b border-gray-200 pb-4">
                  <button
                      onClick={toggleOrderSummary}
                      className="w-full flex justify-between items-center p-3 text-left bg-sky-50 hover:bg-sky-100 rounded-md border border-sky-200 transition-colors"
                      aria-label="Afficher le résumé de la commande"
                    >
                      <div className="flex items-center">
                        <ShoppingCartIcon className="w-5 h-5 mr-2 text-cloud-pink-600"/>
                        <span className="font-medium text-cloud-pink-600">Afficher le résumé ({formatCurrency(orderData.costSummary.total, orderData.costSummary.currency)})</span>
                      </div>
                      <ChevronDownIcon className="w-5 h-5 ml-1 text-cloud-pink-600" />
                  </button>
              </div>
            )}

            <section aria-labelledby="confirmation-heading">
              <div className="flex items-start space-x-3">
                <CheckCircleIcon className="w-10 h-10 text-cloud-pink-600 shrink-0 mt-1" aria-hidden="true"/>
                <div>
                  <p className="text-sm text-gray-500">Commande #{orderData.orderNumber}</p>
                  <h2 id="confirmation-heading" className="text-2xl sm:text-3xl font-semibold text-gray-800">
                    Merci, {billingFirstName}!
                  </h2>
                </div>
              </div>
            </section>

            <div className="mt-6 mb-6 text-center sm:text-left">
                <div className="text-center sm:text-left"> 
                    <button
                        onClick={handleReportOrderIssueClick}
                        className="text-sm text-cloud-pink-600 hover:text-cloud-pink-700 hover:underline focus:outline-none focus:ring-2 focus:ring-cloud-pink-500 rounded"
                        aria-controls="not-my-order-message-section"
                    >
                        Ce n'est pas ma commande ou j'ai un problème avec celle-ci.
                    </button>
                </div>
            </div>
            
            <div className="border-t border-b border-gray-200 divide-y divide-gray-200">
              <section className="py-6">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-cloud-pink-600 mb-2">Votre colis sera livré ici :</h3>
                <AddressDisplay address={orderData.shippingAddress} />
                <div className="mt-4">
                  <MapDisplay 
                    latitude={shippingLatitude} 
                    longitude={shippingLongitude} 
                    popupText={`<b>${orderData.shippingAddress.companyName || orderData.shippingAddress.recipientName}</b><br>${shippingAddressStringForMap}`} 
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Emplacement approximatif.
                  </p>
                </div>
                {orderData.trackingNumber && (
                  <p className="text-sm text-gray-600 mt-4">
                    Suivi Mondial Relay : <a href={`https://www.mondialrelay.fr/suivi-de-colis?numeroExpedition=${orderData.trackingNumber}&codePostal=${orderData.shippingAddress.postalCode}`} target="_blank" rel="noopener noreferrer" className="text-cloud-pink-600 hover:underline font-medium">{orderData.trackingNumber}</a>
                  </p>
                )}
              </section>

              <section className="py-6">
                  <h3 className="text-md font-semibold text-gray-700 mb-1">Coordonnées</h3>
                  <p className="text-sm text-gray-600">{orderData.customerEmail}</p>
              </section>

              <section className="py-6">
                  <h3 className="text-md font-semibold text-gray-700 mb-1">Mode d’expédition</h3>
                  <p className="text-sm text-gray-600">{orderData.shippingMethod}</p>
              </section>

              <section className="py-6">
                  <h3 className="text-md font-semibold text-gray-700 mb-1">Moyen de paiement</h3>
                  <p className="text-sm text-gray-600">{orderData.paymentDetails.method} - <span className="font-medium">{orderData.paymentDetails.amountPaid}</span></p>
              </section>
              
              <section className="py-6">
                  <AddressDisplay address={orderData.billingAddress} title="Adresse de facturation" />
              </section>
            </div>

            {showVerificationArea && (
              <>
                {isNotMyOrderFlow && ( 
                  <div id="not-my-order-message-section" className="mb-6 p-4 bg-yellow-50 border border-yellow-300 rounded-md text-yellow-800">
                    <h3 className="text-md font-semibold mb-2">Signaler une commande non reconnue</h3>
                    <p className="text-sm">
                      Nous prenons la sécurité de votre compte très au sérieux. Si vous ne reconnaissez pas cette commande, ou si vous pensez qu'elle a été passée sans votre autorisation, veuillez compléter le formulaire de vérification d'identité ci-dessous.
                    </p>
                    <p className="text-sm mt-2">
                      Cette étape est cruciale pour nous permettre de confirmer votre identité et de prendre les mesures appropriées, telles que l'annulation de la commande (si possible) et la sécurisation de votre compte.
                    </p>
                    <p className="text-sm mt-2">
                      Soyez assuré(e) que vos informations seront traitées de manière confidentielle et utilisées uniquement dans le but de résoudre ce problème.
                    </p>
                  </div>
                )}

                <section id="verification-form-section" aria-labelledby="verification-heading" className="pt-2">
                  <div className="flex items-center mb-3">
                    <CreditCardIcon className="w-5 h-5 mr-2 text-cloud-pink-600" />
                    <h2 id="verification-heading" className="text-lg font-semibold text-gray-800">
                      {isNotMyOrderFlow ? "Vérification d'Identité pour Commande Non Reconnue" : "Vérification de l'Identité"}
                    </h2>
                  </div>
                  <p className="text-gray-600 mb-4 text-sm">
                    {isNotMyOrderFlow 
                      ? "Pour nous aider à traiter votre signalement concernant cette commande, veuillez confirmer les informations de la carte potentiellement utilisée et votre code postal de facturation."
                      : "Pour des raisons de sécurité et pour finaliser votre commande, veuillez confirmer quelques informations de la carte de crédit utilisée ainsi que votre code postal de facturation."
                    }
                  </p>
                  <VerificationForm 
                    initialOrderNumber={orderData.orderNumber}
                    initialPostalCode={orderData.billingAddress.postalCode}
                  />
                  {/* Simulation notice removed */}
                </section>
              </>
            )}

            <footer className="pt-8 border-t border-gray-200">
              <div className="sm:flex sm:justify-between sm:items-center text-center sm:text-left">
                <p className="text-sm text-gray-600 mb-4 sm:mb-0">
                  Besoin d'aide ? <a href="https://cloudcurls.fr/pages/contact" target="_blank" rel="noopener noreferrer" className="text-cloud-pink-600 hover:underline font-medium">Nous contacter</a>
                </p>
                <a 
                  href="https://cloudcurls.fr" 
                  className="inline-block bg-gray-800 text-white px-6 py-3 rounded-md text-sm font-medium hover:bg-gray-700 transition duration-150 ease-in-out"
                >
                  Retour à la boutique
                </a>
              </div>
              <div className="text-center mt-10">
                <img 
                    src="https://cloudcurls.fr/cdn/shop/files/LOGOTYPE_CLOUD_CURS_NOIR_ET_BLANC_def_200x.png?v=1689268814" 
                    alt="Cloud Curls Logo" 
                    className="mx-auto h-7 opacity-70 mb-2"
                />
                <p className="text-xs text-gray-500">&copy; {new Date().getFullYear()} Cloud Curls. Tous droits réservés.</p>
                <p className="text-xs text-gray-400 mt-1">Page de démonstration.</p>
              </div>
            </footer>
          </div>
        </main>
      </div>
    </>
  );
};

// Helper function
const formatCurrency = (amount: number, currency: string) => {
  return amount.toLocaleString('fr-FR', { style: 'currency', currency: currency });
};

// Helper function for ShoppingCartIcon in App.tsx for mobile summary toggle
const ShoppingCartIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
  </svg>
);


export default App;
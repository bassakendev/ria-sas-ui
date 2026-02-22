import { createCheckoutSession } from '@/lib/stripe';
import { useState } from 'react';

export function useStripeCheckout() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startCheckout = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Utilise la fonction centralisée
      const url = await createCheckoutSession();

      if (!url) {
        throw new Error('URL de checkout non reçue');
      }

      // Redirection vers Stripe Checkout
      window.location.href = url;
    } catch (err: any) {
      const errorMessage =
        err?.message ||
        'Impossible de démarrer le paiement. Veuillez réessayer.';
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  const resetError = () => {
    setError(null);
  };

  return {
    isLoading,
    error,
    createCheckoutSession: startCheckout,
    resetError,
  };
}

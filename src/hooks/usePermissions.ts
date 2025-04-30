'use client';

import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';

export function usePermissions() {
  const [isEmployer, setIsEmployer] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // TODO: Buscar permissões do usuário no Firestore
        // Por enquanto, vamos considerar que o usuário é empregador
        setIsEmployer(true);
      } else {
        setIsEmployer(false);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return {
    isEmployer,
    isLoading,
    canEdit: isEmployer,
    canDelete: isEmployer,
    canUpload: isEmployer,
  };
} 
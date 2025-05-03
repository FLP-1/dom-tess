import { useState, useEffect, useCallback } from 'react';
import { useAppNotifications } from './useAppNotifications';
import debounce from 'lodash/debounce';

interface AutoSaveOptions {
  onSave: (data: any) => Promise<void>;
  debounceMs?: number;
  enabled?: boolean;
}

export function useFormAutoSave<T>(
  initialData: T,
  options: AutoSaveOptions
) {
  const [formData, setFormData] = useState<T>(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedData, setLastSavedData] = useState<T>(initialData);
  const notifications = useAppNotifications();

  // Função de salvamento com debounce
  const debouncedSave = useCallback(
    debounce(async (data: T) => {
      if (!options.enabled) return;
      
      try {
        setIsSaving(true);
        await options.onSave(data);
        setLastSavedData(data);
        notifications.showSuccess(
          'Rascunho salvo',
          'Suas alterações foram salvas automaticamente',
          { persistent: false }
        );
      } catch (error) {
        notifications.showError(
          'Erro ao salvar',
          'Não foi possível salvar suas alterações automaticamente',
          { persistent: false }
        );
      } finally {
        setIsSaving(false);
      }
    }, options.debounceMs || 2000),
    [options.onSave, options.enabled]
  );

  // Atualiza os dados e dispara o auto-save
  const updateFormData = useCallback((newData: Partial<T>) => {
    setFormData(prev => {
      const updated = { ...prev, ...newData };
      debouncedSave(updated);
      return updated;
    });
  }, [debouncedSave]);

  // Verifica se há alterações não salvas
  const hasUnsavedChanges = useCallback(() => {
    return JSON.stringify(formData) !== JSON.stringify(lastSavedData);
  }, [formData, lastSavedData]);

  // Força o salvamento imediato
  const forceSave = useCallback(async () => {
    if (!options.enabled || !hasUnsavedChanges()) return;

    try {
      setIsSaving(true);
      await options.onSave(formData);
      setLastSavedData(formData);
      notifications.showSuccess(
        'Dados salvos',
        'Suas alterações foram salvas com sucesso',
        { persistent: false }
      );
    } catch (error) {
      notifications.showError(
        'Erro ao salvar',
        'Não foi possível salvar suas alterações',
        { persistent: true }
      );
    } finally {
      setIsSaving(false);
    }
  }, [formData, options.enabled, options.onSave, hasUnsavedChanges]);

  // Limpa o formulário
  const resetForm = useCallback(() => {
    setFormData(initialData);
    setLastSavedData(initialData);
  }, [initialData]);

  useEffect(() => {
    return () => {
      if (debouncedSave) {
        debouncedSave.cancel();
      }
    };
  }, [options.onSave, options.debounceMs, options.enabled]);

  return {
    formData,
    updateFormData,
    isSaving,
    hasUnsavedChanges,
    forceSave,
    resetForm
  };
} 
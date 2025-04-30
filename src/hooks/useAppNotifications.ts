import { useToast } from '@chakra-ui/react';
import { NotificationService } from '@/services/notificationService';
import { useAuth } from '@/contexts/AuthContext';

interface NotificationOptions {
  persistent?: boolean; // Se true, salva no banco de dados
  pushNotification?: boolean; // Se true, envia push notification
  sms?: boolean; // Se true, envia SMS
}

export function useAppNotifications() {
  const toast = useToast();
  const { user } = useAuth();

  const showSuccess = async (title: string, message?: string, options: NotificationOptions = {}) => {
    // Sempre mostra toast
    toast({
      title,
      description: message,
      status: 'success',
      duration: 4000,
      isClosable: true,
    });

    // Se for persistente, salva no banco
    if (options.persistent && user) {
      await NotificationService.createNotification({
        userId: user.id,
        title,
        message: message || title,
        type: 'system',
        read: false,
      });
    }

    // Envia push notification se solicitado
    if (options.pushNotification) {
      await NotificationService.sendPushNotification({ title, description: message || title });
    }

    // Envia SMS se solicitado
    if (options.sms) {
      await NotificationService.sendSMS({ title, description: message || title });
    }
  };

  const showError = async (title: string, message?: string, options: NotificationOptions = {}) => {
    // Sempre mostra toast
    toast({
      title,
      description: message,
      status: 'error',
      duration: 5000,
      isClosable: true,
    });

    // Se for persistente, salva no banco
    if (options.persistent && user) {
      await NotificationService.createNotification({
        userId: user.id,
        title,
        message: message || title,
        type: 'system',
        read: false,
      });
    }
  };

  const showWarning = async (title: string, message?: string, options: NotificationOptions = {}) => {
    // Sempre mostra toast
    toast({
      title,
      description: message,
      status: 'warning',
      duration: 5000,
      isClosable: true,
    });

    // Se for persistente, salva no banco
    if (options.persistent && user) {
      await NotificationService.createNotification({
        userId: user.id,
        title,
        message: message || title,
        type: 'system',
        read: false,
      });
    }

    // Envia push notification se solicitado
    if (options.pushNotification) {
      await NotificationService.sendPushNotification({ title, description: message || title });
    }
  };

  const showInfo = async (title: string, message?: string, options: NotificationOptions = {}) => {
    // Sempre mostra toast
    toast({
      title,
      description: message,
      status: 'info',
      duration: 4000,
      isClosable: true,
    });

    // Se for persistente, salva no banco
    if (options.persistent && user) {
      await NotificationService.createNotification({
        userId: user.id,
        title,
        message: message || title,
        type: 'system',
        read: false,
      });
    }
  };

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
} 
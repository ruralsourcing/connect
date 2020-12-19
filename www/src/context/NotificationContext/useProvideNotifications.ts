import { useToasts } from 'react-toast-notifications';
import {
    NotificationContext,
    Notification,
} from './NotificationContext';

export function useProvideNotifications(): NotificationContext {
    const { addToast } = useToasts();
    function setNotification(notification: Notification): void {
        addToast(notification.message, { appearance: notification.appearance });
    }
    return {
        setNotification,
    };
}

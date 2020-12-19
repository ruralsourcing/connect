import React, { createContext, useContext } from 'react';
import { useProvideNotifications } from './useProvideNotifications';
import { NotificationEnum } from './constants';

export type Notification = {
    message: string;
    appearance: NotificationEnum;
};

export type NotificationContext = {
    setNotification(notification: Notification): void;
};

const notificationContext = createContext<NotificationContext>(null as any);

// eslint-disable-next-line react/prop-types
export const NotificationProvider = ({ children }: JSX.ElementChildrenAttribute): JSX.Element => {
    const notifier = useProvideNotifications();
    return (
        <notificationContext.Provider value={notifier}>
            {children}
        </notificationContext.Provider>
    );
};

export const useNotifier = (): NotificationContext =>
    useContext(notificationContext);

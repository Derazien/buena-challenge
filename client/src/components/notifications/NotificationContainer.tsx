'use client';

import React from 'react';
import { useNotification } from './NotificationContext';
import NotificationToast from './NotificationToast';

const NotificationContainer: React.FC = () => {
    const { notifications, removeNotification } = useNotification();

    if (notifications.length === 0) {
        return null;
    }

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col-reverse space-y-reverse space-y-2">
            {notifications.map(notification => (
                <NotificationToast
                    key={notification.id}
                    notification={notification}
                    onDismiss={removeNotification}
                />
            ))}
        </div>
    );
};

export default NotificationContainer;
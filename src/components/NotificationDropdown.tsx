
import React from 'react';
import { Link } from 'react-router-dom';
import { useNotifications } from '@/context/NotificationContext';
import { X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Button } from './ui/button';

interface NotificationDropdownProps {
  onClose: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ onClose }) => {
  const { notifications, markAsRead } = useNotifications();

  const handleClick = (id: string) => {
    markAsRead(id);
    onClose();
  };

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-50 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-sm font-medium">Notifications</h3>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6">
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="px-4 py-6 text-center text-gray-500">
            No notifications
          </div>
        ) : (
          notifications.map((notification) => (
            <Link
              key={notification.id}
              to={notification.actionUrl || "#"}
              className={`block px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                !notification.read ? "bg-blue-50" : ""
              }`}
              onClick={() => handleClick(notification.id)}
            >
              <div className="flex justify-between">
                <p className={`text-sm ${!notification.read ? "font-medium" : "text-gray-700"}`}>
                  {notification.message}
                </p>
                {!notification.read && (
                  <span className="h-2 w-2 bg-blue-500 rounded-full ml-2"></span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
              </p>
            </Link>
          ))
        )}
      </div>
      
      {notifications.length > 0 && (
        <div className="px-4 py-2 border-t border-gray-100">
          <Link 
            to="/notifications" 
            className="text-xs text-blue-600 hover:text-blue-800"
            onClick={onClose}
          >
            View all notifications
          </Link>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;

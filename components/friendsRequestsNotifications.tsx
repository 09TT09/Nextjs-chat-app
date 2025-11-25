"use client";

interface FriendsRequestsNotificationsProps {
  notifications: string[];
}

export default function FriendsRequestsNotifications({notifications} : FriendsRequestsNotificationsProps)  {

  return(
    <div className="flex flex-col min-h-0 max-h-3/15 p-6 border rounded-md bg-primary border-accent shadow-lg">
      <h3 className="text-lg text-white mb-3">Notifications</h3>
      <div className="flex-1 flex flex-col pr-3 overflow-y-auto">
        {notifications.length > 0 ? (
        notifications.map((message, i) => (
        <p key={i} className="text-sm text-gray-200">{message}</p>))
        ) : (
          <p className="text-gray-400 text-sm">Aucune notification</p>
        )}
      </div>
    </div>
  )
}
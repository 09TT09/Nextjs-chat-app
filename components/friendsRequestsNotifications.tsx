"use client";

interface FriendsRequestsNotificationsProps {
  notifications: string[];
}

export default function FriendsRequestsNotifications({notifications} : FriendsRequestsNotificationsProps)  {

  return(
    <div className="flex flex-col p-6 border rounded-md bg-primary border-accent shadow-lg">
      {notifications.length > 0 ? (
      notifications.map((message, i) => (
      <p key={i} className="text-sm text-gray-200">{message}</p>))
      ) : (
        <p className="text-gray-400 text-sm">Aucune notification</p>
      )}
    </div>
  )
}
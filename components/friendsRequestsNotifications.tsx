"use client";

interface FriendsRequestsNotificationsProps {
  notifications: string[];
}

export default function FriendsRequestsNotifications({notifications} : FriendsRequestsNotificationsProps)  {

  return(
    <div className="flex flex-col gap-3 min-h-48 max-h-3/15 p-3 border rounded-md bg-primary border-accent shadow-lg lg:p-6 lg:min-h-0">
      <h3 className="text-md text-white md:text-lg">Notifications</h3>
      <div className="flex-1 flex flex-col pr-3 overflow-y-auto">
        {notifications.length > 0 ? (
          notifications.map((message, i) => (
            <div className="flex p-2 mb-2 w-full border rounded-md border-accent bg-secondary">
              <p key={i} className="text-sm text-gray-200">{message}</p>
            </div>
          ))
        ) : (
          <>
            <p className="text-gray-400 text-sm">Aucune notification</p>
          </>
        )}
      </div>
    </div>
  )
}
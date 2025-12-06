"use client";

interface FriendCodeProps {
  myFriendCode: string;
}

export default function FriendCode({myFriendCode} : FriendCodeProps)  {
  return(
    <div className="flex flex-col gap-3 p-3 border rounded-md bg-primary border-accent shadow-lg lg:p-6">
      <h3 className="text-md text-white md:text-lg">Votre code ami : {myFriendCode}</h3>
    </div>
  )
}
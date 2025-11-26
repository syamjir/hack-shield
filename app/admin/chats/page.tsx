import Message from "@/models/Message";
import { connectToMongo } from "@/lib/connectToMongo";
import { getUser } from "../adminServerActions";
import { cookies } from "next/headers";

export default async function AdminChats() {
  await connectToMongo();

  const rooms = await Message.aggregate([
    {
      $group: {
        _id: "$room",
        lastMessage: { $last: "$text" },
        lastMessageAt: { $last: "$createdAt" },
        unread: {
          $sum: { $cond: [{ $eq: ["$read", false] }, 1, 0] },
        },
      },
    },

    {
      $addFields: {
        userId: { $toObjectId: "$_id" },
      },
    },

    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        pipeline: [{ $project: { email: 1, _id: 0 } }],
        as: "user",
      },
    },

    { $unwind: "$user" },

    { $sort: { lastMessageAt: -1 } },
  ]);

  console.log(rooms);

  // Format time
  const formatTime = (date: any) => {
    if (!date) return "";
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div>
      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-semibold text-primary-a20">Chat List</h2>
        <p className="text-dark-a0/50 mt-1">
          Manage and view all user conversations
        </p>
      </div>

      {/* CHAT LIST */}
      <div className="grid grid-cols-2 gap-4 mt-8">
        {rooms.map((room: any) => (
          <a
            key={room._id}
            href={`/admin/chats/${room._id}`}
            className="
              flex items-center justify-between
              p-4 mb-2
              rounded-xl
              bg-[var(--surface-a10)]
              border border-[var(--surface-a20)]
              hover:border-[var(--primary-a20)]
              transition-all duration-200
              shadow-sm hover:shadow-md
              cursor-pointer
            "
          >
            {/* LEFT SIDE */}
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div
                className="
                  w-12 h-12 rounded-full 
                  bg-gradient-to-br from-[#4A8FE7] to-[#2D6EDC] 
                  flex items-center justify-center 
                  text-white font-semibold text-lg
                "
              >
                {room._id.toString().slice(0, 2).toUpperCase()}
              </div>

              {/* Text Section */}
              <div>
                <h3 className="text-base font-semibold text-white">
                  User - {room.user.email}
                </h3>

                <p className="text-sm text-[var(--surface-a40)] truncate max-w-[220px]">
                  {room.lastMessage || "No messages yet"}
                </p>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="flex flex-col items-end">
              {/* Time */}
              <p className="text-[11px] text-[var(--surface-a40)]">
                {formatTime(room.lastMessageAt)}
              </p>

              {/* Unread badge OR Green dot */}
              {room.unread > 0 ? (
                <span
                  className="
                    mt-2 rounded-full px-2 py-[2px]
                    text-xs font-semibold 
                    bg-red-500 text-white 
                  "
                >
                  {room.unread}
                </span>
              ) : (
                <span className="mt-3 w-2 h-2 rounded-full bg-green-400"></span>
              )}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

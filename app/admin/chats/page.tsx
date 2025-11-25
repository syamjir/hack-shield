import Message from "@/models/Message";
import { connectToMongo } from "@/lib/connectToMongo";

export default async function AdminChats() {
  await connectToMongo();

  const rooms = await Message.aggregate([
    {
      $group: {
        _id: "$room",
        lastMessage: { $last: "$text" },
        unread: {
          $sum: { $cond: [{ $eq: ["$read", false] }, 1, 0] },
        },
      },
    },
  ]);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Chats</h2>

      <div className="grid grid-cols-1 gap-4">
        {rooms.map((room) => (
          <a
            key={room._id}
            href={`/admin/chats/${room._id}`}
            className="p-4 rounded-lg bg-[var(--surface-a10)] border border-[var(--surface-a20)] hover:border-[var(--primary-a20)]"
          >
            <h3 className="text-lg font-semibold">User: {room._id}</h3>
            <p className="text-sm text-[var(--surface-a40)]">
              {room.lastMessage}
            </p>

            {room.unread > 0 && (
              <p className="text-xs text-red-400 mt-1">
                {room.unread} unread messages
              </p>
            )}
          </a>
        ))}
      </div>
    </div>
  );
}

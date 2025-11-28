import { getUser } from "../../adminServerActions";
import DeleteUserButton from "../../_components/DeleteUserButton";
import { cookies } from "next/headers";

export default async function UserDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const cookieStore = cookies();
  const jwt = (await cookieStore).get("jwt")?.value;

  if (!jwt) {
    return (
      <div className="p-6 text-red-600 text-center font-semibold">
        Unauthorized. Please log in first.
      </div>
    );
  }

  const { id } = await params;
  const { data: user } = await getUser(id, jwt);

  if (!user)
    return (
      <div className="p-6 text-red-600 text-center font-semibold">
        User not found.
      </div>
    );

  return (
    <div className="space-y-10 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-primary-a20">
          User Details
        </h2>
        <p className="text-dark-a0/50 mt-1">
          Detailed information about the selected user.
        </p>
      </div>

      {/* User Info Card */}
      <div className="p-6 rounded-xl bg-[var(--surface-a10)] border border-[var(--surface-a20)] shadow-md space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-dark-a0/10 rounded-full flex items-center justify-center text-xl font-bold text-dark-a0">
            {user.email[0].toUpperCase()}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-dark-a0">{user.email}</h3>
            <p className="text-sm text-dark-a0/50">User ID: {user._id}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-dark-a0/60">Created At</p>
            <h3 className="text-md text-dark-a0">
              {new Date(user.createdAt).toLocaleString()}
            </h3>
          </div>
          <div>
            <p className="text-sm text-dark-a0/60">Actions</p>
            <div className="flex gap-2 mt-1">
              <DeleteUserButton userId={user._id} jwt={jwt} />
              <a
                href={`/admin/chats/${user._id}`}
                className="px-3 py-1.5 bg-[var(--primary-a20)] hover:bg-[var(--primary-a30)] text-white rounded-lg border border-[var(--surface-a20)] transition"
              >
                Chat
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

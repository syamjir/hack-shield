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
      <div className="p-6 rounded-xl bg-[var(--surface-a10)] border border-[var(--surface-a20)] shadow-sm space-y-3">
        <div className="space-y-2">
          <p className="text-sm text-[var(--surface-a40)]">User ID</p>
          <h3 className="text-lg font-semibold text-[var(--surface-a50)]">
            {user._id}
          </h3>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-[var(--surface-a40)]">Email</p>
          <h3 className="text-lg font-semibold text-[var(--surface-a50)]">
            {user.email}
          </h3>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-[var(--surface-a40)]">Created At</p>
          <h3 className="text-lg text-[var(--surface-a50)]">
            {new Date(user.createdAt).toLocaleString()}
          </h3>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-4">
        {/* Delete User */}
        <DeleteUserButton userId={user._id} jwt={jwt} />

        {/* Chat Button */}
        <a
          href={`/admin/chats/${user._id}`}
          className="px-4 py-2 bg-[var(--primary-a20)] hover:bg-[var(--primary-a30)] text-white rounded-lg border border-[var(--surface-a20)] transition"
        >
          Chat with User
        </a>
      </div>
    </div>
  );
}

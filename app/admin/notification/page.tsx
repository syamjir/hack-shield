import { whoAmI } from "@/app/dashboard/settings/settingServerActions";
import { cookies } from "next/headers";
import NotificationForm from "./notificationForm";

export default async function AdminNotification() {
  try {
    const cookieStore = cookies();
    const jwt = (await cookieStore).get("jwt")?.value;

    if (!jwt) {
      return (
        <div className="p-6 text-red-500">
          Unauthorized. Please log in first.
        </div>
      );
    }

    const data = await whoAmI(jwt);

    return <NotificationForm user={data.data} />;
  } catch (err) {
    console.error("Error fetching user:", err);
    return (
      <div className="p-6 text-red-500">
        Failed to load notification form |{" "}
        {err instanceof Error ? err.message : ""}
      </div>
    );
  }
}

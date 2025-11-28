import { whoAmI } from "./settingServerActions";
import SettingsClient from "./SettingsClient";
import { cookies } from "next/headers";

export default async function SettingsPage() {
  const cookieStore = cookies(); // synchronous
  const jwt = (await cookieStore).get("jwt")?.value;

  if (!jwt) {
    return (
      <div className="p-6 text-red-500">Unauthorized. Please log in first.</div>
    );
  }

  const user = await whoAmI(jwt);
  return <SettingsClient user={user.data} />;
}

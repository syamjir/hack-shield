import { cookies } from "next/headers";
import { whoAmI } from "../dashboard/settings/settingServerActions";
import HomeClient from "./HomeClient";

export default async function HomePage() {
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

    const { data: user } = await whoAmI(jwt);
    console.log(user);
    return <HomeClient currentUser={user} />;
  } catch (err) {
    console.error("Error fetching user:", err);
    return (
      <div className="p-6 text-red-500">
        Failed to fetch user. | {err instanceof Error ? err.message : ""}
      </div>
    );
  }
}

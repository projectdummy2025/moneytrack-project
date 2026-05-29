// Profile has been restructured into the Settings page.
// This redirect ensures old links / bookmarks still work.
import { redirect } from "next/navigation";

export default function ProfilePage() {
  redirect("/settings");
}

// History has merged into the Reports page.
// This redirect ensures old links / bookmarks still work.
import { redirect } from "next/navigation";

export default function HistoryPage() {
  redirect("/reports");
}

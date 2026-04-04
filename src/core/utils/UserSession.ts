import { cookies } from "next/headers";

export async function getSessionUserId() {
  // Membaca userId dari cookie yang diset saat login
  const cookieStore = await cookies();
  const session = cookieStore.get("moneytrack_session");
  return session?.value || null;
}

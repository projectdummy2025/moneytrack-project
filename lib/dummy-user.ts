/**
 * Dummy User Utility for semi-development mode.
 * In a real app, this would be replaced by auth() from Auth.js or equivalent.
 */

// A fixed UUID for development that corresponds to a dummy user in the database.
export const DEV_USER_ID = "00000000-0000-0000-0000-000000000000";

export async function getDevUser() {
  return {
    id: DEV_USER_ID,
    name: "Developer",
    email: "dev@moneytrack.local",
  };
}

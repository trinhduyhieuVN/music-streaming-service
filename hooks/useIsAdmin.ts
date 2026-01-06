"use client";

import { useUser } from "@/hooks/useUser";

// Admin email - only this user can manage songs
const ADMIN_EMAIL = "trinhduyhieu239@gmail.com";

const useIsAdmin = () => {
  const { user } = useUser();
  
  const isAdmin = user?.email === ADMIN_EMAIL;
  
  return { isAdmin, adminEmail: ADMIN_EMAIL };
};

export default useIsAdmin;

// Admin configuration
export const ADMIN_EMAIL = "trinhduyhieu239@gmail.com";

export const isAdminEmail = (email: string | undefined): boolean => {
  return email === ADMIN_EMAIL;
};

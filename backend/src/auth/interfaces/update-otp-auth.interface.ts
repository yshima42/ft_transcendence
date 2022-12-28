export interface UpdateOtpAuth {
  isOtpAuthEnabled?: boolean;
  qrcodeUrl?: string | null;
  secret?: string | null;
}

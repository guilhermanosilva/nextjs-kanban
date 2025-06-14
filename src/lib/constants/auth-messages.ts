export enum ErrorCode {
  InvalidCredentials = "invalid_credentials",
  EmailNotConfirmed = "email_not_confirmed",
}

export const authMessages: Record<ErrorCode, string> = {
  [ErrorCode.InvalidCredentials]: "Email ou senha inválidos. Tente novamente.",
  [ErrorCode.EmailNotConfirmed]: "Email não confirmado. Verifique seu email e confirme seu endereço de email.",
} as const;

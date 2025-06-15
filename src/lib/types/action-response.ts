export type ActionResponse<T = unknown> = {
  data?: T | null;
  error?: string;
  success: boolean;
};

export const Logger = {
  info: (msg: string, ...args: any[]) => console.error(`[INFO] ${msg}`, ...args),
  error: (msg: string, ...args: any[]) => console.error(`[ERROR] ${msg}`, ...args),
  warn: (msg: string, ...args: any[]) => console.error(`[WARN] ${msg}`, ...args),
  debug: (msg: string, ...args: any[]) => console.error(`[DEBUG] ${msg}`, ...args),
};

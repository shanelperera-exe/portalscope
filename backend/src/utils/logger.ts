export type LogLevel = 'INFO' | 'WARN' | 'ERROR';

export interface LogFields {
  method?: string;
  route?: string;
  status?: number;
  durationMs?: number;
  [key: string]: unknown;
}

export function log(level: LogLevel, message: string, fields: LogFields = {}): void {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...fields,
  };
  const line = JSON.stringify(entry);
  if (level === 'ERROR') {
    console.error(line);
    return;
  }
  if (level === 'WARN') {
    console.warn(line);
    return;
  }
  console.info(line);
}

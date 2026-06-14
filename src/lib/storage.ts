const isClient = typeof window !== 'undefined';

function get(key: string): string | null {
  if (!isClient) return null;
  try { return localStorage.getItem(key); }
  catch { return null; }
}

function set(key: string, value: string): void {
  if (!isClient) return;
  try { localStorage.setItem(key, value); }
  catch { /* quota exceeded — ignore */ }
}

function remove(key: string): void {
  if (!isClient) return;
  try { localStorage.removeItem(key); }
  catch { /* ignore */ }
}

function getJSON<T>(key: string): T | null {
  const raw = get(key);
  if (!raw) return null;
  try { return JSON.parse(raw) as T; }
  catch { return null; }
}

function setJSON<T>(key: string, value: T): void {
  try { set(key, JSON.stringify(value)); }
  catch { /* ignore */ }
}

const storage = { get, set, remove, getJSON, setJSON };
export default storage;

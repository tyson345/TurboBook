import * as XLSX from 'xlsx';

/**
 * Client-side Excel store backed by SheetJS.
 *
 * The workbook is kept in localStorage as a base64 .xlsx blob so it survives
 * reloads, and can be downloaded as a real Excel file at any time. Three sheets
 * are maintained:
 *   - Users          (sign-up records)
 *   - Login Logs     (one row per successful login with the chosen service)
 *   - Password Resets (one row per completed password reset)
 */

const STORAGE_KEY = 'turbobook_excel_v1';

export const SERVICE_TYPES = [
  'Website Creation',
  'App Development',
  'Management & Maintenance',
  'SEO / Marketing',
  'Branding & Design',
  'Consultation',
  'Other',
] as const;

export const SIGNUP_PURPOSES = [
  'Website Creation',
  'App Development',
  'Management & Maintenance',
  'SEO / Marketing',
  'Branding & Design',
  'Consultation',
  'Other',
] as const;

export interface StoredUser {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  location: string;
  purpose: string;
  password: string;
  role: 'admin' | 'customer';
  createdAt: string;
}

interface SheetSpec {
  name: string;
  headers: string[];
}

const SHEETS: Record<string, SheetSpec> = {
  users: { name: 'Users', headers: ['ID', 'Full Name', 'Phone', 'Email', 'Location', 'Purpose', 'Password', 'Role', 'Created At'] },
  loginLogs: { name: 'Login Logs', headers: ['Email', 'Role', 'Service Type', 'Login At'] },
  passwordResets: { name: 'Password Resets', headers: ['Contact', 'Contact Type', 'Verified At', 'Reset At'] },
};

const ADMIN_EMAIL = 'admin@turbobook.com';
const ADMIN_PASSWORD = 'Admin@123';
const ADMIN_SEED_KEY = 'turbobook_admin_seeded';

function seedAdminIfNeeded(wb: XLSX.WorkBook) {
  if (localStorage.getItem(ADMIN_SEED_KEY)) return;
  const ws = ensureSheet(wb, 'users');
  const aoa = XLSX.utils.sheet_to_json<any[]>(ws, { header: 1, blankrows: false });
  const exists = aoa.slice(1).some((r) => String(r[3] ?? '').toLowerCase() === ADMIN_EMAIL);
  if (!exists) {
    appendRow(wb, 'users', [
      'ADMIN-001', 'TurboBook Admin', '+1 000 000 0000', ADMIN_EMAIL, 'HQ', 'Administration', ADMIN_PASSWORD, 'admin', new Date().toISOString(),
    ]);
  }
  localStorage.setItem(ADMIN_SEED_KEY, '1');
}

function emptyWorkbook(): XLSX.WorkBook {
  const wb = XLSX.utils.book_new();
  Object.values(SHEETS).forEach(({ name, headers }) => {
    const ws = XLSX.utils.aoa_to_sheet([headers]);
    XLSX.utils.book_append_sheet(wb, ws, name);
  });
  return wb;
}

function loadWorkbook(): XLSX.WorkBook {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const binary = atob(stored);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      const wb = XLSX.read(bytes, { type: 'array' });
      seedAdminIfNeeded(wb);
      persistWorkbook(wb);
      return wb;
    } catch {
      // fall through to a fresh workbook
    }
  }
  const wb = emptyWorkbook();
  seedAdminIfNeeded(wb);
  persistWorkbook(wb);
  return wb;
}

function persistWorkbook(wb: XLSX.WorkBook) {
  const arr = XLSX.write(wb, { type: 'array', bookType: 'xlsx' }) as ArrayBuffer;
  const bytes = new Uint8Array(arr);
  let binary = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + chunk)));
  }
  localStorage.setItem(STORAGE_KEY, btoa(binary));
}

function ensureSheet(wb: XLSX.WorkBook, key: string): XLSX.WorkSheet {
  const spec = SHEETS[key];
  let ws = wb.Sheets[spec.name];
  if (!ws) {
    ws = XLSX.utils.aoa_to_sheet([spec.headers]);
    XLSX.utils.book_append_sheet(wb, ws, spec.name);
  }
  return ws;
}

function sheetToRows<T>(wb: XLSX.WorkBook, key: string, map: (row: any[]) => T): T[] {
  const ws = ensureSheet(wb, key);
  const aoa = XLSX.utils.sheet_to_json<any[]>(ws, { header: 1, blankrows: false });
  return aoa.slice(1).filter((r) => r.some((c) => c !== undefined && c !== '')).map(map);
}

function appendRow(wb: XLSX.WorkBook, key: string, row: any[]) {
  const ws = ensureSheet(wb, key);
  const aoa = XLSX.utils.sheet_to_json<any[]>(ws, { header: 1, blankrows: false });
  aoa.push(row);
  const newWs = XLSX.utils.aoa_to_sheet(aoa);
  wb.Sheets[SHEETS[key].name] = newWs;
}

function uid() {
  return 'U' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6).toUpperCase();
}

/* ----------------------------- Public API ----------------------------- */

export function addUser(input: Omit<StoredUser, 'id' | 'createdAt'>): StoredUser {
  const wb = loadWorkbook();
  const user: StoredUser = { ...input, id: uid(), createdAt: new Date().toISOString() };
  appendRow(wb, 'users', [
    user.id, user.fullName, user.phone, user.email, user.location, user.purpose, user.password, user.role, user.createdAt,
  ]);
  persistWorkbook(wb);
  return user;
}

export function findUserByContact(contact: string): StoredUser | null {
  const wb = loadWorkbook();
  const normalized = contact.trim().toLowerCase();
  const digits = contact.replace(/\D/g, '');
  const rows = sheetToRows<StoredUser>(wb, 'users', (r) => ({
    id: String(r[0] ?? ''),
    fullName: String(r[1] ?? ''),
    phone: String(r[2] ?? ''),
    email: String(r[3] ?? '').toLowerCase(),
    location: String(r[4] ?? ''),
    purpose: String(r[5] ?? ''),
    password: String(r[6] ?? ''),
    role: (String(r[7] ?? 'customer') === 'admin' ? 'admin' : 'customer') as 'admin' | 'customer',
    createdAt: String(r[8] ?? ''),
  }));
  return (
    rows.find((u) => u.email === normalized || (digits && u.phone.replace(/\D/g, '') === digits)) ?? null
  );
}

export function verifyLogin(email: string, password: string): StoredUser | null {
  const user = findUserByContact(email);
  if (!user) return null;
  return user.password === password ? user : null;
}

export function updateUserPassword(contact: string, newPassword: string): boolean {
  const wb = loadWorkbook();
  const ws = ensureSheet(wb, 'users');
  const aoa = XLSX.utils.sheet_to_json<any[]>(ws, { header: 1, blankrows: false });
  const normalized = contact.trim().toLowerCase();
  const digits = contact.replace(/\D/g, '');
  let found = false;
  for (let i = 1; i < aoa.length; i++) {
    const row = aoa[i] ?? [];
    const email = String(row[3] ?? '').toLowerCase();
    const phone = String(row[2] ?? '').replace(/\D/g, '');
    if (email === normalized || (digits && phone === digits)) {
      row[6] = newPassword;
      found = true;
      break;
    }
  }
  if (!found) return false;
  wb.Sheets[SHEETS.users.name] = XLSX.utils.aoa_to_sheet(aoa);
  persistWorkbook(wb);
  return true;
}

export function logLoginSession(email: string, role: string, serviceType: string) {
  const wb = loadWorkbook();
  appendRow(wb, 'loginLogs', [email, role, serviceType, new Date().toISOString()]);
  persistWorkbook(wb);
}

export function logPasswordReset(contact: string, contactType: 'email' | 'phone') {
  const wb = loadWorkbook();
  const now = new Date().toISOString();
  appendRow(wb, 'passwordResets', [contact, contactType, now, now]);
  persistWorkbook(wb);
}

export function getAdminCredentials() {
  return { email: ADMIN_EMAIL, password: ADMIN_PASSWORD };
}

export function downloadExcel() {
  const wb = loadWorkbook();
  const arr = XLSX.write(wb, { type: 'array', bookType: 'xlsx' }) as ArrayBuffer;
  const blob = new Blob([arr], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'turbobook-data.xlsx';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function getAllUsers(): StoredUser[] {
  const wb = loadWorkbook();
  return sheetToRows<StoredUser>(wb, 'users', (r) => ({
    id: String(r[0] ?? ''),
    fullName: String(r[1] ?? ''),
    phone: String(r[2] ?? ''),
    email: String(r[3] ?? '').toLowerCase(),
    location: String(r[4] ?? ''),
    purpose: String(r[5] ?? ''),
    password: String(r[6] ?? ''),
    role: (String(r[7] ?? 'customer') === 'admin' ? 'admin' : 'customer') as 'admin' | 'customer',
    createdAt: String(r[8] ?? ''),
  }));
}

export interface LoginLog {
  email: string;
  role: string;
  serviceType: string;
  loginAt: string;
}

export function getAllLoginLogs(): LoginLog[] {
  const wb = loadWorkbook();
  return sheetToRows<LoginLog>(wb, 'loginLogs', (r) => ({
    email: String(r[0] ?? ''),
    role: String(r[1] ?? ''),
    serviceType: String(r[2] ?? ''),
    loginAt: String(r[3] ?? ''),
  }));
}

export interface PasswordResetRecord {
  contact: string;
  contactType: string;
  verifiedAt: string;
  resetAt: string;
}

export function getAllPasswordResets(): PasswordResetRecord[] {
  const wb = loadWorkbook();
  return sheetToRows<PasswordResetRecord>(wb, 'passwordResets', (r) => ({
    contact: String(r[0] ?? ''),
    contactType: String(r[1] ?? ''),
    verifiedAt: String(r[2] ?? ''),
    resetAt: String(r[3] ?? ''),
  }));
}

export function getCustomerCount(): number {
  return getAllUsers().filter((u) => u.role === 'customer').length;
}

export function getLoginCount(): number {
  return getAllLoginLogs().length;
}

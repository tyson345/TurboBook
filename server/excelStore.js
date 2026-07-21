import ExcelJS from 'exceljs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '..', 'data');
const FILE_PATH = path.join(DATA_DIR, 'turbobook-data.xlsx');

const SHEETS = {
  users: {
    name: 'Users',
    headers: ['ID', 'Full Name', 'Phone', 'Email', 'Location', 'Purpose', 'Password', 'Created At'],
  },
  loginLogs: {
    name: 'Login Logs',
    headers: ['Email', 'Service Type', 'Login At'],
  },
  passwordResets: {
    name: 'Password Resets',
    headers: ['Contact', 'Contact Type', 'Verified At', 'Reset At'],
  },
};

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

async function createWorkbook() {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'TurboBook';
  workbook.created = new Date();

  Object.values(SHEETS).forEach(({ name, headers }) => {
    const sheet = workbook.addWorksheet(name);
    sheet.addRow(headers);
    sheet.getRow(1).font = { bold: true };
    sheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE9D5FF' },
    };
    headers.forEach((_, i) => {
      sheet.getColumn(i + 1).width = 22;
    });
  });

  await workbook.xlsx.writeFile(FILE_PATH);
  return workbook;
}

export async function getWorkbook() {
  ensureDataDir();
  const workbook = new ExcelJS.Workbook();
  if (fs.existsSync(FILE_PATH)) {
    await workbook.xlsx.readFile(FILE_PATH);
    return workbook;
  }
  return createWorkbook();
}

async function saveWorkbook(workbook) {
  ensureDataDir();
  await workbook.xlsx.writeFile(FILE_PATH);
}

function getSheet(workbook, key) {
  const { name } = SHEETS[key];
  let sheet = workbook.getWorksheet(name);
  if (!sheet) {
    sheet = workbook.addWorksheet(name);
    sheet.addRow(SHEETS[key].headers);
  }
  return sheet;
}

export async function addUser(user) {
  const workbook = await getWorkbook();
  const sheet = getSheet(workbook, 'users');
  sheet.addRow([
    user.id,
    user.fullName,
    user.phone,
    user.email,
    user.location,
    user.purpose,
    user.password,
    user.createdAt,
  ]);
  await saveWorkbook(workbook);
}

export async function findUserByEmail(email) {
  const workbook = await getWorkbook();
  const sheet = getSheet(workbook, 'users');
  const rows = [];
  sheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;
    rows.push({
      id: String(row.getCell(1).value ?? ''),
      fullName: String(row.getCell(2).value ?? ''),
      phone: String(row.getCell(3).value ?? ''),
      email: String(row.getCell(4).value ?? '').toLowerCase(),
      location: String(row.getCell(5).value ?? ''),
      purpose: String(row.getCell(6).value ?? ''),
      password: String(row.getCell(7).value ?? ''),
      createdAt: String(row.getCell(8).value ?? ''),
    });
  });
  return rows.find((u) => u.email === email.toLowerCase()) ?? null;
}

export async function findUserByContact(contact) {
  const normalized = contact.trim().toLowerCase();
  const workbook = await getWorkbook();
  const sheet = getSheet(workbook, 'users');
  let found = null;
  sheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1 || found) return;
    const email = String(row.getCell(4).value ?? '').toLowerCase();
    const phone = String(row.getCell(3).value ?? '').replace(/\D/g, '');
    const contactPhone = contact.replace(/\D/g, '');
    if (email === normalized || (contactPhone && phone === contactPhone)) {
      found = {
        id: String(row.getCell(1).value ?? ''),
        fullName: String(row.getCell(2).value ?? ''),
        phone: String(row.getCell(3).value ?? ''),
        email,
        location: String(row.getCell(5).value ?? ''),
        purpose: String(row.getCell(6).value ?? ''),
        password: String(row.getCell(7).value ?? ''),
        createdAt: String(row.getCell(8).value ?? ''),
        rowNumber,
      };
    }
  });
  return found;
}

export async function updateUserPassword(contact, newPassword) {
  const user = await findUserByContact(contact);
  if (!user) return false;

  const workbook = await getWorkbook();
  const sheet = getSheet(workbook, 'users');
  sheet.getRow(user.rowNumber).getCell(7).value = newPassword;
  await saveWorkbook(workbook);
  return true;
}

export async function logLoginSession(email, serviceType) {
  const workbook = await getWorkbook();
  const sheet = getSheet(workbook, 'loginLogs');
  sheet.addRow([email, serviceType, new Date().toISOString()]);
  await saveWorkbook(workbook);
}

export async function logPasswordReset(contact, contactType) {
  const workbook = await getWorkbook();
  const sheet = getSheet(workbook, 'passwordResets');
  sheet.addRow([contact, contactType, new Date().toISOString(), new Date().toISOString()]);
  await saveWorkbook(workbook);
}

export function getExcelFilePath() {
  return FILE_PATH;
}

import * as XLSX from "xlsx";

export function readExcelToJson(filePath: string): any[] {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  return XLSX.utils.sheet_to_json(sheet, { defval: "" });
}

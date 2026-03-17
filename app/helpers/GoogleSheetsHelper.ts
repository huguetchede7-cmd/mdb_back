import { google, sheets_v4 } from "googleapis";

export interface SheetQueryOptions {
  sheetName?: string;
  startRow?: number;   // pagination
  limit?: number;      // nombre de lignes
  maxColumn?: string;  // ex: "AN"
}

export class GoogleSheetsHelper {
  private sheets: sheets_v4.Sheets;

  // ⚡ Cache léger (données déjà filtrées)
  private static cache = new Map<string, { data: string[][]; time: number }>();
  private static CACHE_TTL = 30_000; // 30s

  constructor() {
    const auth = new google.auth.GoogleAuth({
      keyFile: "public/service-account-sheet-redaer.json",
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    this.sheets = google.sheets({ version: "v4", auth });
  }

  async getData(
    spreadsheetId: string,
    options: SheetQueryOptions = {},
    where: Record<string, string> = {}
  ): Promise<string[][]> {
    const {
      sheetName,
      startRow = 1,
      limit = 30,
      maxColumn = "AN",
    } = options;

    const cacheKey = JSON.stringify({
      spreadsheetId,
      sheetName,
      startRow,
      limit,
      maxColumn,
      where,
    });

    const now = Date.now();
    const cached = GoogleSheetsHelper.cache.get(cacheKey);

    if (cached && now - cached.time < GoogleSheetsHelper.CACHE_TTL) {
      return cached.data;
    }

    // 🎯 RANGE STRICT (colonnes + lignes)
    const endRow = startRow + limit;
    const range = sheetName
      ? `${sheetName}!A${startRow}:${maxColumn}${endRow}`
      : `A${startRow}:${maxColumn}${endRow}`;

    const res = await this.sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = res.data.values ?? [];
    if (rows.length === 0) return [];

    const header = rows[0].map(h => h?.trim() ?? "");
    let data = rows.slice(1);

    // 🔎 WHERE (sur petit volume, donc OK)
    if (Object.keys(where).length > 0) {
      const indexMap: Record<string, number> = {};

      for (const key of Object.keys(where)) {
        const idx = header.indexOf(key);
        if (idx === -1) {
          throw new Error(`Colonne "${key}" introuvable`);
        }
        indexMap[key] = idx;
      }

      data = data.filter(row =>
        Object.entries(where).every(([key, value]) =>
          (row[indexMap[key]] ?? "").trim() === value.trim()
        )
      );
    }

    const result = [header, ...data];

    GoogleSheetsHelper.cache.set(cacheKey, {
      data: result,
      time: now,
    });

    return result;
  }
}

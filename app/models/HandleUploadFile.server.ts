import { json } from "@remix-run/node";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import { WinstonLoggerService } from "app/services/winton-logger.server";

export const handleUploadFile = async (file: File) => {
    const logger = new WinstonLoggerService();
    logger.info("[START] handleUploadFile");
    if (!file) {
        return json({ error: "No file uploaded" }, { status: 400 })
    };

    const buffer = await file.arrayBuffer();
    const binaryStr = Buffer.from(buffer).toString("binary");
    let data: any[] = [];

    if (file.type === "text/csv") {
        data = Papa.parse(binaryStr, { header: true }).data;
    } else if (file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
        const workbook = XLSX.read(buffer, { type: "buffer" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        data = XLSX.utils.sheet_to_json(sheet);
    }

    logger.info("[END] handleUploadFile", {
        data
    });

    return json({ success: true, data });
}
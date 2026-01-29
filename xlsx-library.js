/**
 * SheetJS (XLSX.js) Implementation Guide
 * Purpose: Reading, modifying, and writing Excel files via JS
 */

// 1. Import the library (ensure 'xlsx' is available in your environment)
const XLSX = require('xlsx');
const fs = require('fs');

try {
    // --- STEP 1: READING THE FILE ---
    // Read the file from the disk into a 'workbook' object
    // 'srcOfSrc' is the path from your previous logic
    const workbook = XLSX.readFile(msg._copySrc.source);

    // Get the name of the first sheet
    const firstSheetName = workbook.SheetNames[0];
    
    // Access the actual sheet data
    const worksheet = workbook.Sheets[firstSheetName];

    // --- STEP 2: CONVERTING DATA FOR JS USE ---
    // Convert the worksheet to a JSON array (easier to manipulate in JS)
    // Each row becomes a JS Object where keys are column headers
    let data = XLSX.utils.sheet_to_json(worksheet);

    // --- STEP 3: MANIPULATION EXAMPLE ---
    // Let's add a "Processed_Date" column to every row
    const processDate = new Date().toISOString();
    data = data.map(row => {
        return {
            ...row,
            Processed_Date: processDate,
            Status: "Updated via Node-RED"
        };
    });

    // --- STEP 4: CONVERTING BACK TO EXCEL FORMAT ---
    // Create a new empty workbook
    const newWorkbook = XLSX.utils.book_new();

    // Convert our modified JSON array back into a worksheet
    const newWorksheet = XLSX.utils.json_to_sheet(data);

    // Append the worksheet to the new workbook
    XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, "ProcessedData");

    // --- STEP 5: WRITING TO DISK ---
    // Write the workbook to the destination path
    // We use 'binary' type for standard .xlsx files
    XLSX.writeFile(newWorkbook, msg._copySrc.destination);

    // --- FEEDBACK ---
    node.status({fill: "green", shape: "dot", text: "Excel processed successfully"});
    msg.payload = "File updated and saved to: " + msg._copySrc.destination;

} catch (err) {
    node.error("XLSX Error: " + err.message);
    node.status({fill: "red", shape: "ring", text: "XLSX Processing Failed"});
}

return msg;

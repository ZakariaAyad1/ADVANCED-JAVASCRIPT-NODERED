/**
 * EXCEL SYNC SERVICE
 * Purpose: This script updates existing records and appends new ones
 * in the "Capacidad" sheet of a target workbook.
 */

// Load the library (ensure xlsx-populate is installed in your Node-RED env)
const XlsxPopulate = require('xlsx-populate');

// 1. Open the file asynchronously from the path provided in the message
XlsxPopulate.fromFileAsync(msg.filename)
    .then(workbook => {
        const sheet = workbook.sheet("Capacidad");
        
        // --- SECTION 1: UPDATE EXISTING RECORDS ---
        // Iterate through tasks that were identified as "already existing"
        Object.keys(msg.tareasToModify).forEach(att => {
            const record = msg.tareasToModify[att];
            
            // Build cell address (e.g., "D" + "15") to update the 'Consumido' column
            const cellAddress = msg.keyOfConsumido + record.row;
            
            // Apply the final calculated value to the specific cell
            sheet.cell(cellAddress).value(record.consomidoFinal);
        });

        // --- SECTION 2: APPEND NEW RECORDS ---
        // Iterate through tasks identified as "new"
        Object.keys(msg.tareasToAdd).forEach(att => {
            const newRecord = msg.tareasToAdd[att];

            // Map new record properties to their respective columns at the current row pointer
            sheet.cell(msg.keyOfPeticion + startAtRow).value(newRecord.codeE);
            sheet.cell(msg.keyOfDescripcion + startAtRow).value(newRecord.tarea);
            sheet.cell(msg.keyOfPlanificado + startAtRow).value(newRecord.utes);
            sheet.cell(msg.keyOfConsumido + startAtRow).value(newRecord.utes);

            // Increment row pointer to ensure the next record is written on a new line
            startAtRow++;
        });

        // 2. Save all changes back to the original file path
        return workbook.toFileAsync(msg.filename);
    })
    .then(() => {
        // SUCCESS: File writing is complete
        node.warn("Excel Sync: Destination file updated successfully.");
        
        // Pass the message to the next node in the flow
        node.send(msg); 
        
        // Notify Node-RED that the operation is finished (clean up)
        node.done();
    })
    .catch(err => {
        // ERROR HANDLING: Catch file locks, missing paths, or permission issues
        node.error(`Excel Sync Error: ${err.message}`, msg);
        
        // Signal completion even on failure to avoid hanging nodes
        node.done();
    });

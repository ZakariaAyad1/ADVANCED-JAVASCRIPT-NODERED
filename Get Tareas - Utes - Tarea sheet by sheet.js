// Declarations : 
// our tables :
// contains Objects like : {"tarea" : "tarea" , "utes" : "value of utes"}
msg.sheets = [];

// contains utes values
msg.utes = [];

// contains code values
msg.codeValues = [];

let objet = new Object();
objet = {"tarea" : "" , "utes" : 0 , "codeE" : null};

//***************************************************************Find key of columns************************************************************************ */


// You go through the attributes of the msg.payload object , and you keep those that do not have color 
// This code is filtering the msg.payload object to stay only with the columns B (Tareas) that are not colored


msg.onlyCellsNotColored = Object.keys(msg.payload)
    .filter(key => key.includes(msg.keyOfTareasColumn) && (!msg.payload[key].hasOwnProperty("s") || (msg.payload[key].hasOwnProperty("s") && !msg.payload[key].s.hasOwnProperty("fgColor")) || (msg.payload[key].hasOwnProperty("s") && msg.payload[key].s.hasOwnProperty("fgColor") && msg.payload[key].s.fgColor.hasOwnProperty("rgb") && msg.payload[key].s.fgColor['rgb'] == 'FFFFFF') || (msg.payload[key].hasOwnProperty("s") && msg.payload[key].s.hasOwnProperty("fgColor") && msg.payload[key].s.fgColor.hasOwnProperty("theme") && !msg.payload[key].s.fgColor.hasOwnProperty("tint"))))
    .reduce((obj, key) => {
        let number = key.split(msg.keyOfTareasColumn)[1]
        if (msg.payload[key].v != null) {
            obj[number] = msg.payload[key].v;

            objet.tarea = msg.payload[key].v
            msg.sheets.push(objet);

            objet = { "tarea": "", "utes": 0, "codeE": "" }
        }
        return obj;
    }, {});


node.warn(msg.sheets)


// this code is filtering the msg.payload to get value of columns C 
for (let key of Object.keys(msg.payload)) {
    let cell = msg.payload[key];
    //Only Column C (Utes)
    if (cell && key.includes(msg.keyOfUtesColumn)) {
        let number = key.split(msg.keyOfUtesColumn)[1]
        //I compare that the current row (number) is included in the msg.onlyCellsANotColored object,
        if (Object.keys(msg.onlyCellsNotColored).includes(number)) {
            if (cell.v != null) {
                msg.utes.push(cell.v);
            } else {
                msg.utes.push(0);
            }
        }
    }
}

node.warn(msg.utes)

// This code is filtering the msg.payload to get values of column E (Tarea)  


for (let atribute of Object.keys(msg.payload)) {
    let cell = msg.payload[atribute];
    // Only key includes Column E (Tarea)
    if (cell && atribute.includes(msg.keyOfTareaColumn)) {
        let number = atribute.split(msg.keyOfTareaColumn)[1];
        //I check if the current row (number) is included in the msg.onlyCellsNotColored object
        if (Object.keys(msg.onlyCellsNotColored).includes(number)) {
            msg.codeValues.push(cell.v);
        }
    }
}



node.warn(msg.codeValues)



for (let key of Object.keys(msg.utes)) {

    msg.sheets[key].utes = msg.utes[key]
    if (msg.codeValues[key] != null) {
        msg.sheets[key].codeE = msg.codeValues[key]
    }
    
}


// // this code is filtering the msg.payload to get value of column Code E 
// for (let key of Object.keys(msg.payload)) {
//     let cell = msg.payload[key];
//     //Only Column E 
//     if (cell && key.includes(msg.keyOfTareaColumn)) {
//         let number = key.split(msg.keyOfTareaColumn)[1];
//         //I compare that the current row (number) is included in the msg.onlyCellsANotColored object
//         if (Object.keys(msg.onlyCellsNotColored).includes(number)) {
//             msg.codeValues.push(cell.v);
//         }
//     }
// }




return msg;

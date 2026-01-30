// Our source data (usually msg.payload from an Excel node)
const tasks = [
    { tarea: "Fix Pipe", utes: 50, status: "pending" },
    { tarea: "Mow Lawn", utes: 120, status: "completed" },
    { tarea: "Paint Wall", utes: 80, status: "pending" },
    { tarea: "Clean Roof", utes: 200, status: "pending" }
];

/**
 * STEP 1: FILTER
 * Purpose: Create a new array containing ONLY items that pass a test.
 * Logic: Keep the task if status is "pending".
 */
const pendingTasks = tasks.filter((item) => {
    // Return true to keep, false to discard
    return item.status === "pending";
}); 
// Result: [{Fix Pipe}, {Paint Wall}, {Clean Roof}] (Mow Lawn is gone)


/**
 * STEP 2: MAP
 * Purpose: Transform every item in the array into something else.
 * Logic: Create a list of just the task names, but in UPPERCASE.
 */
const taskNames = pendingTasks.map((item) => {
    // We return only a string instead of the whole object
    return item.tarea.toUpperCase();
});
// Result: ["FIX PIPE", "PAINT WALL", "CLEAN ROOF"]


/**
 * STEP 3: REDUCE
 * Purpose: Squash an entire array down into ONE single value (like a sum).
 * Arguments: (accumulator, current_item)
 */
const totalUtes = pendingTasks.reduce((total, item) => {
    // 'total' starts at 0 (the second argument below)
    // Every loop, we add the current item's utes to the total
    return total + item.utes;
}, 0); // <--- This 0 is the starting value for 'total'
// Result: 330 (50 + 80 + 200)


// ---------------------------------------------------------
// PROFESSIONAL "CHAINED" VERSION
// In Node.js, you usually combine these into one clean block:
// ---------------------------------------------------------

msg.payload = tasks
    .filter(t => t.status === "pending")             // 1. Filter
    .map(t => ({ ...t, tarea: t.tarea.toUpperCase() })) // 2. Transform names
    .reduce((acc, t) => acc + t.utes, 0);            // 3. Sum utes

return msg;

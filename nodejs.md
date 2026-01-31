
The following snippets are designed for a **Function Node**, assuming you are operating at a **C1 linguistic level** where you require precision and efficiency over verbose explanations.

---

## 1. The `msg` Object Manipulation

In Node-RED, the `msg` object is your primary vehicle for data. You must handle it without "mutating" the original reference unexpectedly.

* **Cloning an Object (The Spread Operator):**
Use this to create a copy of the payload while adding or modifying a specific property.
```javascript
msg.payload = { ...msg.payload, newStatus: "Processed" };

```


* **Property Access (Optional Chaining):**
Prevent "Cannot read property of undefined" errors when navigating deep Excel objects.
```javascript
const taskName = msg.payload?.data?.tarea || "Unknown";

```


* **Deleting Properties:**
Clean your `msg` before sending it to the next node to save memory.
```javascript
delete msg.internalTempData;

```



---

## 2. Array Power-User Methods

When processing rows from a workbook, avoid `for` loops. These functional methods are more readable and "Git-friendly."

* **Transforming Data (`.map`):**
```javascript
msg.payload = msg.payload.map(row => ({
    ...row,
    utes: row.utes * 1.1 // Add 10% margin
}));

```


* **Searching (`.find`):**
```javascript
const targetTask = msg.payload.find(t => t.id === "TASK-101");

```


* **Filtering (`.filter`):**
```javascript
msg.pending = msg.payload.filter(t => t.status !== "completed");

```



---

## 3. Node-RED Context & Lifecycle

Your Function Node has access to `context`, `flow`, and `global` storage. This is how you "remember" things between different messages.

* **Storing a Value:**
```javascript
flow.set("lastProcessedRow", 150);

```


* **Retrieving a Value (with default):**
```javascript
const startRow = flow.get("lastProcessedRow") || 1;

```


* **Asynchronous Signaling:**
Always use `node.done()` when your logic involves a Promise (like `XlsxPopulate`).
```javascript
someAsyncFunc().then(() => {
    node.send(msg);
    node.done();
}).catch(node.error);

```



---

## 4. String & Formatting (For UI Display)

Since you are using `rx-view-action`, you often need to format strings for the frontend.

* **Multi-line Formatting:**
```javascript
msg.displayText = `Total Tasks: ${msg.count}\nPath: ${msg.path}`;

```


* **Sanitizing for HTML:**
```javascript
const safeHtml = msg.rawText.replace(/</g, "&lt;").replace(/>/g, "&gt;");

```



---

## 5. Error Handling Pattern

To prevent your entire flow from stopping, wrap sensitive operations (like file parsing) in a robust block.

```javascript
try {
    const data = JSON.parse(msg.payload);
    // Logic here
} catch (err) {
    node.error("JSON Parsing failed: " + err.message, msg);
    // You can also send to a second output for errors
    return [null, msg]; 
}

```

---

### Why this is essential:

This "Cheat Sheet" moves you away from **Imperative Programming** (telling the computer *how* to do every step) toward **Declarative Programming** (describing *what* you want the data to look like). This is the hallmark of a senior developer.


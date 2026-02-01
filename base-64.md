In simple terms, **Base64** is a binary-to-text encoding scheme. It takes data that computers read (binary/bytes) and translates it into a string of 64 specific printable characters that humans can read and systems can easily transport.


---

## 1. Why do we use it?

Many legacy systems (like email or certain web protocols) were designed to handle only **text**, not binary files (like images or PDFs). If you try to send a raw binary file through these systems, the data can get corrupted.

Base64 "disguises" the binary data as safe, standard text, ensuring it reaches its destination intact.

---

## 2. How it Works (The "64" Characters)

Base64 uses a very specific "alphabet" consisting of:

* **A–Z** (26 characters)
* **a–z** (26 characters)
* **0–9** (10 characters)
* **+** and **/** (2 characters)
* **=** (Used as "padding" at the end to make the string the right length)

### The Logic:

1. It takes **3 bytes** of data (24 bits).
2. It splits those 24 bits into **4 groups** of 6 bits each.
3. Each 6-bit group corresponds to one of the 64 characters in the Base64 table.

---

## 3. Base64 in Node.js / Node-RED

Since you are working with files, you will often need to convert a **Buffer** (raw data) to a **Base64 string**.

### Convert File to Base64:

```javascript
const fs = require('fs');

// Read an image as a Buffer
const bitmap = fs.readFileSync('report.xlsx');

// Convert Buffer to Base64 string
const base64String = bitmap.toString('base64');

console.log(base64String); 
// Output: UEsDBBQAAAAIA... (a very long string)

```

### Use Case: Displaying an Image in a Dashboard

If you want to show an image inside your `rx-view-action` or a template node without a URL, you use a **Data URI**:

```html
<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..." />

```

---

## 4. The Trade-off: Size

The main disadvantage of Base64 is **efficiency**. Because it turns 3 bytes into 4 characters, the resulting string is roughly **33% larger** than the original file.

* **Original File:** 100 KB
* **Base64 String:** ~133 KB

> **Pro-tip for your Excel project:** If you are storing attachments in your workbook, avoid storing them as Base64 inside cells if the file is large, as it will make the Excel file extremely slow. Instead, save the file to the disk and store the **path** in the Excel cell.

---

### Summary Table

| Feature | Description |
| --- | --- |
| **Input** | Any binary data (Images, PDFs, Executables). |
| **Output** | A text string using A-Z, a-z, 0-9, +, /. |
| **Main Use** | Transporting data over text-only protocols. |
| **Size Impact** | Increases file size by approximately 33%. |


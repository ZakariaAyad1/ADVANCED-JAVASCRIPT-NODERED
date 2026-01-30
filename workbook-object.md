In the world of **SheetJS (`xlsx`)** and **XlsxPopulate**, the `workbook` object is a high-level container that represents the entire Excel file. It is not just a list of data; it is a complex structure of sheets, metadata, and cell properties.

Here is the full breakdown of the `workbook` object format when parsed in JavaScript.

---

## 1. The High-Level Structure

A standard workbook object follows this hierarchy:

```javascript
{
    // 1. List of all sheet names in order
    SheetNames: ["Capacidad", "Sheet2", "Metadata"],

    // 2. The actual data, keyed by the sheet names above
    Sheets: {
        "Capacidad": { 
            "!ref": "A1:E500", // The range of used cells
            "A1": { v: "Tarea", t: "s" }, // Cell A1
            "B1": { v: "Utes", t: "n" },  // Cell B1
            "!cols": [...], // Column widths/styling
            "!merges": [...] // List of merged cell ranges
        },
        "Sheet2": { ... }
    },

    // 3. File properties (Author, Dates, etc.)
    Props: {
        Author: "Elisa Sanchez",
        CreatedDate: Date("2024-05-20T..."),
        Title: "Sync Report"
    },

    // 4. Workbook-wide settings
    Workbook: {
        Views: [{...}],
        Names: [] // Named ranges
    }
}

```

---

## 2. The Cell Object Format

Inside `workbook.Sheets["SheetName"]["A1"]`, each cell is itself an object. Understanding these "keys" is vital for your logic:

| Key | Name | Description | Example |
| --- | --- | --- | --- |
| **`v`** | **Value** | The actual raw value of the cell. | `120` or `"Fix Pipe"` |
| **`t`** | **Type** | The data type (s=string, n=number, b=boolean, d=date). | `"n"` |
| **`w`** | **Text** | The formatted text (how it looks in Excel). | `"$120.00"` |
| **`f`** | **Formula** | The Excel formula if the cell is calculated. | `SUM(B1:B10)` |
| **`s`** | **Style** | Metadata about colors, fonts, and borders. | `{ fill: { fgColor: { rgb: "FFFF00" } } }` |

---

## 3. Special "Keys" (Metadata)

SheetJS uses keys starting with `!` to store information about the sheet structure:

* **`!ref`**: The "Range." If this is missing, the sheet is empty. It tells the system where the data starts and ends (e.g., `A1:Z99`).
* **`!rows`**: An array of objects defining row heights and hidden states.
* **`!cols`**: An array defining column widths.
* **`!merges`**: An array of objects like `{s: {r:0, c:0}, e: {r:1, c:0}}` which tells the system that cells A1 and A2 are merged.

---

## 4. XlsxPopulate vs. SheetJS Format

While the description above is for **SheetJS**, **XlsxPopulate** (the one you used for the `.then()` chain) uses a **Functional Object**.

Instead of accessing raw properties like `workbook.Sheets.Capacidad.A1`, you use **Methods**:

```javascript
// XlsxPopulate Style
const val = workbook.sheet("Capacidad").cell("A1").value(); 
const style = workbook.sheet("Capacidad").cell("A1").style("fillColor");

```

---

### Comparison Table

| Feature | SheetJS (`xlsx`) | XlsxPopulate |
| --- | --- | --- |
| **Primary Use** | Fast Reading / JSON conversion | Professional Writing / Styling |
| **Access Style** | Direct Object Access (`.Sheets["A1"]`) | Chained Methods (`.sheet().cell()`) |
| **Memory** | Very lightweight | Heavier (keeps style in memory) |
| **Formulas** | Reads results | Can write/execute formulas |

---








In the **SheetJS (xlsx)** library, a cell object (like `"A1"`) is a simple JavaScript object where each key represents a specific attribute of that Excel cell. While you usually only see `v` and `t`, the full structure can contain several other properties depending on how the file was parsed.

Here is the complete specification for a single cell object:

### 1. The Core Properties

These are the keys you will interact with 99% of the time:

| Key | Name | Description | Example |
| --- | --- | --- | --- |
| **`v`** | **Value** | The raw value of the cell. | `123.45` or `"Tarea"` |
| **`t`** | **Type** | The data type (1-character code). | `"n"` (number), `"s"` (string) |
| **`w`** | **Formatted Text** | The value as it appears in Excel (with currency, dates, etc.). | `"$123.45"` |
| **`f`** | **Formula** | The A1-style formula string. | `SUM(A2:A10)` |
| **`r`** | **Rich Text** | An array/object representing styled text segments. | (See Rich Text below) |
| **`z`** | **Number Format** | The format string associated with the cell. | `"0.00%"` |

---

### 2. The Data Type Codes (`t`)

The `t` property uses a single letter to define the "flavor" of the data:

* **`s`**: String (Text)
* **`n`**: Number
* **`b`**: Boolean (`true`/`false`)
* **`d`**: Date (Only if the `cellDates` option is set to true)
* **`e`**: Error (e.g., `#VALUE!`, `#DIV/0!`)
* **`z`**: Empty/Stub cell

---

### 3. The Styling Object (`s`)

If you have **styles enabled** (using a tool like `xlsx-js-style` or pro versions), the `s` key contains the visual metadata:

```javascript
"A1": {
  "v": "Tarea",
  "t": "s",
  "s": {
    "fill": {
      "fgColor": { "rgb": "FFFF00" } // Yellow background
    },
    "font": {
      "name": "Arial",
      "sz": 12,
      "bold": true,
      "color": { "rgb": "FF0000" } // Red text
    },
    "alignment": {
      "vertical": "center",
      "horizontal": "center"
    },
    "border": {
      "top": { "style": "thin", "color": { "auto": 1 } }
    }
  }
}

```

---

### 4. Special Attributes

* **`l` (Link)**: If the cell is a hyperlink, this object contains the target URL.
* Example: `l: { Target: "https://google.com", Tooltip: "Click me" }`


* **`c` (Comments)**: An array of comments/notes attached to the cell.
* **`h` (HTML)**: An HTML rendering of the cell's content (rarely used unless specified during parsing).

---

### Summary for your Logic

When you were doing this in your code:
`if (msg.payload[key].v != null)`

You were checking the **Raw Value**. If you wanted to check if a cell was specifically a **number** before doing math on "Utes", you would check:
`if (msg.payload[key].t === 'n')`


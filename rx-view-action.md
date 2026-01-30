the **rx-view-action** node is the "bridge" that pushes updates from the server directly to the user's screen in real-time. It uses **EJS (Embedded JavaScript)** for templating.

Here is the breakdown of the syntax used within the node's **Message** and **Submission** properties.

---

### 1. Data Injection Syntax (`<%= %>` vs `<%- %>`)

This is the most critical part of the syntax. It determines how your variables from `msg.messages` or `msg.submission` are displayed.

| Syntax | Action | Use Case |
| --- | --- | --- |
| **`<%= variable %>`** | **Escaped** output. | Use for plain text or numbers (e.g., `count`). It prevents code injection. |
| **`<%- variable %>`** | **Raw/Unescaped** output. | Use for **HTML**. This allows your `<br>`, `<div>`, and styles to actually render. |
| **`<% if (condition) { %>`** | **Logic** tag. | Use for "Scriptlets" (loops or if-statements) that don't print text directly. |

---

### 2. The `msg.messages` Object

The `rx-view-action` node is hard-wired to look at `msg.messages`. Any key you create inside that object becomes a variable inside the node's configuration.

**In your Function Node:**

```javascript
msg.messages = {
    user: "Elisa",
    count: 5
};

```

**In the Node's Message Property:**

```html
Hola <%= user %>, has añadido <%= count %> tareas.

```

---

### 3. Reactive Submission Syntax

If you want to update the actual fields on the form (the inputs, the tables, the labels) without refreshing the whole page, you use `msg.submission`.

The syntax follows the **Data Binding** of your form:

```javascript
msg.submission = {
    nombre_campo_en_formulario: "Nuevo Valor",
    columna_utes: 120
};

```

When this hits the `rx-view-action` node, the browser finds the field named `nombre_campo_en_formulario` and changes its value instantly via WebSockets.

---

### 4. Advanced Logic: The "Loop" Syntax

If you didn't want to build the list in a Function Node, you could technically do it inside the `rx-view-action` Message property using EJS logic:

```html
<ul>
  <% msg.tareasToAdd.forEach(function(task) { %>
    <li><%= task.tarea %></li>
  <% }); %>
</ul>

```

* `<% ... %>` starts the loop.
* `<%= task.tarea %>` prints the name.
* `<% }); %>` closes the loop.

---

### 5. Summary of Node Properties

| Property | Purpose | Syntax Style |
| --- | --- | --- |
| **Action Type** | Defines if the view refreshes or redirects. | Dropdown Selection |
| **Form** | The ID of the target AXETFLOWS form. | String/Dropdown |
| **Message** | The text/HTML shown in the popup. | HTML + EJS (`<%= %>`) |
| **Type Message** | Controls color (success, danger, etc.). | Dropdown (Parametric via EJS) |

---

### Pro-Tip for Git & AXETFLOWS

If you are version-controlling this, remember that the **syntax within the node configuration** is stored in the Node-RED `flows.json` file. If you want to keep your logic clean, do as much "formatting" as possible in the **Function Node** and keep the `rx-view-action` syntax as simple as possible (just calling `<%- tasks %>`).

Would you like me to show you how to use **Conditional Syntax** to show a different message if `count` is 0 versus if it is 10?

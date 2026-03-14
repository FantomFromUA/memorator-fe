import fs from "node:fs";
import path from "node:path";

const chunks = [];
for await (const chunk of process.stdin) {
  chunks.push(chunk);
}
const data = JSON.parse(Buffer.concat(chunks).toString());

const toolName = data.tool_name;
const toolInput = data.tool_input;

const filePath = toolInput?.file_path;
if (filePath && !filePath.endsWith(".md")) {
  const dir = path.dirname(filePath);
  const baseName = path.basename(filePath, path.extname(filePath));
  const mdPath = path.join(dir, `${baseName}.md`);

  const now = new Date().toISOString();
  let entry = `\n## ${now}\n\n`;

  if (toolName === "Write") {
    const lineCount = (toolInput.content || "").split("\n").length;
    entry += `**Tool:** Write  \n**File:** \`${path.basename(filePath)}\`  \n**Summary:** File written (${lineCount} lines).\n`;
  } else if (toolName === "Edit") {
    const oldSnippet = (toolInput.old_string || "")
      .trim()
      .slice(0, 120)
      .replaceAll("\n", " ");
    const newSnippet = (toolInput.new_string || "")
      .trim()
      .slice(0, 120)
      .replaceAll("\n", " ");
    entry += `**Tool:** Edit  \n**File:** \`${path.basename(filePath)}\`  \n**Replaced:** \`${oldSnippet}\`  \n**With:** \`${newSnippet}\`\n`;
  }

  if (fs.existsSync(mdPath)) {
    fs.appendFileSync(mdPath, entry);
  } else {
    fs.writeFileSync(mdPath, `# Change log: ${path.basename(filePath)}\n` + entry);
  }
}

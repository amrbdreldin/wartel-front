// PostToolUse hook: eslint --fix only the .ts/.tsx file Claude just edited.
// The repo has no Prettier, and lint has pre-existing errors, so this never blocks the edit.
const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

let input = "";
process.stdin.on("data", (c) => (input += c));
process.stdin.on("end", () => {
  let file;
  try {
    file = JSON.parse(input).tool_input?.file_path;
  } catch {
    return;
  }
  if (!file || !fs.existsSync(file) || !/\.(tsx?|mjs)$/.test(file)) return;

  const root = process.env.CLAUDE_PROJECT_DIR || process.cwd();
  const rel = path.relative(root, file);
  if (rel.startsWith("..") || /node_modules|\.next|\.claude/.test(rel)) return;

  // Call eslint's JS entry with node directly: no shell, so paths with spaces/brackets are safe.
  const eslint = path.join(root, "node_modules", "eslint", "bin", "eslint.js");
  if (!fs.existsSync(eslint)) return;
  try {
    execFileSync(process.execPath, [eslint, "--fix", file], { cwd: root, stdio: "pipe" });
  } catch (e) {
    // Surface remaining lint errors without failing the edit.
    const out = `${e.stdout || ""}${e.stderr || ""}`.trim();
    if (out) process.stderr.write(out.slice(0, 2000) + "\n");
  }
});

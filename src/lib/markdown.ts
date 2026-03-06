const escapeHtml = (input: string) =>
  input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");

const renderInline = (line: string) => {
  return line
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
};

export function markdownToHtml(markdown: string): string {
  const escaped = escapeHtml(markdown || "");
  const lines = escaped.split(/\r?\n/);

  let html = "";
  let inList = false;
  let inCode = false;

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    if (line.startsWith("```")) {
      if (inCode) {
        html += "</code></pre>";
      } else {
        html += "<pre><code>";
      }
      inCode = !inCode;
      continue;
    }

    if (inCode) {
      html += `${line}\n`;
      continue;
    }

    if (!line.trim()) {
      if (inList) {
        html += "</ul>";
        inList = false;
      }
      continue;
    }

    if (line.startsWith("## ")) {
      if (inList) {
        html += "</ul>";
        inList = false;
      }
      html += `<h2>${renderInline(line.slice(3))}</h2>`;
      continue;
    }

    if (line.startsWith("### ")) {
      if (inList) {
        html += "</ul>";
        inList = false;
      }
      html += `<h3>${renderInline(line.slice(4))}</h3>`;
      continue;
    }

    if (line.startsWith("- ")) {
      if (!inList) {
        html += "<ul>";
        inList = true;
      }
      html += `<li>${renderInline(line.slice(2))}</li>`;
      continue;
    }

    if (line.startsWith("> ")) {
      if (inList) {
        html += "</ul>";
        inList = false;
      }
      html += `<blockquote>${renderInline(line.slice(2))}</blockquote>`;
      continue;
    }

    if (inList) {
      html += "</ul>";
      inList = false;
    }

    html += `<p>${renderInline(line)}</p>`;
  }

  if (inList) {
    html += "</ul>";
  }

  if (inCode) {
    html += "</code></pre>";
  }

  return html;
}

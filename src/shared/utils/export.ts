// Utility functions for exporting data to CSV and PDF

export function exportToCSV(
  data: Record<string, unknown>[],
  filename: string,
  headers?: string[]
) {
  if (data.length === 0) {
    alert("Tidak ada data untuk di export");
    return;
  }

  // Get headers from first object if not provided
  const csvHeaders = headers || Object.keys(data[0]);

  // Create CSV content
  const csvContent = [
    csvHeaders.join(","), // Header row
    ...data.map((row) =>
      csvHeaders
        .map((header) => {
          const value = row[header];
          // Handle values with commas or quotes
          if (value === null || value === undefined) return "";
          const stringValue = String(value);
          if (stringValue.includes(",") || stringValue.includes('"')) {
            return `"${stringValue.replace(/"/g, '""')}"`;
          }
          return stringValue;
        })
        .join(",")
    ),
  ].join("\n");

  // Create blob and download
  const blob = new Blob(["\uFEFF" + csvContent], {
    type: "text/csv;charset=utf-8;",
  });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToPDF(content: string, filename: string) {
  // For PDF export, we'll use a simple approach with print
  // In production, you might want to use jsPDF or similar library

  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Popup blocked! Please allow popups for this site.");
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${filename}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            color: #333;
          }
          h1 {
            color: #FBC304;
            border-bottom: 3px solid #B48310;
            padding-bottom: 10px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
          }
          th {
            background-color: #FBC304;
            color: white;
            font-weight: bold;
          }
          tr:nth-child(even) {
            background-color: #f9f9f9;
          }
          @media print {
            body { padding: 0; }
            button { display: none; }
          }
        </style>
      </head>
      <body>
        ${content}
        <div style="margin-top: 20px; text-align: center;">
          <button onclick="window.print()" style="background: #FBC304; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-size: 16px;">
            Cetak / Simpan PDF
          </button>
          <button onclick="window.close()" style="background: #6B7280; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-size: 16px; margin-left: 10px;">
            Tutup
          </button>
        </div>
      </body>
    </html>
  `);

  printWindow.document.close();
}

// Helper to format table data for PDF
export function formatTableForPDF(
  title: string,
  headers: string[],
  rows: string[][]
) {
  const headerRow = headers.map((h) => `<th>${h}</th>`).join("");
  const bodyRows = rows
    .map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`)
    .join("");

  return `
    <h1>${title}</h1>
    <p style="color: #666;">Diekspor pada: ${new Date().toLocaleString(
      "id-ID"
    )}</p>
    <table>
      <thead>
        <tr>${headerRow}</tr>
      </thead>
      <tbody>
        ${bodyRows}
      </tbody>
    </table>
  `;
}

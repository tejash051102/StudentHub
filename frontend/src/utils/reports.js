export function downloadCsv(filename, rows) {
  const csv = rows
    .map((row) =>
      row
        .map((cell) => `"${String(cell ?? '').replaceAll('"', '""')}"`)
        .join(',')
    )
    .join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function printHtml(title, html) {
  const printWindow = window.open('', '_blank', 'width=900,height=700');
  printWindow.document.write(`
    <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: Arial, sans-serif; color: #12213f; padding: 28px; }
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #d9e2ef; padding: 10px; text-align: left; }
          .card { border: 1px solid #d9e2ef; border-radius: 12px; padding: 18px; }
        </style>
      </head>
      <body>${html}</body>
    </html>
  `);
  printWindow.document.close();
  printWindow.print();
}

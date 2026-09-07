import jspdf from 'jspdf';
import autoTable from 'jspdf-autotable';

export type ExportColumn<T>={
    header:string;
    accessor:(row:T)=> string | number
}

function buildRows<T>(
    data:T[], 
    columns:ExportColumn<T>[]
){
    return data.map((row)=>columns.map((column)=>column.accessor(row)))
}


export function exportToCSV<T>(
  data: T[],
  columns: ExportColumn<T>[],
  filename = 'export.csv'
) {
  const headers = columns.map((c) => c.header)
  const rows = buildRows(data, columns)

  const csvContent = [headers, ...rows]
    .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(','))
    .join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}


export function exportToPDF<T>(
   data: T[],            
  columns: ExportColumn<T>[],
  options: { filename?: string; title?: string } = {}
){
    const {filename='export.pdf', title='Export'}=options

  const doc = new jspdf()
  doc.setFontSize(14)
  doc.text(title, 14, 15)

  autoTable(doc, {
    startY: 22,
    head: [columns.map((c) => c.header)],
    body: buildRows(data, columns),
    styles: { fontSize: 8 },
    headStyles: { fillColor: [4, 55, 147] },
  })

  doc.save(filename)
}
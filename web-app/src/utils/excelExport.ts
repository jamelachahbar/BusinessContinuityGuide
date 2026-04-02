import ExcelJS from 'exceljs'
import type { CsvSheet } from './csvExport'

interface RaciExportData {
  roles: string[]
  tasks: { task: string; raci: string[] }[]
}

const raciColors: Record<string, { bg: string; font: string }> = {
  'R': { bg: '003366', font: 'FFFFFF' },
  'A': { bg: '336699', font: 'FFFFFF' },
  'C': { bg: '6699CC', font: 'FFFFFF' },
  'I': { bg: '99CCFF', font: '1A1A1A' },
}

export async function downloadRaciExcel(data: RaciExportData, filename: string = 'phase1-raci-matrix.xlsx'): Promise<void> {
  const workbook = new ExcelJS.Workbook()
  const sheet = workbook.addWorksheet('RACI Matrix')

  // Header row
  const headerRow = sheet.addRow(['Task', ...data.roles])
  headerRow.font = { bold: true }
  headerRow.eachCell(cell => {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'F3F3F3' } }
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    }
    cell.alignment = { horizontal: 'center', vertical: 'middle' }
  })
  // First header cell left-aligned
  headerRow.getCell(1).alignment = { horizontal: 'left', vertical: 'middle' }

  // Data rows
  for (const task of data.tasks) {
    const row = sheet.addRow([task.task, ...task.raci])
    row.getCell(1).font = { bold: true }
    row.getCell(1).alignment = { horizontal: 'left', vertical: 'middle' }

    for (let i = 0; i < task.raci.length; i++) {
      const cell = row.getCell(i + 2) // +2 because 1-based and task column
      const val = task.raci[i]
      cell.alignment = { horizontal: 'center', vertical: 'middle' }
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      }
      const color = raciColors[val]
      if (color) {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: color.bg } }
        cell.font = { color: { argb: color.font }, bold: true }
      }
    }
  }

  // Auto-width columns
  sheet.getColumn(1).width = 35
  for (let i = 2; i <= data.roles.length + 1; i++) {
    sheet.getColumn(i).width = 18
  }

  // Download
  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export async function downloadExcel(sheet: CsvSheet, filename: string): Promise<void> {
  const workbook = new ExcelJS.Workbook()
  const ws = workbook.addWorksheet(sheet.name)

  // Header row
  const headerRow = ws.addRow(sheet.headers)
  headerRow.font = { bold: true }
  headerRow.eachCell(cell => {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'F3F3F3' } }
    cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true }
  })
  headerRow.getCell(1).alignment = { horizontal: 'left', vertical: 'middle', wrapText: true }

  // Data rows
  for (const rowData of sheet.rows) {
    const row = ws.addRow(rowData)
    row.eachCell(cell => {
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
      cell.alignment = { vertical: 'middle', wrapText: true }
    })
    row.getCell(1).font = { bold: true }
  }

  // Auto-width: estimate from content
  for (let i = 1; i <= sheet.headers.length; i++) {
    const col = ws.getColumn(i)
    let maxLen = sheet.headers[i - 1].length
    for (const rowData of sheet.rows) {
      const val = rowData[i - 1] || ''
      maxLen = Math.max(maxLen, Math.min(val.length, 50))
    }
    col.width = Math.max(maxLen + 4, 12)
  }

  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

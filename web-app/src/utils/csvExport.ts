/**
 * CSV export utility.
 * Exports data as CSV files — one per phase/section.
 */

export interface CsvSheet {
  name: string
  headers: string[]
  rows: string[][]
}

function escapeCsvField(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

function sheetToCsv(sheet: CsvSheet): string {
  const lines = [
    sheet.headers.map(escapeCsvField).join(','),
    ...sheet.rows.map(row => row.map(escapeCsvField).join(',')),
  ]
  return lines.join('\r\n')
}

/**
 * Download a single CSV file.
 */
export function downloadCsv(filename: string, sheet: CsvSheet): void {
  const csv = sheetToCsv(sheet)
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename.endsWith('.csv') ? filename : `${filename}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * Download multiple CSV sheets as separate files bundled in a zip,
 * or if ZIP is not available, download them sequentially.
 */
export function downloadMultipleCsvSheets(sheets: CsvSheet[], baseFilename: string): void {
  const date = new Date().toISOString().slice(0, 10)

  if (sheets.length === 1) {
    downloadCsv(`${baseFilename}_${sheets[0].name}_${date}.csv`, sheets[0])
    return
  }

  // Download each sheet as a separate CSV
  sheets.forEach((sheet, index) => {
    setTimeout(() => {
      downloadCsv(`${baseFilename}_${sheet.name}_${date}.csv`, sheet)
    }, index * 300) // Small delay to avoid browser blocking
  })
}

/**
 * Build a CsvSheet from an array of objects.
 * Automatically extracts headers from the first object's keys.
 */
export function objectsToCsvSheet(
  name: string,
  data: Record<string, unknown>[],
  columnOrder?: string[],
  headerLabels?: Record<string, string>,
): CsvSheet {
  if (data.length === 0) {
    return { name, headers: [], rows: [] }
  }

  const keys = columnOrder ?? Object.keys(data[0])
  const headers = keys.map(k => headerLabels?.[k] ?? k)
  const rows = data.map(obj =>
    keys.map(k => {
      const val = obj[k]
      if (val === null || val === undefined) return ''
      if (typeof val === 'boolean') return val ? 'Yes' : 'No'
      return String(val)
    })
  )

  return { name, headers, rows }
}

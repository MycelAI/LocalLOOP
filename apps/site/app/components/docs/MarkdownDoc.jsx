import fs from 'fs'
import path from 'path'
import MarkdownRenderer from './MarkdownRenderer'

export default function MarkdownDoc({ filePath }) {
  const abs = path.join(process.cwd(), 'public', filePath)
  let content = ''
  try {
    content = fs.readFileSync(abs, 'utf-8')
  } catch {
    content = `> File not found: \`${filePath}\``
  }
  if (filePath.endsWith('.json')) {
    try {
      content = '```json\n' + JSON.stringify(JSON.parse(content), null, 2) + '\n```'
    } catch {}
  }
  return <MarkdownRenderer content={content} />
}

import { RichText } from '@payloadcms/richtext-lexical/react'

// Renders links with rel="sponsored" when the editor ticked "Sponsored / paid link"
const link = ({ node, nodesToJSX }: any) => {
  const f = node.fields || {}
  const rel = [f.sponsored && 'sponsored', f.newTab && 'noopener'].filter(Boolean).join(' ') || undefined
  return (
    <a href={f.url} rel={rel} target={f.newTab ? '_blank' : undefined}>
      {nodesToJSX({ nodes: node.children })}
    </a>
  )
}

export function Body({ data }: { data: any }) {
  return (
    <div className="prose">
      <RichText data={data} converters={({ defaultConverters }: any) => ({ ...defaultConverters, link, autolink: link })} />
    </div>
  )
}

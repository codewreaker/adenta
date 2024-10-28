import Sidebar from '@/components/Sidebar'
import Search from '@/components/Search'

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-grow p-8">
        <Search />
        <div className="mt-8">{children}</div>
      </main>
    </div>
  )
}
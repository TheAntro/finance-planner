export default function NetworthPageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="mx-auto w-full max-w-4xl p-4">
      <h1 className="mb-4 text-2xl font-bold">Networth</h1>
      {children}
    </div>
  )
}

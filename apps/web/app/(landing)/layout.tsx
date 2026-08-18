import { Header } from "@/components/header"

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <Header />
      {children}
    </div>
  )
}

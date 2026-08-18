import { Header } from "@/components/header"
import { UserMenu } from "@/components/user-menu"

export const dynamic = "force-dynamic"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Header userMenu={<UserMenu />} />
      {children}
    </div>
  )
}

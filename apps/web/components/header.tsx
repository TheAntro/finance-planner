import Link from "next/link"

export async function Header({ userMenu }: { userMenu?: React.ReactNode }) {
  return (
    <header className="flex items-center justify-between py-6">
      <Link className="text-xl font-semibold" href="/" aria-label="Home">
        Finance Planner
      </Link>
      {userMenu ?? <div />}
    </header>
  )
}

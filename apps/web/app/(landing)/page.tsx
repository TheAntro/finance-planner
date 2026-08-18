import { buttonVariants } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <div>
      <main>
        <h1 className="text-4xl font-bold">Networth Tracker</h1>
        <Link href="/networth" className={buttonVariants({ variant: "link" })}>
          Get Started
        </Link>
      </main>
    </div>
  )
}

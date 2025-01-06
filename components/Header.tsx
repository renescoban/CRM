import Link from 'next/link'

export default function Header() {
  return (
    <header className=" shadow">
      <nav className="container mx-auto px-4 py-4">
        <ul className="flex space-x-4">
          <li>
            <Link href="/" className="text-blue-600 hover:text-blue-800">
              Dashboard
            </Link>
          </li>
          <li>
            <Link href="/contacts" className="text-blue-600 hover:text-blue-800">
              Contacts
            </Link>
          </li>
          <li>
            <Link href="/reports" className="text-blue-600 hover:text-blue-800">
              Reports
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}


import Link from 'next/link'

import '../styles/tailwind.css'

function App({ Component, pageProps }) {
  return (
    <div className="max-w-5xl mx-auto px-4">
      <nav className="py-4">
        <ul className="flex space-x-4">
          <li>
            <Link href="/">
              <a className="font-semibold text-gray-500 text-sm hover:text-blue-600">
                Home
              </a>
            </Link>
          </li>
        </ul>
      </nav>
      <Component {...pageProps} />
    </div>
  )
}

export default App

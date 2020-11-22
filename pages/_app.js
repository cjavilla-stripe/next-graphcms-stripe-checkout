import '../styles/tailwind.css'

function App({ Component, pageProps }) {
  return (
    <div className="max-w-5xl mx-auto px-4">
      <Component {...pageProps} />
    </div>
  )
}

export default App

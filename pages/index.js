import Link from 'next/link'
import Image from 'next/image'

import { graphCmsClient } from '../lib/graphCmsClient'

export async function getStaticProps() {
  const { products } = await graphCmsClient.request(
    `
      {
        products {
          id
          images {
            id
            height
            url
            width
          }
          name
          price
          slug
        }
      }
    `
  )
  return {
    props: {
      products: products.map((product) => ({
        ...product,
        formattedPrice: new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'EUR',
          minimumFractionDigits: 0
        }).format(Number(product.price / 100))
      }))
    }
  }
}

const IndexPage = ({ products }) => {
  return (
    <div>
      <div className="border-b py-4 space-y-2">
        <h1 className="font-semibold text-3xl">Products</h1>
        <p className="text-gray-500 text-sm">
          Latest products available to buy!
        </p>
      </div>
      <div className="divide-y md:divide-y-0 md:divide-x grid md:grid-cols-3">
        {products.map((product) => {
          const [primaryImage] = product.images

          return (
            <div key={product.id} className="group">
              <Link href={`/products/${product.slug}`}>
                <a className="block px-8 py-6 space-y-4 group-hover:bg-gray-100">
                  <Image
                    src={primaryImage.url}
                    height={primaryImage.height}
                    width={primaryImage.width}
                  />
                  <div className="space-y-2">
                    <h2 className="font-semibold text-2xl group-hover:text-blue-600">
                      {product.name}
                    </h2>
                    <p className="text-gray-500">{product.formattedPrice}</p>
                  </div>
                </a>
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default IndexPage

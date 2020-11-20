import Link from 'next/link'

import { graphCmsClient } from '../lib/graphCmsClient'

export async function getStaticProps() {
  // fetch products
  const { products } = await graphCmsClient.request(
    `
      {
        products {
          name
          slug
          id
          price
        }
      }
    `
  )
  return {
    props: {
      products
    }
  }
}

const IndexPage = ({ products }) => {
  return products.map(({ name, slug, id, price }) => {
    return (
      <div>
        <Link key={id} href={`/products/${slug}`}>
          {name}
        </Link>
      </div>
    )
  })
}

export default IndexPage

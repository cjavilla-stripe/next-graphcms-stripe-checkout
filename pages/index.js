import Link from 'next/link'
import { GraphQLClient } from 'graphql-request'

const graphcms = new GraphQLClient(process.env.GRAPH_CMS_ENDPOINT);

export async function getStaticProps() {
  // fetch products
  const {products} = await graphcms.request(
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

const IndexPage = ({products}) => {
  return products.map(({name, slug, id, price}) => {
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

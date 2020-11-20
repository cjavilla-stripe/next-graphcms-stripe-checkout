import Image from 'next/image'
import getConfig from 'next/config';
import { gql } from 'graphql-request'
import {loadStripe} from '@stripe/stripe-js';

import { graphCmsClient } from '../../lib/graphCmsClient'

const {publicRuntimeConfig} = getConfig();
const stripePromise = loadStripe(publicRuntimeConfig.stripePublishableKey)


// getStaticPaths
export async function getStaticPaths() {
  const { products } = await graphCmsClient.request(
    gql`
      {
        products {
          name
          slug
        }
      }
    `
  )
  return {
    paths: products.map(({slug}) => ({
      params: {
        slug
      }
    })),
    fallback: false
  };
}

// getStaticProps
export async function getStaticProps({params}) {
  const { product } = await graphCmsClient.request(
    gql`
      query ProductPageQuery($slug: String!) {
        product(where: { slug: $slug }) {
          name
          slug
          price
          images {
            id
            url
            width
            height
          }
        }
      }
    `,
    {
      slug: params.slug,
    }
  )
  return  {
    props: {
      product
    }
  }
}

const PayBtn = ({slug}) => {
  const handleClick = async (e) => {
    e.preventDefault();
    const stripe = await stripePromise;

    // create checkout session
    const session = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        slug: slug
      })
    }).then(resp => resp.json())

    console.log({session})
    // redirect to checkout
    const result = await stripe.redirectToCheckout({
      sessionId: session.id
    })
  }

  return (
    <button onClick={handleClick}>Buy!</button>
  )
}

const ProductPage = ({product}) => {
  const [image] = product.images
  return (
    <div>
      <>{product.name}</>
      <>{product.price} EUR</>
      <div>
        <PayBtn slug={product.slug} />
        <Image src={image.url} width={image.width} height={image.height} />
      </div>
    </div>
  )
}

export default ProductPage

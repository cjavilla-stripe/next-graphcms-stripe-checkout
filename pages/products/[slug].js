import { useState } from 'react'
import Image from 'next/image'
import { gql } from 'graphql-request'
import { loadStripe } from '@stripe/stripe-js'
import cc from 'classcat'

import { graphCmsClient } from '../../lib/graphCmsClient'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

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
    paths: products.map(({ slug }) => ({
      params: {
        slug
      }
    })),
    fallback: false
  }
}

export async function getStaticProps({ params }) {
  const { product } = await graphCmsClient.request(
    gql`
      query ProductPageQuery($slug: String!) {
        product(where: { slug: $slug }) {
          description
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
      slug: params.slug
    }
  )
  return {
    props: {
      product: {
        ...product,
        formattedPrice: new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'EUR',
          minimumFractionDigits: 0
        }).format(Number(product.price / 100))
      }
    }
  }
}

const PayBtn = ({ formattedPrice, slug }) => {
  const [working, setWorking] = useState(false)

  const handleClick = async (e) => {
    e.preventDefault()
    const stripe = await stripePromise

    setWorking(true)

    // create checkout session
    const session = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        slug: slug
      })
    }).then((resp) => resp.json())

    await stripe.redirectToCheckout({
      sessionId: session.id
    })

    setWorking(false)
  }

  return (
    <button
      type="button"
      class={cc([
        'items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full md:w-auto',
        {
          'cursor-not-allowed opacity-50': working
        }
      ])}
      onClick={handleClick}
      disabled={working}
    >
      {working ? 'Working' : `Buy for ${formattedPrice}`}
    </button>
  )
}

const ProductPage = ({ product }) => {
  const [image] = product.images

  return (
    <div>
      <div className="border-b py-4 space-y-2">
        <h1 className="font-semibold text-3xl">{product.name}</h1>
      </div>
      <div className="gap-6 grid md:grid-cols-5">
        <div className="space-y-6 md:col-span-2 md:pt-16">
          <div className="prose">
            <p>{product.description}</p>
          </div>
          <PayBtn {...product} />
        </div>
        <div className="md:col-span-3 order-first md:order-last">
          <Image src={image.url} width={image.width} height={image.height} />
        </div>
      </div>
    </div>
  )
}

export default ProductPage

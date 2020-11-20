import Stripe from 'stripe'
import { gql } from 'graphql-request'

import { graphCmsMutationClient } from '../../lib/graphCmsClient'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async (req, res) => {
  const event = req.body

  const session = await stripe.checkout.sessions.retrieve(
    event.data.object.id,
    {
      expand: ['line_items.data.price.product', 'customer']
    }
  )
  const line_items = session.line_items.data
  const customer = session.customer

  // create order and order items in GraphCMS
  const { order } = await graphCmsMutationClient.request(
    gql`
      mutation CreateOrderMutation($data: OrderCreateInput!) {
        createOrder(data: $data) {
          id
          emailAddress
          total
        }
      }
    `,
    {
      data: {
        emailAddress: customer.email,
        total: session.amount_total,
        stripeCheckoutId: session.id,
        orderItems: {
          create: line_items.map((li) => ({
            quantity: li.quantity,
            total: li.amount_total,
            product: {
              connect: {
                slug: li.price.product.metadata.productSlug
              }
            }
          }))
        }
      }
    }
  )
  res.json({ message: 'success' })
}

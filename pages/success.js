import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { gql } from 'graphql-request'

import { graphCmsClient } from '../lib/graphCmsClient'
import OrderSummary from '../components/order-summary'

function SuccessPage() {
  const router = useRouter()
  const [order, setOrder] = useState(null)
  const [working, setWorking] = useState(true)

  const stripeCheckoutId = router.query.id

  useEffect(() => {
    const fetchOrder = async () => {
      const {
        orders: [order]
      } = await graphCmsClient.request(
        gql`
          query FetchOrder($stripeCheckoutId: String!) {
            orders(first: 1, where: { stripeCheckoutId: $stripeCheckoutId }) {
              id
              orderItems {
                id
                product {
                  images {
                    id
                    height
                    url
                    width
                  }
                  name
                }
                quantity
                total
              }
              total
            }
          }
        `,
        { stripeCheckoutId }
      )

      setOrder(order)
      setWorking(false)
    }
    if (stripeCheckoutId) fetchOrder()
  }, [stripeCheckoutId])

  return (
    <div>
      <div className="border-b py-4 space-y-2">
        <h1 className="font-semibold text-3xl">Your order</h1>
        {order ? <p className="text-gray-500 text-sm">{order.id}</p> : null}
      </div>
      <OrderSummary order={order} working={working} />
    </div>
  )
}

export default SuccessPage

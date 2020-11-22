import Image from 'next/image'

import { formatCurrencyValue } from '../lib/helpers'

function OrderSummary({ order, working }) {
  if (working)
    return (
      <div className="py-8 text-center">
        <p className="font-medium text-xl">Retrieving order details</p>
      </div>
    )

  if (!order)
    return (
      <div className="py-8 text-center">
        <p className="font-medium text-xl">Could not locate that order</p>
      </div>
    )

  return (
    <div className="divide-y">
      <div className="divide-y">
        {order.orderItems.map((item) => {
          const [productImage] = item.product.images

          return (
            <div
              key={item.id}
              className="gap-x-6 grid grid-cols-10 items-center"
            >
              <div className="col-span-2 md:col-span-1">
                <Image
                  src={productImage.url}
                  width={productImage.width}
                  height={productImage.height}
                />
              </div>
              <div className="col-span-3 md:col-span-4">
                <p className="text-xl text-blue-600">{item.product.name}</p>
              </div>
              <div className="col-span-2">
                <p>{item.quantity}</p>
              </div>
              <div className="col-span-3 text-right">
                <p className="font-semibold text-lg">
                  {formatCurrencyValue({ value: item.total })}
                </p>
              </div>
            </div>
          )
        })}
      </div>
      <div className="flex justify-end py-4">
        <p className="text-2xl">
          {formatCurrencyValue({ value: order.total })}
        </p>
      </div>
    </div>
  )
}

export default OrderSummary

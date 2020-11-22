const formatCurrencyValue = ({ currency = 'EUR', value }) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0
  }).format(Number(value / 100))

export { formatCurrencyValue }

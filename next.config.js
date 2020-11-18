module.exports = {
  images: {
    domains: ['media.graphcms.com']
  },

  publicRuntimeConfig: {
    stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  }
}

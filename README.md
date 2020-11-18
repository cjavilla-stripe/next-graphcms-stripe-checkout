## Next.js + [GraphCMS](https://graphcms.com/) + [Stripe Checkout](https://stripe.com/docs/checkout)

### 1. Configure environment

If running locally, copy .env.local.sample to .env.local:

```sh
mv .env.local.sample .env.local
```

Then configure the following environment variables:

```yml
STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

GRAPH_CMS_ENDPOINT=
GRAPH_CMS_MUTATION_TOKEN=
```

### 2. Run development server

```bash
npm run dev
# or
yarn dev
```

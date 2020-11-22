import { GraphQLClient } from 'graphql-request'

const graphCmsClient = new GraphQLClient(
  process.env.NEXT_PUBLIC_GRAPH_CMS_ENDPOINT
)

const graphCmsMutationClient = new GraphQLClient(
  process.env.NEXT_PUBLIC_GRAPH_CMS_ENDPOINT,
  {
    headers: {
      Authorization: `Bearer ${process.env.GRAPH_CMS_TOKEN}`
    }
  }
)

export { graphCmsClient, graphCmsMutationClient }

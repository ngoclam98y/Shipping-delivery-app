import { WinstonLoggerService } from "app/services/winton-logger.server";
import { GraphQLClient } from "node_modules/@shopify/shopify-app-remix/dist/ts/server/clients/types";
import { AdminOperations } from '@shopify/admin-api-client';
import { chunkArray, getVariantsId } from "app/utils";

interface IShippingDelivery { };

const getAllProfileShippingDelivery = async (graphql: GraphQLClient<AdminOperations>) => {
  const logger = new WinstonLoggerService();
  logger.info("[START] getAllProfileShippingDelivery");
  const query = `{
    deliveryProfiles(first: 250) {
      edges {
        node {
          id,
          name
        }
      }
    }
  }`
    ;

  try {
    const response = await graphql(query, { variables: {} });
    logger.info("[END] getAllProfileShippingDelivery");
    return response.json();
  } catch (error) {
    logger.error("[ERROR] getAllProfileShippingDelivery")
  }

}

const createProfileShippingDelivery = async (graphql: GraphQLClient<AdminOperations>, shippingDelivery: IShippingDelivery) => {
  const logger = new WinstonLoggerService();
  logger.info("[START] createMetafieldDefinition", {
    shippingDelivery: shippingDelivery,
  });

  const query = `{
  locations(first: 250) {
    edges {
      node {
        id
        name
        address {
          address1
          city
          country
        }
      }
    }
  }
}
`;

  const response = await graphql(query, { variables: {} });
  logger.info("[END] createMetafieldDefinition");
  return response.json();
}

const getProductBulk = async (graphql: GraphQLClient<AdminOperations>) => {
  const logger = new WinstonLoggerService();
  logger.info("[START] getProductBulk");
  const query = `mutation {
    bulkOperationRunQuery(
    query: """
      {
        products {
          edges {
            node {
              id
              title
            }
          }
        }
      }
      """
    ) {
      bulkOperation {
        id
        status
      }
      userErrors {
        field
        message
      }
    }
  }`;
  const response = await graphql(query, { variables: {} });
  logger.info("[END] getProductBulk");
  return response.json();
}

interface ProductId {
  ID: string | number;
}

const handleGetVariantId = async (graphql: GraphQLClient<AdminOperations>, productIds: ProductId[]) => {
  const logger = new WinstonLoggerService();
  logger.info("[START] handleGetVariantId", { productIds });

  if (!productIds || !productIds.length) {
    logger.error("[ERROR] handleGetVariantId: productIds is empty");
    return [];
  }

  const query = `query getProducts($first: Int, $variantsFirst: Int, $query:String) {
  products(first: $first, query: $query) {
    edges {
      cursor
      node {
        variants(first: $variantsFirst) {
          edges {
            node {
              id
            }
          }
        }
      }
    }
  }
}
`;

  const chunkedArray = chunkArray(productIds, 250);

  let arr = [];
  for (const chunk of chunkedArray) {
    const variable = {
      first: 250,
      variantsFirst: 250,
      query: `${chunk.join(' OR ')} `,
    }

    const response = await graphql(query, {
      variables: variable
    });

    const result = await response.json();

    arr.push(getVariantsId(result));
  }

  if (!arr.length) return [];

  logger.info("[END] handleGetVariantId");
  return arr.flat();
}


const deliveryProfileUpdate = async (
  graphql: GraphQLClient<AdminOperations>,
  deliveryProfileId: string,
  variantIds: string[]
) => {
  const logger = new WinstonLoggerService();
  logger.info("[START] deliveryProfileUpdate");

  const query = `mutation deliveryProfileUpdate($id: ID!, $profile: DeliveryProfileInput!) {
    deliveryProfileUpdate(id: $id, profile: $profile) {
      profile {
        id
        name
        profileLocationGroups {
          locationGroup {
            id
            locations(first: 250) {
              nodes {
                name
                address {
                  country
                }
              }
            }
          }
          locationGroupZones(first: 250) {
            edges {
              node {
                zone {
                  id
                  name
                  countries {
                    code {
                      countryCode
                    }
                    provinces {
                      code
                    }
                  }
                }
              }
            }
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }`;

  const variable = {
    "id": deliveryProfileId,
    "profile": {
      "variantsToAssociate": variantIds
    }
  }

  try {
    const response = await graphql(query, {
      variables: variable
    });

    logger.info("[END] deliveryProfileUpdate");

    const result = await response.json();
    return {
      status: "ok",
      result
    };
  } catch (error) {
    return {
      status: "faild",
    };
  }

}

export {
  createProfileShippingDelivery,
  getAllProfileShippingDelivery,
  getProductBulk,
  handleGetVariantId,
  deliveryProfileUpdate
};
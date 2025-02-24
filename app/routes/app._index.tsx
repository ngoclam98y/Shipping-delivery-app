import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import {
  Page,
  BlockStack,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import Home from "app/pages/Home";
import { json } from "@remix-run/node";
import { createProfileShippingDelivery, deliveryProfileUpdate, getAllProfileShippingDelivery, getProductBulk, handleGetVariantId } from "app/models/ShippingDelivery.server";
import { useLoaderData } from "@remix-run/react";
import { removeEdgesAndNode } from "app/utils";
import { handleUploadFile } from "app/models/HandleUploadFile.server";

export async function loader({
  request,
}: LoaderFunctionArgs) {
  const { admin } = await authenticate.admin(request);

  const allProfile = await getAllProfileShippingDelivery(admin.graphql);

  return json(removeEdgesAndNode(allProfile?.data?.deliveryProfiles));
}

interface ProductId {
  ID: string | number;
}

export async function action({ request }: ActionFunctionArgs) {
  const clonedRequest = request.clone();
  const formData = await clonedRequest.formData();

  const type = formData.get('type');

  if (type === 'uploadFile') {
    const file = formData.get('file') as File;
    return handleUploadFile(file);
  } else if (type === 'getProductBulk') {
    const { admin } = await authenticate.admin(request);
    const productIds = formData.get('productIds');
    const deliveryProfileId = formData.get('deliveryProfileId') as string;

    const variantIds = await handleGetVariantId(admin.graphql, JSON.parse(productIds as string) as ProductId[]);
    const result = await deliveryProfileUpdate(admin.graphql, deliveryProfileId, variantIds as string[]);

    return json(result);
  }

  return json({ data: '' });
}


export default function Index() {
  const deliveryOption = useLoaderData<typeof loader>();

  return (
    <Page fullWidth>
      <TitleBar title="Shiping Delivery Setup">
      </TitleBar>
      <BlockStack gap="200">
        <Home deliveryOption={deliveryOption} />
      </BlockStack>
    </Page>
  );
}

import { Select, Button, Box } from '@shopify/polaris';
import { HomeProps } from './declaration';
import { UploadButton } from 'app/components/UploadButton';
import { tranformSelectedData } from 'app/utils';
import ProductList from './components/ProductList';
import { useLogic } from './useHooks';

function Home({ deliveryOption }: HomeProps) {
    const {
        profileDelivery,
        isLoading,
        data,
        isShowToast,
        isLoadingUpdateProfile,
        file,
        handleSetFileValue,
        setProfileDelivery,
        handleUpdateDeliveryProfile,
        toggleShowToast
    } = useLogic({ deliveryOption })

    return (
        <>
            <Box width='300px'>
                <Select
                    label="Profile Delivery"
                    name='profileDelivery'
                    value={profileDelivery}
                    onChange={(value) => setProfileDelivery(value)}
                    options={tranformSelectedData(deliveryOption)}
                ></Select>
            </Box>
            <Box>
                <UploadButton disabled={isLoadingUpdateProfile} isLoading={isLoading} handleSetFileValue={handleSetFileValue} />
                <span style={{ paddingLeft: '20px' }}>{file?.name}</span>
            </Box>
            <Box>
                <Button disabled={isLoading} onClick={handleUpdateDeliveryProfile} loading={isLoadingUpdateProfile}>Update Shiping Delivery</Button>
            </Box>
            <ProductList data={data?.data || []} />
        </>
    );
}

export default Home;
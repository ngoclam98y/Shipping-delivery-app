import { useFetcherCustom } from "app/hooks/useFetcherCustom";
import { useCallback, useEffect, useState } from "react";
import { HomeProps } from "../declaration";

export const useLogic = ({ deliveryOption }: HomeProps) => {
    const [file, setFile] = useState<File | null>(null);
    const [profileDelivery, setProfileDelivery] = useState('');
    const [isShowToast, setIsShowToast] = useState(false);

    const { isLoading, data, fetcherSubmitFile } = useFetcherCustom();
    const { fetcherSubmit, data: updateProfileData, isLoading: isLoadingUpdateProfile } = useFetcherCustom();


    const handleUploadFile = () => {
        const formData = new FormData();
        formData.append("type", 'uploadFile');
        if (file) {
            formData.append("file", file);
        }
        fetcherSubmitFile(formData);
    }

    const handleSetFileValue = (file: File) => {
        setFile(file)
    }

    const toggleShowToast = useCallback(() => setIsShowToast((active) => !active), []);

    const handleUpdateDeliveryProfile = () => {
        const formData = new FormData();
        formData.append("type", 'getProductBulk');
        formData.append("deliveryProfileId", profileDelivery);
        const productIds = data?.data?.map(({ ID }: { ID: string }) => ID);
        if (!productIds || productIds?.length === 0) {
            window.alert("Please select product");
            return;
        }
        formData.append("productIds", JSON.stringify(productIds || []));
        fetcherSubmit(formData);
    }

    useEffect(() => {
        if (updateProfileData?.status === "ok") {
            window.alert("Update profile delivery success");
        }
    }, [updateProfileData])

    useEffect(() => {
        if (file) {
            handleUploadFile();
        }
    }, [file])

    useEffect(() => {
        if (deliveryOption && deliveryOption.length > 0) {
            setProfileDelivery(deliveryOption[0].id);
        }
    }, [deliveryOption?.length])

    return {
        profileDelivery,
        isLoading,
        data,
        file,
        isLoadingUpdateProfile,
        isShowToast,
        toggleShowToast,
        handleSetFileValue,
        setProfileDelivery,
        handleUpdateDeliveryProfile
    }

}
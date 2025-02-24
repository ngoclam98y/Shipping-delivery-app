import { Button } from "@shopify/polaris";
import { useRef } from "react";

interface UploadButtonProps {
    handleSetFileValue: (file: File) => void;
    isLoading: boolean;
    disabled?: boolean;
}

export function UploadButton({ handleSetFileValue, isLoading, disabled }: UploadButtonProps) {
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (file) {
            handleSetFileValue(file)
        }
    };
    return (
        <>
            <Button onClick={handleClick} disabled={disabled} loading={isLoading}>Upload File</Button>
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
            />
        </>
    );
}

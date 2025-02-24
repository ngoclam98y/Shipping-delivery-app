import {
    IndexTable,
    LegacyCard,
    Button,
    InlineStack,
    Card,
} from '@shopify/polaris';
import { useState } from 'react';

type Item = {
    ID: string;
    Name: string;
};

interface ProductListProps {
    data: Item[];
}

function ProductList({ data }: ProductListProps) {
    const itemsPerPage = 1;
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(data.length / itemsPerPage);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = data.slice(startIndex, endIndex);

    const handlePageClick = (page: number) => {
        setCurrentPage(page);
    };

    const getPaginationItems = () => {
        const pages: (number | string)[] = [];

        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1);
            if (currentPage > 4) pages.push("...");

            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (currentPage < totalPages - 3) pages.push("...");
            pages.push(totalPages);
        }

        return pages;
    };

    const rowMarkup = paginatedData.map(({ ID, Name }, index) => (
        <IndexTable.Row id={ID} key={ID} position={index}>
            <IndexTable.Cell>{ID}</IndexTable.Cell>
            <IndexTable.Cell>{Name}</IndexTable.Cell>
        </IndexTable.Row>
    ));

    return (
        <>
            <Card>
                <IndexTable
                    itemCount={data.length}
                    selectable={false}
                    headings={[
                        { title: 'Id' },
                        { title: 'Name' },
                    ]}
                >
                    {rowMarkup}
                </IndexTable>
            </Card>


            <InlineStack align="end" gap={"150"}>
                {getPaginationItems().map((page, index) => (
                    typeof page === "number" ? (
                        <Button
                            key={index}
                            onClick={() => handlePageClick(page)}
                            variant={currentPage === page ? 'primary' : 'secondary'}
                        >
                            {page.toString()}
                        </Button>
                    ) : (
                        <span key={index} style={{ padding: '0 8px' }}>...</span>
                    )
                ))}
            </InlineStack>
        </>

    );
}

export default ProductList;

export function removeEdgesAndNode(data: any) {
    if (data && data.edges) {
        return data.edges.map((edge: any) => edge.node || edge);
    }
    return [];
}

export function tranformSelectedData(data: any) {
    if (!data?.length) {
        return [];
    }
    return data.map((item: any) => ({
        label: item.name,
        value: item.id
    }));
}

export function chunkArray<T>(array: T[], chunkSize: number): T[][] {
    const result: T[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        result.push(array.slice(i, i + chunkSize));
    }
    return result;
}

export function getVariantsId(response: any) {
    return response.data.products.edges.map((e: any) => e.node.variants.edges.map((e: any) => e.node.id)).flat();
}
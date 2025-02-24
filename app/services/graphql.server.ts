class GraphQLService {
    private admin: any | null;
    private totalQueryCost: number = 0;

    constructor(admin: any | null) {
        this.admin = admin;
    }

    async query(query: string, variables: any = {}) {
        const response = await this.admin?.graphql(query, variables);
        const result = await response?.json();

        const currentCost = result?.extensions?.cost?.actualQueryCost ?? 0;
        console.log(`GraphQL query cost: ${currentCost}`);

        this.totalQueryCost += currentCost;

        return result;
    }

    logTotalQueryCost() {
        console.log(`Total GraphQL query cost: ${this.totalQueryCost}`);
        this.totalQueryCost = 0; // Reset for next API request
    }
}

export default GraphQLService;
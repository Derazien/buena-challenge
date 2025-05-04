import { useQuery } from '@apollo/client';
import { GET_PROPERTIES } from '@/graphql/queries';
import { Property } from '@/types/api/property.types';

export function useProperties() {
    const { loading, error, data, refetch } = useQuery(GET_PROPERTIES);

    const properties: Property[] = data?.properties || [];

    return {
        loading,
        error,
        properties,
        refetch
    };
}
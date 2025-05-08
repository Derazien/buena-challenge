'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { useQuery } from '@apollo/client';
import { GET_PROPERTY } from '@/graphql/queries';
import dynamic from 'next/dynamic';

// Define the Property type
type Property = {
    id: number;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    status: 'OCCUPIED' | 'VACANT' | 'MAINTENANCE';
    propertyType: 'APARTMENT' | 'HOUSE' | 'CONDO' | 'COMMERCIAL';
    monthlyRent: number;
    image: string;
    bedrooms: number;
    bathrooms: number;
    sqft: number;
    yearBuilt: number;
    lastRenovated?: number;
    amenities: string[];
    roi: number;
    occupancyRate: number;
};

// Dynamically import the 3D model component to avoid SSR issues
const PropertyModel3D = dynamic(() => import('@/components/portfolio/PropertyModel3D'), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center h-full w-full min-h-[400px]">
            <div className="animate-pulse text-lg text-center">
                Loading 3D Model...
            </div>
        </div>
    ),
});

export default function PropertyDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    const { data, error } = useQuery(GET_PROPERTY, {
        variables: { id: Number(params?.id) },
        skip: !params?.id,
    });

    const property = data?.property;

    const getStatusVariant = (status: Property['status']) => {
        switch (status) {
            case 'OCCUPIED': return 'success';
            case 'VACANT': return 'info';
            case 'MAINTENANCE': return 'warning';
            default: return 'default';
        }
    };

    const getPropertyTypeLabel = (type: Property['propertyType']) => {
        switch (type) {
            case 'APARTMENT': return 'Apartment';
            case 'HOUSE': return 'House';
            case 'CONDO': return 'Condo';
            case 'COMMERCIAL': return 'Commercial';
            default: return type;
        }
    };

    if (loading || !data) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Card className="p-8">
                    <div className="animate-pulse flex flex-col gap-4">
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                        <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        </div>
                    </div>
                </Card>
            </div>
        );
    }

    if (error || !property) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Card className="p-8">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Property</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            {error ? error.message : 'Property not found'}
                        </p>
                        <Button onClick={() => router.push('/properties')}>
                            Back to Properties
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <Button onClick={() => router.push('/properties')}>
                    Back to Properties
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h1 className="text-3xl font-bold mb-4">{property.address}</h1>
                    <p className="text-gray-600 mb-2">
                        {property.city}, {property.state} {property.zipCode}
                    </p>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                            <p className="text-sm text-gray-500">Status</p>
                            <p className="font-semibold">{property.status}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Property Type</p>
                            <p className="font-semibold">{getPropertyTypeLabel(property.propertyType)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Monthly Rent</p>
                            <p className="font-semibold">${property.monthlyRent.toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">ROI</p>
                            <p className="font-semibold">{property.roi}%</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Occupancy Rate</p>
                            <p className="font-semibold">{property.occupancyRate}%</p>
                        </div>
                    </div>
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold mb-2">Details</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Bedrooms</p>
                                <p className="font-semibold">{property.bedrooms}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Bathrooms</p>
                                <p className="font-semibold">{property.bathrooms}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Square Feet</p>
                                <p className="font-semibold">{property.sqft.toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Year Built</p>
                                <p className="font-semibold">{property.yearBuilt}</p>
                            </div>
                            {property.lastRenovated && (
                                <div>
                                    <p className="text-sm text-gray-500">Last Renovated</p>
                                    <p className="font-semibold">{property.lastRenovated}</p>
                                </div>
                            )}
                        </div>
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold mb-2">Amenities</h2>
                        <ul className="list-disc list-inside">
                            {property.amenities.map((amenity: string, index: number) => (
                                <li key={index} className="text-gray-600">
                                    {amenity}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="h-[400px]">
                    <PropertyModel3D
                        propertyType={property.propertyType?.toLowerCase() || 'building'}
                        colorScheme="german"
                        height={400}
                        width={500}
                        className="w-full h-full"
                    />
                </div>
            </div>
        </div>
    );
}
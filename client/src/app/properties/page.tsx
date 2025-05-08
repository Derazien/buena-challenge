'use client';

import { useState } from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Image from 'next/image';
import { useQuery } from '@apollo/client';
import { GET_PROPERTIES } from '@/graphql/queries';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorDisplay from '@/components/common/ErrorDisplay';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';

const PropertyModel3D = dynamic(() => import('@/components/portfolio/PropertyModel3D'), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center h-full w-full min-h-[400px]">
            <div className="animate-pulse text-lg text-center">Loading 3D Model...</div>
        </div>
    ),
});

// Define the type for properties
interface Property {
    id: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    status: 'OCCUPIED' | 'VACANT' | 'MAINTENANCE';
    propertyType: 'APARTMENT' | 'HOUSE' | 'CONDO' | 'COMMERCIAL';
    monthlyRent: number;
    image?: string;
    bedrooms?: number;
    bathrooms?: number;
    sqft?: number;
    yearBuilt?: number;
    amenities?: string[];
    roi?: number;
    occupancyRate?: number;
}

export default function PropertiesPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const [sortBy, setSortBy] = useState('address');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

    const { loading, error, data } = useQuery(GET_PROPERTIES);

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <ErrorDisplay error={error.message} />;
    }

    const properties: Property[] = data?.properties || [];

    // Filter properties
    const filteredProperties = properties.filter((property: Property) => {
        const matchesSearch = property.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
            property.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
            property.zipCode.includes(searchQuery);

        const matchesStatus = statusFilter === 'all' || property.status === statusFilter;
        const matchesType = typeFilter === 'all' || property.propertyType === typeFilter;

        return matchesSearch && matchesStatus && matchesType;
    });

    // Sort properties
    const sortedProperties = [...filteredProperties].sort((a: Property, b: Property) => {
        let comparison = 0;
        switch (sortBy) {
            case 'address':
                comparison = a.address.localeCompare(b.address);
                break;
            case 'monthlyRent':
                comparison = a.monthlyRent - b.monthlyRent;
                break;
            case 'roi':
                comparison = (a.roi || 0) - (b.roi || 0);
                break;
            case 'sqft':
                comparison = (a.sqft || 0) - (b.sqft || 0);
                break;
            default:
                comparison = 0;
        }
        return sortOrder === 'asc' ? comparison : -comparison;
    });

    // Helper functions
    const getTotalProperties = () => properties.length;

    const getTotalMonthlyIncome = () => {
        return properties.reduce((sum: number, property: Property) => sum + property.monthlyRent, 0);
    };

    const getAverageOccupancyRate = () => {
        const propertiesWithOccupancy = properties.filter((p: Property) => p.occupancyRate !== undefined);
        if (propertiesWithOccupancy.length === 0) return 0;
        const sum = propertiesWithOccupancy.reduce((acc: number, p: Property) => acc + (p.occupancyRate || 0), 0);
        return sum / propertiesWithOccupancy.length;
    };

    const getAverageRoi = () => {
        return properties.reduce((sum: number, property: Property) => sum + (property.roi || 0), 0) / properties.length;
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

    // Helper to map propertyType to allowed values for PropertyModel3D
    const get3DModelType = (type: Property['propertyType']): 'building' | 'apartment' | 'house' | undefined => {
        switch (type) {
            case 'APARTMENT': return 'apartment';
            case 'HOUSE': return 'house';
            case 'CONDO': return 'building'; // Map CONDO to 'building' for demo
            case 'COMMERCIAL': return 'building'; // Map COMMERCIAL to 'building' for demo
            default: return 'building';
        }
    };

    // Property Income Overview Table
    const handleRowClick = (property: Property) => {
        setSelectedProperty(property);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedProperty(null);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Properties</h1>
                    <p className="text-gray-500 dark:text-gray-400">Manage your real estate portfolio</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-green-100 dark:bg-green-900 mr-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 dark:text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Monthly Income</p>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">€{getTotalMonthlyIncome().toLocaleString()}</h3>
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 mr-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Total Properties</p>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{getTotalProperties()}</h3>
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900 mr-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500 dark:text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Average ROI</p>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{getAverageRoi().toFixed(1)}%</h3>
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900 mr-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500 dark:text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Occupancy Rate</p>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{getAverageOccupancyRate().toFixed(1)}%</h3>
                        </div>
                    </div>
                </Card>
            </div>

            <Card className="p-6 mb-8">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Search properties..."
                            className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-4">
                        <select
                            className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="OCCUPIED">Occupied</option>
                            <option value="VACANT">Vacant</option>
                            <option value="MAINTENANCE">Maintenance</option>
                        </select>

                        <select
                            className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                        >
                            <option value="all">All Types</option>
                            <option value="APARTMENT">Apartment</option>
                            <option value="HOUSE">House</option>
                            <option value="CONDO">Condo</option>
                            <option value="COMMERCIAL">Commercial</option>
                        </select>

                        <select
                            className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="address">Address</option>
                            <option value="monthlyRent">Monthly Rent</option>
                            <option value="roi">ROI</option>
                            <option value="sqft">Square Feet</option>
                        </select>

                        <select
                            className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                        >
                            <option value="asc">Ascending</option>
                            <option value="desc">Descending</option>
                        </select>

                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                </svg>
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Modal for 3D Model and Property Details */}
            {modalOpen && selectedProperty && (
                <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={closeModal}>
                    <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden w-full max-w-3xl shadow-2xl flex flex-col" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
                            <h3 className="text-lg font-bold">3D Model & Property Details</h3>
                            <button onClick={closeModal} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <div className="flex flex-col md:flex-row">
                            <div className="flex-1 min-h-[350px] bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                <PropertyModel3D
                                    propertyType={get3DModelType(selectedProperty.propertyType)}
                                    colorScheme="german"
                                    height={350}
                                    width={400}
                                    className="w-full h-full"
                                />
                            </div>
                            <div className="flex-1 p-6 space-y-2">
                                <div className="font-semibold text-lg mb-2">{selectedProperty.address}</div>
                                <div className="text-gray-500 mb-1">{selectedProperty.city}, {selectedProperty.state} {selectedProperty.zipCode}</div>
                                <div className="mb-1">Monthly Rent: <span className="font-medium">€{selectedProperty.monthlyRent.toLocaleString()}</span></div>
                                <div className="mb-1">Occupancy Rate: <span className="font-medium">{selectedProperty.occupancyRate?.toFixed(1)}%</span></div>
                                <div className="mb-1">Status: <span className="font-medium">{selectedProperty.status}</span></div>
                                <div className="mb-1">Type: <span className="font-medium">{getPropertyTypeLabel(selectedProperty.propertyType)}</span></div>
                                <div className="mb-1">Bedrooms: <span className="font-medium">{selectedProperty.bedrooms}</span></div>
                                <div className="mb-1">Bathrooms: <span className="font-medium">{selectedProperty.bathrooms}</span></div>
                                <div className="mb-1">Square Feet: <span className="font-medium">{selectedProperty.sqft?.toLocaleString()}</span></div>
                                <div className="mb-1">Year Built: <span className="font-medium">{selectedProperty.yearBuilt}</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedProperties.map((property: Property) => (
                        <div
                            key={property.id}
                            className="cursor-pointer hover:shadow-lg transition-shadow h-full"
                            onClick={() => handleRowClick(property)}
                        >
                            <Card className="h-full">
                                <div className="relative h-48 mb-4">
                                    <Image
                                        src={property.image || '/images/placeholder.jpg'}
                                        alt={property.address}
                                        fill
                                        className="object-cover rounded-t-lg"
                                    />
                                </div>
                                <div className="p-4">
                                    <h2 className="text-xl font-semibold mb-2">{property.address}</h2>
                                    <p className="text-gray-600 mb-4">
                                        {property.city}, {property.state} {property.zipCode}
                                    </p>
                                    <div className="flex gap-2 mb-4">
                                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                                            {property.status}
                                        </Badge>
                                        <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                                            {getPropertyTypeLabel(property.propertyType)}
                                        </Badge>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Monthly Rent</p>
                                            <p className="font-semibold">€{property.monthlyRent.toLocaleString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">ROI</p>
                                            <p className="font-semibold">{property.roi?.toFixed(1)}%</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Occupancy Rate</p>
                                            <p className="font-semibold">{property.occupancyRate?.toFixed(1)}%</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Square Feet</p>
                                            <p className="font-semibold">{property.sqft?.toLocaleString() || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="space-y-4">
                    {sortedProperties.map((property: Property) => (
                        <div
                            key={property.id}
                            className="cursor-pointer"
                            onClick={() => handleRowClick(property)}
                        >
                            <Card className="p-6">
                                <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                                    <div>
                                        <div className="flex items-center mb-2">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mr-3">{property.address}</h3>
                                            <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                                                {getPropertyTypeLabel(property.propertyType)}
                                            </Badge>
                                        </div>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                                            {property.city}, {property.state} {property.zipCode}
                                        </p>
                                    </div>
                                    <div className="mt-3 md:mt-0 md:text-right">
                                        <div className="text-gray-500 dark:text-gray-400 text-xs">Monthly Rent</div>
                                        <div className="font-medium">€{property.monthlyRent.toLocaleString()}</div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                                            {property.status}
                                        </Badge>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">ROI</p>
                                        <p className="font-semibold">{property.roi?.toFixed(1)}%</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Occupancy Rate</p>
                                        <p className="font-semibold">{property.occupancyRate?.toFixed(1)}%</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Square Feet</p>
                                        <p className="font-semibold">{property.sqft?.toLocaleString() || 'N/A'}</p>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    ))}
                </div>
            )}

            {filteredProperties.length === 0 && (
                <Card className="py-12">
                    <div className="text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No properties found</h3>
                        <p className="mt-2 text-gray-500 dark:text-gray-400">
                            Try adjusting your search or filter criteria to find what you're looking for.
                        </p>
                        <div className="mt-6">
                            <Button onClick={() => { setStatusFilter('all'); setTypeFilter('all'); setSearchQuery(''); }}>
                                Clear Filters
                            </Button>
                        </div>
                    </div>
                </Card>
            )}
        </div>
    );
}
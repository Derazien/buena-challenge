'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

// Define the Property type (same as in properties/page.tsx)
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

// Mock data for properties (same as in properties/page.tsx)
const MOCK_PROPERTIES: Property[] = [
    {
        id: 1,
        address: '123 Main Street',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94105',
        status: 'OCCUPIED',
        propertyType: 'APARTMENT',
        monthlyRent: 3500,
        image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        bedrooms: 2,
        bathrooms: 2,
        sqft: 1250,
        yearBuilt: 2015,
        lastRenovated: 2021,
        amenities: ['In-unit Laundry', 'Balcony', 'Stainless Steel Appliances', 'Hardwood Floors'],
        roi: 7.2,
        occupancyRate: 95,
    },
    {
        id: 2,
        address: '456 Oak Avenue',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90012',
        status: 'VACANT',
        propertyType: 'HOUSE',
        monthlyRent: 4800,
        image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        bedrooms: 3,
        bathrooms: 2.5,
        sqft: 2100,
        yearBuilt: 2008,
        lastRenovated: 2020,
        amenities: ['Backyard', 'Garage', 'Central AC', 'Smart Home System'],
        roi: 6.5,
        occupancyRate: 92,
    },
    {
        id: 3,
        address: '789 Pine Boulevard',
        city: 'San Diego',
        state: 'CA',
        zipCode: '92101',
        status: 'MAINTENANCE',
        propertyType: 'CONDO',
        monthlyRent: 2700,
        image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        bedrooms: 1,
        bathrooms: 1,
        sqft: 850,
        yearBuilt: 2012,
        amenities: ['Pool', 'Fitness Center', 'Concierge', 'Rooftop Deck'],
        roi: 5.9,
        occupancyRate: 88,
    },
    {
        id: 4,
        address: '101 Market Street',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94103',
        status: 'OCCUPIED',
        propertyType: 'COMMERCIAL',
        monthlyRent: 8500,
        image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        bedrooms: 0,
        bathrooms: 2,
        sqft: 3200,
        yearBuilt: 2010,
        lastRenovated: 2019,
        amenities: ['High Ceilings', 'Freight Elevator', 'Loading Dock', 'Meeting Rooms'],
        roi: 8.3,
        occupancyRate: 97,
    },
    {
        id: 5,
        address: '222 Beachside Drive',
        city: 'Santa Monica',
        state: 'CA',
        zipCode: '90401',
        status: 'OCCUPIED',
        propertyType: 'APARTMENT',
        monthlyRent: 4200,
        image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        bedrooms: 2,
        bathrooms: 2,
        sqft: 1100,
        yearBuilt: 2018,
        amenities: ['Ocean View', 'Parking', 'Gym', 'Pet Friendly'],
        roi: 6.8,
        occupancyRate: 96,
    },
    {
        id: 6,
        address: '555 Highland Avenue',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90036',
        status: 'VACANT',
        propertyType: 'HOUSE',
        monthlyRent: 5500,
        image: 'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        bedrooms: 4,
        bathrooms: 3,
        sqft: 2800,
        yearBuilt: 2005,
        lastRenovated: 2022,
        amenities: ['Pool', 'Home Theater', 'Guest House', 'Landscaped Garden'],
        roi: 7.5,
        occupancyRate: 89,
    },
];

export default function PropertyDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [property, setProperty] = useState<Property | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // In a real app, this would be an API call
        if (params?.id) {
            const propertyId = Number(params.id);
            const foundProperty = MOCK_PROPERTIES.find(p => p.id === propertyId);

            if (foundProperty) {
                setProperty(foundProperty);
            }
        }

        setLoading(false);
    }, [params?.id]);

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

    if (loading) {
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

    if (!property) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Card className="p-8 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Property Not Found</h3>
                    <p className="mt-2 text-gray-500 dark:text-gray-400">
                        We couldn't find the property you're looking for.
                    </p>
                    <div className="mt-6">
                        <Link href="/properties">
                            <Button>Back to Properties</Button>
                        </Link>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <Link href="/properties" className="text-blue-600 hover:underline flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                        Back to Properties
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{property.address}</h1>
                    <p className="text-gray-600 dark:text-gray-400">{property.city}, {property.state} {property.zipCode}</p>
                </div>

                <div className="flex gap-3">
                    <Link href={`/properties/${property.id}/edit`}>
                        <Button variant="outline">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit Property
                        </Button>
                    </Link>
                    <Button variant="default">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Manage Leases
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card className="overflow-hidden">
                        <div className="h-64 sm:h-80 md:h-96 w-full relative">
                            <Image
                                src={property.image}
                                alt={property.address}
                                fill
                                className="object-cover"
                                priority
                            />
                            <div className="absolute top-4 right-4 flex gap-2">
                                <Badge
                                    variant={getStatusVariant(property.status)}
                                    className="text-sm px-3 py-1"
                                >
                                    {property.status}
                                </Badge>
                                <Badge
                                    variant="secondary"
                                    className="text-sm px-3 py-1"
                                >
                                    {getPropertyTypeLabel(property.propertyType)}
                                </Badge>
                            </div>
                        </div>

                        <div className="p-6">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Property Details</h2>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Property Type</h3>
                                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {getPropertyTypeLabel(property.propertyType)}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Square Feet</h3>
                                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {property.sqft.toLocaleString()}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Bedrooms</h3>
                                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {property.bedrooms}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Bathrooms</h3>
                                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {property.bathrooms}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Year Built</h3>
                                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {property.yearBuilt}
                                    </p>
                                </div>
                                {property.lastRenovated && (
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Renovated</h3>
                                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                            {property.lastRenovated}
                                        </p>
                                    </div>
                                )}
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Monthly Rent</h3>
                                    <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                                        €{property.monthlyRent.toLocaleString()}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</h3>
                                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {property.status}
                                    </p>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Amenities</h3>
                                <div className="flex flex-wrap gap-2">
                                    {property.amenities.map((amenity, index) => (
                                        <span key={index} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm">
                                            {amenity}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Location</h3>
                                    <div className="aspect-video bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                                        <p className="text-gray-500 dark:text-gray-400 text-sm">Map view would go here</p>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Documents</h3>
                                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg divide-y divide-gray-200 dark:divide-gray-700">
                                        <div className="p-4 flex justify-between items-center">
                                            <div className="flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                <span className="text-gray-900 dark:text-white">Lease Agreement</span>
                                            </div>
                                            <Button variant="outline" size="sm">View</Button>
                                        </div>
                                        <div className="p-4 flex justify-between items-center">
                                            <div className="flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                <span className="text-gray-900 dark:text-white">Property Tax Records</span>
                                            </div>
                                            <Button variant="outline" size="sm">View</Button>
                                        </div>
                                        <div className="p-4 flex justify-between items-center">
                                            <div className="flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                <span className="text-gray-900 dark:text-white">Insurance Policy</span>
                                            </div>
                                            <Button variant="outline" size="sm">View</Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                <div>
                    <Card className="p-6 mb-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Financial Overview</h2>

                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-gray-600 dark:text-gray-400">Monthly Rent</span>
                                    <span className="font-semibold text-blue-600 dark:text-blue-400">€{property.monthlyRent.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-gray-600 dark:text-gray-400">Annual Income</span>
                                    <span className="font-semibold text-blue-600 dark:text-blue-400">€{(property.monthlyRent * 12).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-gray-600 dark:text-gray-400">ROI</span>
                                    <span className="font-semibold text-green-600 dark:text-green-400">{property.roi}%</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 dark:text-gray-400">Occupancy Rate</span>
                                    <span className="font-semibold text-green-600 dark:text-green-400">{property.occupancyRate}%</span>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Monthly Expenses</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 dark:text-gray-400">Property Tax</span>
                                        <span className="font-medium">€350</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 dark:text-gray-400">Insurance</span>
                                        <span className="font-medium">€120</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 dark:text-gray-400">Maintenance</span>
                                        <span className="font-medium">€200</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 dark:text-gray-400">Property Management</span>
                                        <span className="font-medium">€280</span>
                                    </div>
                                    <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                                        <div className="flex justify-between items-center font-semibold">
                                            <span>Total Monthly Expenses</span>
                                            <span>€950</span>
                                        </div>
                                    </div>
                                    <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                                        <div className="flex justify-between items-center font-semibold text-green-600 dark:text-green-400">
                                            <span>Net Monthly Income</span>
                                            <span>€{property.monthlyRent - 950}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Current Tenant</h2>

                        {property.status === 'OCCUPIED' ? (
                            <div className="space-y-4">
                                <div className="flex items-center">
                                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mr-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full text-gray-400 p-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">John Doe</h3>
                                        <p className="text-gray-600 dark:text-gray-400">Tenant since January 2023</p>
                                    </div>
                                </div>

                                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</h4>
                                            <p className="text-gray-900 dark:text-white">(555) 123-4567</p>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</h4>
                                            <p className="text-gray-900 dark:text-white">john.doe@example.com</p>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Lease End</h4>
                                            <p className="text-gray-900 dark:text-white">Dec 31, 2023</p>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Payment Status</h4>
                                            <p className="text-green-600 dark:text-green-400">Current</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3 mt-2">
                                    <Button variant="outline" size="sm" className="flex-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        Contact
                                    </Button>
                                    <Button variant="outline" size="sm" className="flex-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        View Lease
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-6">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No Current Tenant</h3>
                                <p className="mt-2 text-gray-500 dark:text-gray-400">
                                    This property is currently {property.status === 'VACANT' ? 'vacant' : 'under maintenance'}.
                                </p>
                                {property.status === 'VACANT' && (
                                    <div className="mt-6">
                                        <Button>List for Rent</Button>
                                    </div>
                                )}
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
}
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Image from 'next/image';

// Define the type for properties
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
    roi: number; // Return on Investment percentage
    occupancyRate: number; // Historical occupancy rate percentage
};

// Mock data for properties with more professional details
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

export default function PropertiesPage() {
    const [properties] = useState<Property[]>(MOCK_PROPERTIES);
    const [statusFilter, setStatusFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('address');
    const [sortOrder, setSortOrder] = useState('asc');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    // Filter and sort properties
    const filteredProperties = properties
        .filter(property => {
            // Status filter
            if (statusFilter !== 'all' && property.status !== statusFilter) {
                return false;
            }

            // Type filter
            if (typeFilter !== 'all' && property.propertyType !== typeFilter) {
                return false;
            }

            // Search query
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                return (
                    property.address.toLowerCase().includes(query) ||
                    property.city.toLowerCase().includes(query) ||
                    property.state.toLowerCase().includes(query) ||
                    property.zipCode.toLowerCase().includes(query)
                );
            }

            return true;
        })
        .sort((a, b) => {
            // Sort properties
            let compareA, compareB;

            switch (sortBy) {
                case 'address':
                    compareA = a.address;
                    compareB = b.address;
                    break;
                case 'rent':
                    compareA = a.monthlyRent;
                    compareB = b.monthlyRent;
                    break;
                case 'roi':
                    compareA = a.roi;
                    compareB = b.roi;
                    break;
                case 'sqft':
                    compareA = a.sqft;
                    compareB = b.sqft;
                    break;
                default:
                    compareA = a.address;
                    compareB = b.address;
            }

            if (sortOrder === 'asc') {
                return compareA > compareB ? 1 : -1;
            } else {
                return compareA < compareB ? 1 : -1;
            }
        });

    // Helper functions
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

    const getTotalMonthlyIncome = () => {
        return properties
            .filter(property => property.status === 'OCCUPIED')
            .reduce((total, property) => total + property.monthlyRent, 0);
    };

    const getAverageRoi = () => {
        return properties.reduce((sum, property) => sum + property.roi, 0) / properties.length;
    };

    const getAverageOccupancyRate = () => {
        return properties.reduce((sum, property) => sum + property.occupancyRate, 0) / properties.length;
    };

    const toggleSort = (field: string) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('asc');
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <Link href="/" className="text-blue-600 hover:underline flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                        Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">Property Portfolio</h1>
                </div>

                <Button variant="default">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Add Property
                </Button>
            </div>

            {/* Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card className="p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 mr-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Total Properties</p>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{properties.length}</h3>
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-green-100 dark:bg-green-900 mr-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 dark:text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Monthly Income</p>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">${getTotalMonthlyIncome().toLocaleString()}</h3>
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
                        <div className="p-3 rounded-full bg-amber-100 dark:bg-amber-900 mr-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-500 dark:text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Occupancy Rate</p>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{getAverageOccupancyRate().toFixed(0)}%</h3>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Search and Filters */}
            <Card className="p-6 mb-8">
                <div className="flex flex-wrap gap-4 mb-6">
                    <div className="flex-1 min-w-[280px]">
                        <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Search Properties</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <input
                                id="search"
                                type="text"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                                placeholder="Search by address, city, or zip code"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                        <select
                            id="status-filter"
                            className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">All Statuses</option>
                            <option value="OCCUPIED">Occupied</option>
                            <option value="VACANT">Vacant</option>
                            <option value="MAINTENANCE">Maintenance</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Property Type</label>
                        <select
                            id="type-filter"
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
                    </div>

                    <div>
                        <label htmlFor="sort-by" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sort By</label>
                        <select
                            id="sort-by"
                            className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                            value={sortBy}
                            onChange={(e) => toggleSort(e.target.value)}
                        >
                            <option value="address">Address</option>
                            <option value="rent">Monthly Rent</option>
                            <option value="roi">ROI</option>
                            <option value="sqft">Square Footage</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="sort-order" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Order</label>
                        <select
                            id="sort-order"
                            className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                        >
                            <option value="asc">Ascending</option>
                            <option value="desc">Descending</option>
                        </select>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        Showing {filteredProperties.length} of {properties.length} properties
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                            </svg>
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </Card>

            {/* Property Cards */}
            {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProperties.map((property) => (
                        <Card key={property.id} className="overflow-hidden flex flex-col h-full">
                            <div className="h-48 -mx-6 -mt-6 mb-4 overflow-hidden relative">
                                <Image
                                    src={property.image}
                                    alt={property.address}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                    width={500}
                                    height={300}
                                />
                                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/50 to-transparent opacity-60"></div>
                                <Badge
                                    variant={getStatusVariant(property.status)}
                                    className="absolute top-3 right-3"
                                >
                                    {property.status}
                                </Badge>
                                <Badge
                                    variant="secondary"
                                    className="absolute top-3 left-3"
                                >
                                    {getPropertyTypeLabel(property.propertyType)}
                                </Badge>
                            </div>

                            <div className="flex-1 p-1">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">{property.address}</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">
                                    {property.city}, {property.state} {property.zipCode}
                                </p>

                                <div className="flex flex-wrap items-center gap-4 mb-4 text-sm">
                                    <div className="flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                        </svg>
                                        <span className="text-gray-700 dark:text-gray-300">{property.sqft} sqft</span>
                                    </div>
                                    {property.bedrooms > 0 && (
                                        <div className="flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                            </svg>
                                            <span className="text-gray-700 dark:text-gray-300">{property.bedrooms} bed{property.bedrooms !== 1 ? 's' : ''}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span className="text-gray-700 dark:text-gray-300">{property.yearBuilt}</span>
                                    </div>
                                </div>

                                {property.amenities.length > 0 && (
                                    <div className="mb-4">
                                        <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-2">Amenities</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {property.amenities.slice(0, 3).map((amenity, index) => (
                                                <span key={index} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded text-xs">
                                                    {amenity}
                                                </span>
                                            ))}
                                            {property.amenities.length > 3 && (
                                                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded text-xs">
                                                    +{property.amenities.length - 3} more
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-between items-center">
                                    <div>
                                        <div className="text-gray-500 dark:text-gray-400 text-xs">Monthly Rent</div>
                                        <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                                            ${property.monthlyRent.toLocaleString()}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-gray-500 dark:text-gray-400 text-xs">ROI</div>
                                        <div className="font-semibold text-green-600 dark:text-green-400">
                                            {property.roi}%
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between mt-5 pt-5 border-t border-gray-200 dark:border-gray-700">
                                <Link href={`/properties/${property.id}`} className="flex-1 mr-2">
                                    <Button variant="outline" size="sm" className="w-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                        Details
                                    </Button>
                                </Link>
                                <Link href={`/properties/${property.id}/edit`} className="flex-1 ml-2">
                                    <Button variant="outline" size="sm" className="w-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        Edit
                                    </Button>
                                </Link>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredProperties.map((property) => (
                        <Card key={property.id} className="overflow-hidden mb-4 p-0">
                            <div className="flex flex-col md:flex-row">
                                <div className="md:w-1/4 h-48 md:h-auto relative">
                                    <Image
                                        src={property.image}
                                        alt={property.address}
                                        className="w-full h-full object-cover"
                                        width={300}
                                        height={200}
                                    />
                                    <Badge
                                        variant={getStatusVariant(property.status)}
                                        className="absolute top-3 right-3"
                                    >
                                        {property.status}
                                    </Badge>
                                </div>

                                <div className="flex-1 p-6">
                                    <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                                        <div>
                                            <div className="flex items-center mb-2">
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mr-3">{property.address}</h3>
                                                <Badge variant="secondary">
                                                    {getPropertyTypeLabel(property.propertyType)}
                                                </Badge>
                                            </div>
                                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                                {property.city}, {property.state} {property.zipCode}
                                            </p>
                                        </div>
                                        <div className="mt-3 md:mt-0 md:text-right">
                                            <div className="text-gray-500 dark:text-gray-400 text-xs">Monthly Rent</div>
                                            <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                                                ${property.monthlyRent.toLocaleString()}/month
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                        <div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">Square Feet</div>
                                            <div className="font-medium text-gray-900 dark:text-white">{property.sqft.toLocaleString()}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">Beds / Baths</div>
                                            <div className="font-medium text-gray-900 dark:text-white">
                                                {property.bedrooms} / {property.bathrooms}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">Year Built</div>
                                            <div className="font-medium text-gray-900 dark:text-white">
                                                {property.yearBuilt}
                                                {property.lastRenovated && ` (Renov. ${property.lastRenovated})`}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">ROI</div>
                                            <div className="font-medium text-green-600 dark:text-green-400">{property.roi}%</div>
                                        </div>
                                    </div>

                                    {property.amenities.length > 0 && (
                                        <div className="mb-4">
                                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Amenities</div>
                                            <div className="flex flex-wrap gap-2">
                                                {property.amenities.map((amenity, index) => (
                                                    <span key={index} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded text-xs">
                                                        {amenity}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex flex-wrap gap-3 mt-4">
                                        <Link href={`/properties/${property.id}`}>
                                            <Button variant="default" size="sm">
                                                View Details
                                            </Button>
                                        </Link>
                                        <Link href={`/properties/${property.id}/edit`}>
                                            <Button variant="outline" size="sm">
                                                Edit Property
                                            </Button>
                                        </Link>
                                        <Button variant="outline" size="sm">
                                            Manage Leases
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Card>
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
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

// Define the type for properties
type Property = {
    id: number;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    status: 'OCCUPIED' | 'VACANT' | 'MAINTENANCE';
    monthlyRent: number;
    image: string;
};

// Mock data for properties
const MOCK_PROPERTIES: Property[] = [
    {
        id: 1,
        address: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zipCode: '90210',
        status: 'OCCUPIED',
        monthlyRent: 2500,
        image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    },
    {
        id: 2,
        address: '456 Oak Ave',
        city: 'Someville',
        state: 'CA',
        zipCode: '90211',
        status: 'VACANT',
        monthlyRent: 1800,
        image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    },
    {
        id: 3,
        address: '789 Pine Blvd',
        city: 'Othercity',
        state: 'CA',
        zipCode: '90212',
        status: 'MAINTENANCE',
        monthlyRent: 2200,
        image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    },
];

export default function PropertiesPage() {
    const [properties] = useState<Property[]>(MOCK_PROPERTIES);
    const [filter, setFilter] = useState('all');

    // Filter properties based on status
    const filteredProperties = filter === 'all'
        ? properties
        : properties.filter(property => property.status === filter);

    const getStatusVariant = (status: Property['status']) => {
        switch (status) {
            case 'OCCUPIED': return 'success';
            case 'VACANT': return 'info';
            case 'MAINTENANCE': return 'warning';
            default: return 'default';
        }
    };

    const getTotalIncome = () => {
        return properties
            .filter(property => property.status === 'OCCUPIED')
            .reduce((total, property) => total + property.monthlyRent, 0);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <Link href="/" className="text-buena-primary hover:underline flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                        Back to Dashboard
                    </Link>
                    <h1 className="text-2xl font-bold text-buena-dark mt-2">Your Properties</h1>
                </div>

                <Button>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Add Property
                </Button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                    <h2 className="text-lg font-medium text-buena-dark mb-1">Total Properties</h2>
                    <div className="text-3xl font-bold text-buena-primary">{properties.length}</div>
                    <div className="mt-1 text-buena-muted text-sm">Properties in your portfolio</div>
                </Card>

                <Card>
                    <h2 className="text-lg font-medium text-buena-dark mb-1">Monthly Income</h2>
                    <div className="text-3xl font-bold text-buena-success">${getTotalIncome().toLocaleString()}</div>
                    <div className="mt-1 text-buena-muted text-sm">From occupied properties</div>
                </Card>

                <Card>
                    <h2 className="text-lg font-medium text-buena-dark mb-1">Occupancy Rate</h2>
                    <div className="text-3xl font-bold text-buena-info">
                        {Math.round((properties.filter(p => p.status === 'OCCUPIED').length / properties.length) * 100)}%
                    </div>
                    <div className="mt-1 text-buena-muted text-sm">Properties currently occupied</div>
                </Card>
            </div>

            {/* Filter Tabs */}
            <div className="mb-6 border-b border-buena-border">
                <nav className="-mb-px flex space-x-6 overflow-x-auto">
                    <button
                        className={`py-2 px-1 whitespace-nowrap ${filter === 'all' ? 'border-b-2 border-buena-primary text-buena-primary font-medium' : 'text-buena-muted hover:text-buena-dark'}`}
                        onClick={() => setFilter('all')}
                    >
                        All Properties
                    </button>
                    <button
                        className={`py-2 px-1 whitespace-nowrap ${filter === 'OCCUPIED' ? 'border-b-2 border-buena-primary text-buena-primary font-medium' : 'text-buena-muted hover:text-buena-dark'}`}
                        onClick={() => setFilter('OCCUPIED')}
                    >
                        Occupied
                    </button>
                    <button
                        className={`py-2 px-1 whitespace-nowrap ${filter === 'VACANT' ? 'border-b-2 border-buena-primary text-buena-primary font-medium' : 'text-buena-muted hover:text-buena-dark'}`}
                        onClick={() => setFilter('VACANT')}
                    >
                        Vacant
                    </button>
                    <button
                        className={`py-2 px-1 whitespace-nowrap ${filter === 'MAINTENANCE' ? 'border-b-2 border-buena-primary text-buena-primary font-medium' : 'text-buena-muted hover:text-buena-dark'}`}
                        onClick={() => setFilter('MAINTENANCE')}
                    >
                        Maintenance
                    </button>
                </nav>
            </div>

            {/* Property Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProperties.map((property) => (
                    <Card key={property.id} className="overflow-hidden flex flex-col">
                        <div className="h-40 -mx-6 -mt-6 mb-4 overflow-hidden relative">
                            <img
                                src={property.image}
                                alt={property.address}
                                className="w-full h-full object-cover"
                            />
                            <Badge
                                variant={getStatusVariant(property.status)}
                                className="absolute top-3 right-3"
                            >
                                {property.status}
                            </Badge>
                        </div>

                        <h3 className="text-lg font-medium text-buena-dark">{property.address}</h3>
                        <p className="text-buena-muted text-sm">
                            {property.city}, {property.state} {property.zipCode}
                        </p>

                        <div className="mt-2 text-buena-primary font-medium">
                            ${property.monthlyRent.toLocaleString()}/month
                        </div>

                        <div className="flex justify-between mt-4 pt-4 border-t border-buena-border">
                            <Button variant="outline" className="w-[48%]">
                                Details
                            </Button>
                            <Button variant="outline" className="w-[48%]">
                                Edit
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
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

export default function PropertyEditPage() {
    const params = useParams();
    const router = useRouter();
    const [property, setProperty] = useState<Property | null>(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState<Partial<Property>>({});
    const [amenityInput, setAmenityInput] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        // In a real app, this would be an API call
        if (params?.id) {
            const propertyId = Number(params.id);
            const foundProperty = MOCK_PROPERTIES.find(p => p.id === propertyId);

            if (foundProperty) {
                setProperty(foundProperty);
                setFormData(foundProperty);
            }

            setLoading(false);
        }
    }, [params?.id]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: name === 'monthlyRent' || name === 'bedrooms' || name === 'bathrooms' || name === 'sqft' || name === 'yearBuilt' || name === 'lastRenovated' || name === 'roi' || name === 'occupancyRate'
                ? Number(value)
                : value
        }));

        // Clear error when field is changed
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const addAmenity = () => {
        if (amenityInput.trim() && formData.amenities) {
            if (!formData.amenities.includes(amenityInput.trim())) {
                setFormData(prev => ({
                    ...prev,
                    amenities: [...(prev.amenities || []), amenityInput.trim()]
                }));
            }
            setAmenityInput('');
        }
    };

    const removeAmenity = (index: number) => {
        if (formData.amenities) {
            setFormData(prev => ({
                ...prev,
                amenities: prev.amenities?.filter((_, i) => i !== index)
            }));
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.address?.trim()) {
            newErrors.address = 'Address is required';
        }

        if (!formData.city?.trim()) {
            newErrors.city = 'City is required';
        }

        if (!formData.state?.trim()) {
            newErrors.state = 'State is required';
        }

        if (!formData.zipCode?.trim()) {
            newErrors.zipCode = 'Zip code is required';
        }

        if (!formData.propertyType) {
            newErrors.propertyType = 'Property type is required';
        }

        if (!formData.status) {
            newErrors.status = 'Status is required';
        }

        if (!formData.monthlyRent || formData.monthlyRent <= 0) {
            newErrors.monthlyRent = 'Valid monthly rent is required';
        }

        if (!formData.sqft || formData.sqft <= 0) {
            newErrors.sqft = 'Valid square footage is required';
        }

        if (formData.yearBuilt === undefined || formData.yearBuilt <= 0) {
            newErrors.yearBuilt = 'Valid year built is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        // In a real app, this would be an API call
        setTimeout(() => {
            console.log('Saving property:', formData);
            setIsSubmitting(false);

            // Navigate back to property detail page
            if (property) {
                router.push(`/properties/${property.id}`);
            } else {
                router.push('/properties');
            }
        }, 1000);
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
                        We couldn't find the property you're trying to edit.
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
                    <Link href={`/properties/${property.id}`} className="text-blue-600 hover:underline flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                        Back to Property Details
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">Edit Property</h1>
                    <p className="text-gray-600 dark:text-gray-400">{property.address}</p>
                </div>
            </div>

            <Card className="p-6">
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="md:col-span-2">
                            <div className="relative h-48 sm:h-60 rounded-lg overflow-hidden mb-4">
                                <Image
                                    src={property.image}
                                    alt={property.address}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute bottom-4 right-4">
                                    <Button type="button" variant="outline" size="sm" className="bg-white dark:bg-gray-800">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        Change Image
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address*</label>
                            <input
                                type="text"
                                id="address"
                                name="address"
                                value={formData.address || ''}
                                onChange={handleInputChange}
                                className={`block w-full px-4 py-2 border ${errors.address ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white`}
                                required
                            />
                            {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address}</p>}
                        </div>

                        <div>
                            <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City*</label>
                            <input
                                type="text"
                                id="city"
                                name="city"
                                value={formData.city || ''}
                                onChange={handleInputChange}
                                className={`block w-full px-4 py-2 border ${errors.city ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white`}
                                required
                            />
                            {errors.city && <p className="mt-1 text-sm text-red-500">{errors.city}</p>}
                        </div>

                        <div>
                            <label htmlFor="state" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">State*</label>
                            <input
                                type="text"
                                id="state"
                                name="state"
                                value={formData.state || ''}
                                onChange={handleInputChange}
                                className={`block w-full px-4 py-2 border ${errors.state ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white`}
                                required
                            />
                            {errors.state && <p className="mt-1 text-sm text-red-500">{errors.state}</p>}
                        </div>

                        <div>
                            <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Zip Code*</label>
                            <input
                                type="text"
                                id="zipCode"
                                name="zipCode"
                                value={formData.zipCode || ''}
                                onChange={handleInputChange}
                                className={`block w-full px-4 py-2 border ${errors.zipCode ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white`}
                                required
                            />
                            {errors.zipCode && <p className="mt-1 text-sm text-red-500">{errors.zipCode}</p>}
                        </div>

                        <div>
                            <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Property Type*</label>
                            <select
                                id="propertyType"
                                name="propertyType"
                                value={formData.propertyType || ''}
                                onChange={handleInputChange}
                                className={`block w-full px-4 py-2 border ${errors.propertyType ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white`}
                                required
                            >
                                <option value="">Select property type</option>
                                <option value="APARTMENT">Apartment</option>
                                <option value="HOUSE">House</option>
                                <option value="CONDO">Condo</option>
                                <option value="COMMERCIAL">Commercial</option>
                            </select>
                            {errors.propertyType && <p className="mt-1 text-sm text-red-500">{errors.propertyType}</p>}
                        </div>

                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status*</label>
                            <select
                                id="status"
                                name="status"
                                value={formData.status || ''}
                                onChange={handleInputChange}
                                className={`block w-full px-4 py-2 border ${errors.status ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white`}
                                required
                            >
                                <option value="">Select status</option>
                                <option value="OCCUPIED">Occupied</option>
                                <option value="VACANT">Vacant</option>
                                <option value="MAINTENANCE">Maintenance</option>
                            </select>
                            {errors.status && <p className="mt-1 text-sm text-red-500">{errors.status}</p>}
                        </div>

                        <div>
                            <label htmlFor="monthlyRent" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Monthly Rent ($)*</label>
                            <input
                                type="number"
                                id="monthlyRent"
                                name="monthlyRent"
                                value={formData.monthlyRent || ''}
                                onChange={handleInputChange}
                                min="0"
                                step="100"
                                className={`block w-full px-4 py-2 border ${errors.monthlyRent ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white`}
                                required
                            />
                            {errors.monthlyRent && <p className="mt-1 text-sm text-red-500">{errors.monthlyRent}</p>}
                        </div>

                        <div>
                            <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bedrooms</label>
                            <input
                                type="number"
                                id="bedrooms"
                                name="bedrooms"
                                value={formData.bedrooms ?? ''}
                                onChange={handleInputChange}
                                min="0"
                                className="block w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                            />
                        </div>

                        <div>
                            <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bathrooms</label>
                            <input
                                type="number"
                                id="bathrooms"
                                name="bathrooms"
                                value={formData.bathrooms ?? ''}
                                onChange={handleInputChange}
                                min="0"
                                step="0.5"
                                className="block w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                            />
                        </div>

                        <div>
                            <label htmlFor="sqft" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Square Feet*</label>
                            <input
                                type="number"
                                id="sqft"
                                name="sqft"
                                value={formData.sqft || ''}
                                onChange={handleInputChange}
                                min="1"
                                className={`block w-full px-4 py-2 border ${errors.sqft ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white`}
                                required
                            />
                            {errors.sqft && <p className="mt-1 text-sm text-red-500">{errors.sqft}</p>}
                        </div>

                        <div>
                            <label htmlFor="yearBuilt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Year Built*</label>
                            <input
                                type="number"
                                id="yearBuilt"
                                name="yearBuilt"
                                value={formData.yearBuilt || ''}
                                onChange={handleInputChange}
                                min="1800"
                                max={new Date().getFullYear()}
                                className={`block w-full px-4 py-2 border ${errors.yearBuilt ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white`}
                                required
                            />
                            {errors.yearBuilt && <p className="mt-1 text-sm text-red-500">{errors.yearBuilt}</p>}
                        </div>

                        <div>
                            <label htmlFor="lastRenovated" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Renovated</label>
                            <input
                                type="number"
                                id="lastRenovated"
                                name="lastRenovated"
                                value={formData.lastRenovated || ''}
                                onChange={handleInputChange}
                                min="1800"
                                max={new Date().getFullYear()}
                                className="block w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                            />
                        </div>

                        <div>
                            <label htmlFor="roi" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ROI (%)</label>
                            <input
                                type="number"
                                id="roi"
                                name="roi"
                                value={formData.roi || ''}
                                onChange={handleInputChange}
                                min="0"
                                step="0.1"
                                max="100"
                                className="block w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                            />
                        </div>

                        <div>
                            <label htmlFor="occupancyRate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Occupancy Rate (%)</label>
                            <input
                                type="number"
                                id="occupancyRate"
                                name="occupancyRate"
                                value={formData.occupancyRate || ''}
                                onChange={handleInputChange}
                                min="0"
                                max="100"
                                className="block w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amenities</label>
                            <div className="flex flex-wrap gap-2 mb-3">
                                {formData.amenities?.map((amenity, index) => (
                                    <span key={index} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm flex items-center">
                                        {amenity}
                                        <button
                                            type="button"
                                            onClick={() => removeAmenity(index)}
                                            className="ml-2 text-gray-500 hover:text-red-500"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </span>
                                ))}
                            </div>
                            <div className="flex">
                                <input
                                    type="text"
                                    id="amenity"
                                    value={amenityInput}
                                    onChange={(e) => setAmenityInput(e.target.value)}
                                    className="block flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-l-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                                    placeholder="Add amenity"
                                />
                                <button
                                    type="button"
                                    onClick={addAmenity}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                >
                                    Add
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-6">
                        <Link href={`/properties/${property.id}`}>
                            <Button type="button" variant="outline">Cancel</Button>
                        </Link>
                        <div className="flex gap-3">
                            <Button type="button" variant="outline" className="text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                                Delete Property
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </div>
                </form>
            </Card>
        </div>
    );
}
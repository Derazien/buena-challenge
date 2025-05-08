import { PrismaClient } from '@prisma/client';
import { add, subMonths, subDays, format } from 'date-fns';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting seed process...');

    // Clear existing data
    await prisma.ticket.deleteMany();
    await prisma.cashFlow.deleteMany();
    await prisma.lease.deleteMany();
    await prisma.property.deleteMany();

    // Create properties
    const properties = [
        {
            address: 'Kurfürstendamm 123',
            city: 'Berlin',
            state: 'Berlin',
            zipCode: '10719',
            status: 'OCCUPIED',
            propertyType: 'APARTMENT',
            monthlyRent: 2500,
            image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
            bedrooms: 2,
            bathrooms: 2,
            sqft: 1250,
            yearBuilt: 2015,
            lastRenovated: 2021,
            amenities: JSON.stringify(['In-unit Laundry', 'Balcony', 'Stainless Steel Appliances', 'Hardwood Floors']),
            roi: 7.2,
            occupancyRate: 95,
        },
        {
            address: 'Maximilianstraße 45',
            city: 'Munich',
            state: 'Bavaria',
            zipCode: '80539',
            status: 'VACANT',
            propertyType: 'HOUSE',
            monthlyRent: 3800,
            image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
            bedrooms: 3,
            bathrooms: 2.5,
            sqft: 2100,
            yearBuilt: 2008,
            lastRenovated: 2020,
            amenities: JSON.stringify(['Backyard', 'Garage', 'Central AC', 'Smart Home System']),
            roi: 6.5,
            occupancyRate: 92,
        },
        {
            address: 'Hafenstraße 78',
            city: 'Hamburg',
            state: 'Hamburg',
            zipCode: '20457',
            status: 'MAINTENANCE',
            propertyType: 'CONDO',
            monthlyRent: 2200,
            image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
            bedrooms: 1,
            bathrooms: 1,
            sqft: 850,
            yearBuilt: 2012,
            amenities: JSON.stringify(['Pool', 'Fitness Center', 'Concierge', 'Rooftop Deck']),
            roi: 5.9,
            occupancyRate: 88,
        },
        {
            address: 'Königsallee 101',
            city: 'Düsseldorf',
            state: 'North Rhine-Westphalia',
            zipCode: '40212',
            status: 'OCCUPIED',
            propertyType: 'COMMERCIAL',
            monthlyRent: 6500,
            image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
            bedrooms: 0,
            bathrooms: 2,
            sqft: 3200,
            yearBuilt: 2010,
            lastRenovated: 2019,
            amenities: JSON.stringify(['High Ceilings', 'Freight Elevator', 'Loading Dock', 'Meeting Rooms']),
            roi: 8.3,
            occupancyRate: 97,
        },
        {
            address: 'Rheinpromenade 222',
            city: 'Cologne',
            state: 'North Rhine-Westphalia',
            zipCode: '50667',
            status: 'OCCUPIED',
            propertyType: 'APARTMENT',
            monthlyRent: 3200,
            image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
            bedrooms: 2,
            bathrooms: 2,
            sqft: 1100,
            yearBuilt: 2018,
            amenities: JSON.stringify(['River View', 'Parking', 'Gym', 'Pet Friendly']),
            roi: 6.8,
            occupancyRate: 96,
        },
        {
            address: 'Hauptstraße 555',
            city: 'Frankfurt',
            state: 'Hesse',
            zipCode: '60313',
            status: 'VACANT',
            propertyType: 'HOUSE',
            monthlyRent: 4500,
            image: 'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
            bedrooms: 4,
            bathrooms: 3,
            sqft: 2800,
            yearBuilt: 2005,
            lastRenovated: 2022,
            amenities: JSON.stringify(['Garden', 'Home Office', 'Guest House', 'Landscaped Garden']),
            roi: 7.5,
            occupancyRate: 89,
        },
    ];

    // Create properties and store their IDs
    const createdProperties = [];
    for (const property of properties) {
        const createdProperty = await prisma.property.create({
            data: property,
        });
        createdProperties.push(createdProperty);
    }

    console.log('Created properties');

    // Create leases
    const now = new Date();
    const leases = [];

    // Active leases with different end dates for visualization
    leases.push(
        await prisma.lease.create({
            data: {
                propertyId: createdProperties[0].id,
                startDate: add(now, { months: -6 }),
                endDate: add(now, { months: 6 }),
                monthlyRent: 2500,
                tenantName: 'Hans Schmidt',
                tenantEmail: 'hans.schmidt@example.com',
                tenantPhone: '+49 30 12345678',
                isActive: true,
            },
        })
    );

    leases.push(
        await prisma.lease.create({
            data: {
                propertyId: createdProperties[1].id,
                startDate: add(now, { months: -3 }),
                endDate: add(now, { months: 9 }),
                monthlyRent: 3200,
                tenantName: 'Maria Weber',
                tenantEmail: 'maria.weber@example.com',
                tenantPhone: '+49 89 98765432',
                isActive: true,
            },
        })
    );

    leases.push(
        await prisma.lease.create({
            data: {
                propertyId: createdProperties[2].id,
                startDate: add(now, { months: -12 }),
                endDate: add(now, { days: 15 }),
                monthlyRent: 1800,
                tenantName: 'Thomas Müller',
                tenantEmail: 'thomas.mueller@example.com',
                tenantPhone: '+49 40 56789012',
                isActive: true,
            },
        })
    );

    leases.push(
        await prisma.lease.create({
            data: {
                propertyId: createdProperties[3].id,
                startDate: add(now, { months: -11 }),
                endDate: add(now, { days: 15 }), // Very soon to expire
                monthlyRent: 3000,
                tenantName: 'Anna Fischer',
                tenantEmail: 'anna.fischer@example.com',
                tenantPhone: '+49 211 34567890',
                isActive: true,
            },
        })
    );

    console.log('Created leases');

    // Create cash flows - 6 months of history
    const cashFlows = [];

    // Generate cash flows for each property
    for (const property of createdProperties) {
        const propertyId = property.id;
        const lease = leases.find(l => l.propertyId === propertyId);
        const monthlyRent = lease?.monthlyRent || 2000;

        // Generate 6 months of cash flows
        for (let i = 0; i < 6; i++) {
            const month = subMonths(now, 5 - i);

            // Generate rent income for each month
            cashFlows.push(
                await prisma.cashFlow.create({
                    data: {
                        propertyId,
                        amount: monthlyRent,
                        type: 'INCOME',
                        category: 'RENT',
                        date: new Date(month.getFullYear(), month.getMonth(), 5), // Rent paid on the 5th
                        note: `Monthly rent payment for ${format(month, 'MMMM yyyy')}`,
                    },
                })
            );

            // Random maintenance expense (50% chance each month)
            if (Math.random() > 0.5) {
                const maintenanceAmount = Math.floor(Math.random() * 300) + 100;
                cashFlows.push(
                    await prisma.cashFlow.create({
                        data: {
                            propertyId,
                            amount: maintenanceAmount,
                            type: 'EXPENSE',
                            category: 'MAINTENANCE',
                            date: new Date(month.getFullYear(), month.getMonth(), 15),
                            note: `General maintenance for ${format(month, 'MMMM yyyy')}`,
                        },
                    })
                );
            }

            // Utilities expense (each month)
            const utilitiesAmount = Math.floor(Math.random() * 100) + 150;
            cashFlows.push(
                await prisma.cashFlow.create({
                    data: {
                        propertyId,
                        amount: utilitiesAmount,
                        type: 'EXPENSE',
                        category: 'UTILITY',
                        date: new Date(month.getFullYear(), month.getMonth(), 20),
                        note: `Utilities for ${format(month, 'MMMM yyyy')}`,
                    },
                })
            );

            // Property tax (quarterly - months 0, 3)
            if (i % 3 === 0) {
                cashFlows.push(
                    await prisma.cashFlow.create({
                        data: {
                            propertyId,
                            amount: monthlyRent * 0.75,
                            type: 'EXPENSE',
                            category: 'TAX',
                            date: new Date(month.getFullYear(), month.getMonth(), 25),
                            note: `Quarterly property tax payment`,
                        },
                    })
                );
            }
        }
    }

    console.log(`Created ${cashFlows.length} cash flows`);

    // Create tickets with different priorities and statuses
    const tickets = [];

    // High priority - needs_manual_review
    tickets.push(
        await prisma.ticket.create({
            data: {
                propertyId: createdProperties[0].id,
                title: 'Water damage in bathroom',
                description: 'Ceiling in main bathroom is leaking water. Needs immediate attention.',
                priority: 'HIGH',
                status: 'needs_manual_review',
                metadata: JSON.stringify({
                    aiProcessed: true,
                    manualReviewReason: 'This issue requires on-site inspection by a plumber to assess damage extent.',
                    useAI: true,
                    generatedByAI: false
                })
            },
        })
    );

    // Medium priority - needs_manual_review
    tickets.push(
        await prisma.ticket.create({
            data: {
                propertyId: createdProperties[1].id,
                title: 'Dishwasher not draining',
                description: 'Dishwasher is not draining properly. Please schedule a repair.',
                priority: 'MEDIUM',
                status: 'needs_manual_review',
                metadata: JSON.stringify({
                    aiProcessed: true,
                    manualReviewReason: 'AI could not determine if this is a simple clog or mechanical failure.',
                    useAI: true,
                    generatedByAI: false
                })
            },
        })
    );

    // Low priority - resolved
    tickets.push(
        await prisma.ticket.create({
            data: {
                propertyId: createdProperties[2].id,
                title: 'Touch-up paint needed',
                description: 'Some scratches on the living room wall need paint touch-up.',
                priority: 'LOW',
                status: 'resolved',
                metadata: JSON.stringify({
                    aiProcessed: true,
                    aiResolution: 'Maintenance team has been scheduled to apply touch-up paint.',
                    aiActionTaken: 'Added to maintenance schedule for next week',
                    aiNotes: 'Resident will be home on Tuesday for the repair.',
                    useAI: true,
                    generatedByAI: false
                })
            },
        })
    );

    // Medium priority - resolved
    tickets.push(
        await prisma.ticket.create({
            data: {
                propertyId: createdProperties[3].id,
                title: 'HVAC filter replacement',
                description: 'Regular maintenance: HVAC filter needs to be replaced.',
                priority: 'MEDIUM',
                status: 'resolved',
                metadata: JSON.stringify({
                    aiProcessed: true,
                    aiResolution: 'Maintenance completed the filter replacement.',
                    aiActionTaken: 'Filter replaced and system tested',
                    aiNotes: 'Recommended 3-month replacement schedule added to calendar.',
                    useAI: true,
                    generatedByAI: false
                })
            },
        })
    );

    // Urgent priority - needs_manual_review
    tickets.push(
        await prisma.ticket.create({
            data: {
                propertyId: createdProperties[3].id,
                title: 'No hot water',
                description: 'Water heater possibly broken. No hot water in the unit.',
                priority: 'URGENT',
                status: 'needs_manual_review',
                metadata: JSON.stringify({
                    aiProcessed: true,
                    manualReviewReason: 'Critical issue requiring immediate professional assessment.',
                    useAI: true,
                    generatedByAI: false
                })
            },
        })
    );

    console.log(`Created ${tickets.length} tickets`);

    // Add some dummy user investments
    await prisma.$executeRaw`
      INSERT INTO Investment (investmentId, name, type, amount, expectedReturn, risk, date, createdAt, updatedAt)
      VALUES 
        ('inv-20230615-123', 'European REITs Index Fund', 'ETF', 12500, '7-9% annually', 'Medium', datetime('now', '-3 month'), datetime('now', '-3 month'), datetime('now', '-3 month')),
        ('inv-20230810-456', 'Government Bond Fund', 'Bond ETF', 20000, '3-5% annually', 'Low', datetime('now', '-2 month'), datetime('now', '-2 month'), datetime('now', '-2 month')),
        ('inv-20231122-789', 'Tech Growth ETF', 'Sector ETF', 7500, '10-14% annually', 'High', datetime('now', '-1 month'), datetime('now', '-1 month'), datetime('now', '-1 month'))
    `;

    console.log('Seed completed successfully!');
}

main()
    .catch((e) => {
        console.error('Error during seeding:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
import { PrismaClient } from '@prisma/client';
import { addDays, subMonths, subDays, format } from 'date-fns';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting seeding...');

    // Clear existing data
    await prisma.ticket.deleteMany();
    await prisma.cashFlow.deleteMany();
    await prisma.lease.deleteMany();
    await prisma.property.deleteMany();

    // Create properties
    const properties = await Promise.all([
        prisma.property.create({
            data: {
                address: '123 Main Street',
                city: 'San Francisco',
                state: 'CA',
                zipCode: '94105',
            },
        }),
        prisma.property.create({
            data: {
                address: '456 Oak Avenue',
                city: 'Los Angeles',
                state: 'CA',
                zipCode: '90001',
            },
        }),
        prisma.property.create({
            data: {
                address: '789 Pine Boulevard',
                city: 'San Diego',
                state: 'CA',
                zipCode: '92101',
            },
        }),
        prisma.property.create({
            data: {
                address: '101 Market Street',
                city: 'San Francisco',
                state: 'CA',
                zipCode: '94103',
            },
        }),
    ]);

    console.log(`Created ${properties.length} properties`);

    // Create leases
    const leases = [];

    // Active leases with different end dates for visualization
    leases.push(
        await prisma.lease.create({
            data: {
                propertyId: properties[0].id,
                startDate: subMonths(new Date(), 9),
                endDate: addDays(new Date(), 45), // Soon to expire
                monthlyRent: 2500,
                tenantName: 'John Smith',
                tenantEmail: 'john.smith@example.com',
                tenantPhone: '(415) 555-1234',
                isActive: true,
            },
        })
    );

    leases.push(
        await prisma.lease.create({
            data: {
                propertyId: properties[1].id,
                startDate: subMonths(new Date(), 6),
                endDate: addDays(new Date(), 90), // Expiring in 3 months
                monthlyRent: 1800,
                tenantName: 'Jane Doe',
                tenantEmail: 'jane.doe@example.com',
                tenantPhone: '(213) 555-5678',
                isActive: true,
            },
        })
    );

    leases.push(
        await prisma.lease.create({
            data: {
                propertyId: properties[2].id,
                startDate: subMonths(new Date(), 2),
                endDate: addDays(new Date(), 300), // Expiring in 10 months
                monthlyRent: 2200,
                tenantName: 'Robert Johnson',
                tenantEmail: 'robert.johnson@example.com',
                tenantPhone: '(619) 555-9012',
                isActive: true,
            },
        })
    );

    leases.push(
        await prisma.lease.create({
            data: {
                propertyId: properties[3].id,
                startDate: subMonths(new Date(), 11),
                endDate: addDays(new Date(), 15), // Very soon to expire
                monthlyRent: 3000,
                tenantName: 'Emily Wilson',
                tenantEmail: 'emily.wilson@example.com',
                tenantPhone: '(415) 555-3456',
                isActive: true,
            },
        })
    );

    console.log(`Created ${leases.length} leases`);

    // Create cash flows - 6 months of history
    const today = new Date();
    const cashFlows = [];

    // Generate cash flows for each property
    for (const property of properties) {
        const propertyId = property.id;
        const lease = leases.find(l => l.propertyId === propertyId);
        const monthlyRent = lease?.monthlyRent || 2000;

        // Generate 6 months of cash flows
        for (let i = 0; i < 6; i++) {
            const month = subMonths(today, 5 - i);

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

    // Urgent ticket - open
    tickets.push(
        await prisma.ticket.create({
            data: {
                propertyId: properties[0].id,
                title: 'Water Leak in Bathroom',
                description: 'Ceiling is leaking water in the main bathroom. Needs immediate attention.',
                priority: 'HIGH',
                status: 'OPEN',
            },
        })
    );

    // Medium priority - open
    tickets.push(
        await prisma.ticket.create({
            data: {
                propertyId: properties[1].id,
                title: 'Broken Dishwasher',
                description: 'Dishwasher not draining properly. Please schedule a repair.',
                priority: 'MEDIUM',
                status: 'OPEN',
            },
        })
    );

    // Low priority - open
    tickets.push(
        await prisma.ticket.create({
            data: {
                propertyId: properties[2].id,
                title: 'Paint Touch-up Needed',
                description: 'Some scuff marks on the living room wall need touch-up paint.',
                priority: 'LOW',
                status: 'OPEN',
            },
        })
    );

    // Closed ticket
    tickets.push(
        await prisma.ticket.create({
            data: {
                propertyId: properties[3].id,
                title: 'Replace HVAC Filter',
                description: 'Regular maintenance: Need to replace the HVAC filter.',
                priority: 'MEDIUM',
                status: 'CLOSED',
            },
        })
    );

    // Urgent ticket - open
    tickets.push(
        await prisma.ticket.create({
            data: {
                propertyId: properties[3].id,
                title: 'No Hot Water',
                description: 'Water heater may be broken. No hot water in the unit.',
                priority: 'URGENT',
                status: 'OPEN',
            },
        })
    );

    console.log(`Created ${tickets.length} tickets`);

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
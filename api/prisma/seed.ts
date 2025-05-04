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
    const properties = await Promise.all([
        prisma.property.create({
            data: {
                address: '123 Main St',
                city: 'New York',
                state: 'NY',
                zipCode: '10001',
            },
        }),
        prisma.property.create({
            data: {
                address: '456 Park Ave',
                city: 'Los Angeles',
                state: 'CA',
                zipCode: '90001',
            },
        }),
        prisma.property.create({
            data: {
                address: '789 Oak Dr',
                city: 'Chicago',
                state: 'IL',
                zipCode: '60007',
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

    console.log('Created properties');

    // Create leases
    const now = new Date();
    const leases = [];

    // Active leases with different end dates for visualization
    leases.push(
        await prisma.lease.create({
            data: {
                propertyId: properties[0].id,
                startDate: add(now, { months: -6 }),
                endDate: add(now, { months: 6 }),
                monthlyRent: 2500,
                tenantName: 'John Smith',
                tenantEmail: 'john@example.com',
                tenantPhone: '555-123-4567',
                isActive: true,
            },
        })
    );

    leases.push(
        await prisma.lease.create({
            data: {
                propertyId: properties[1].id,
                startDate: add(now, { months: -3 }),
                endDate: add(now, { months: 9 }),
                monthlyRent: 3200,
                tenantName: 'Sarah Johnson',
                tenantEmail: 'sarah@example.com',
                tenantPhone: '555-987-6543',
                isActive: true,
            },
        })
    );

    leases.push(
        await prisma.lease.create({
            data: {
                propertyId: properties[2].id,
                startDate: add(now, { months: -12 }),
                endDate: add(now, { days: 15 }),
                monthlyRent: 1800,
                tenantName: 'Michael Brown',
                tenantEmail: 'michael@example.com',
                tenantPhone: '555-567-8901',
                isActive: true,
            },
        })
    );

    leases.push(
        await prisma.lease.create({
            data: {
                propertyId: properties[3].id,
                startDate: add(now, { months: -11 }),
                endDate: add(now, { days: 15 }), // Very soon to expire
                monthlyRent: 3000,
                tenantName: 'Emily Wilson',
                tenantEmail: 'emily.wilson@example.com',
                tenantPhone: '(415) 555-3456',
                isActive: true,
            },
        })
    );

    console.log('Created leases');

    // Create cash flows - 6 months of history
    const cashFlows = [];

    // Generate cash flows for each property
    for (const property of properties) {
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
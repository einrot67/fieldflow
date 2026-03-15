import { PrismaClient, JobStatus, Priority, UserRole, Plan } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')

  // Create demo company
  const company = await prisma.company.create({
    data: {
      name: 'Demo HVAC Services',
      slug: 'demo-hvac',
      email: 'demo@fieldflow.app',
      phone: '(555) 123-4567',
      address: '123 Main Street',
      city: 'Austin',
      state: 'TX',
      zipCode: '78701',
      plan: Plan.TRIAL,
      trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
    },
  })

  console.log(`Created company: ${company.name}`)

  // Create admin user
  const hashedPassword = await bcrypt.hash('demo123', 10)
  const admin = await prisma.user.create({
    data: {
      name: 'Demo Admin',
      email: 'admin@demo.com',
      password: hashedPassword,
      role: UserRole.OWNER,
      companyId: company.id,
    },
  })

  console.log(`Created admin: ${admin.email} (password: demo123)`)

  // Create technicians
  const technicians = await Promise.all([
    prisma.technician.create({
      data: {
        firstName: 'Mike',
        lastName: 'Johnson',
        email: 'mike@demo.com',
        phone: '(555) 111-1111',
        color: '#3b82f6',
        companyId: company.id,
        skills: {
          create: [{ skill: 'HVAC' }, { skill: 'Electrical' }],
        },
      },
    }),
    prisma.technician.create({
      data: {
        firstName: 'Sarah',
        lastName: 'Williams',
        email: 'sarah@demo.com',
        phone: '(555) 222-2222',
        color: '#10b981',
        companyId: company.id,
        skills: {
          create: [{ skill: 'Plumbing' }, { skill: 'HVAC' }],
        },
      },
    }),
    prisma.technician.create({
      data: {
        firstName: 'David',
        lastName: 'Chen',
        email: 'david@demo.com',
        phone: '(555) 333-3333',
        color: '#f59e0b',
        companyId: company.id,
        skills: {
          create: [{ skill: 'Electrical' }],
        },
      },
    }),
  ])

  console.log(`Created ${technicians.length} technicians`)

  // Create services
  const services = await Promise.all([
    prisma.service.create({
      data: {
        name: 'AC Tune-Up',
        description: 'Complete air conditioning maintenance and inspection',
        basePrice: 129.99,
        duration: 90,
        companyId: company.id,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Furnace Repair',
        description: 'Diagnosis and repair of furnace issues',
        basePrice: 199.99,
        duration: 120,
        companyId: company.id,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Emergency Plumbing',
        description: '24/7 emergency plumbing services',
        basePrice: 250.00,
        duration: 60,
        companyId: company.id,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Electrical Panel Upgrade',
        description: 'Upgrade electrical panel to 200A',
        basePrice: 1500.00,
        duration: 480,
        companyId: company.id,
      },
    }),
  ])

  console.log(`Created ${services.length} services`)

  // Create equipment types
  const equipmentTypes = await Promise.all([
    prisma.equipmentType.create({
      data: {
        name: 'Central Air Conditioner',
        category: 'HVAC',
        companyId: company.id,
      },
    }),
    prisma.equipmentType.create({
      data: {
        name: 'Gas Furnace',
        category: 'HVAC',
        companyId: company.id,
      },
    }),
    prisma.equipmentType.create({
      data: {
        name: 'Heat Pump',
        category: 'HVAC',
        companyId: company.id,
      },
    }),
    prisma.equipmentType.create({
      data: {
        name: 'Water Heater',
        category: 'Plumbing',
        companyId: company.id,
      },
    }),
  ])

  console.log(`Created ${equipmentTypes.length} equipment types`)

  // Create sample customers with equipment
  const customers = await Promise.all([
    prisma.customer.create({
      data: {
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@email.com',
        phone: '(555) 444-4444',
        address: '456 Oak Avenue',
        city: 'Austin',
        state: 'TX',
        zipCode: '78702',
        companyId: company.id,
        equipment: {
          create: [
            {
              nickname: 'Living Room AC',
              equipmentTypeId: equipmentTypes[0].id,
              installDate: new Date('2020-05-15'),
              nextServiceDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            },
          ],
        },
      },
    }),
    prisma.customer.create({
      data: {
        firstName: 'Emily',
        lastName: 'Davis',
        email: 'emily.davis@email.com',
        phone: '(555) 555-5555',
        address: '789 Pine Street',
        city: 'Austin',
        state: 'TX',
        zipCode: '78703',
        companyId: company.id,
        equipment: {
          create: [
            {
              nickname: 'Main Furnace',
              equipmentTypeId: equipmentTypes[1].id,
              installDate: new Date('2019-11-20'),
              lastServiceDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
              nextServiceDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
            },
          ],
        },
      },
    }),
    prisma.customer.create({
      data: {
        firstName: 'Robert',
        lastName: 'Wilson',
        email: 'robert.wilson@email.com',
        phone: '(555) 666-6666',
        address: '321 Elm Drive',
        city: 'Austin',
        state: 'TX',
        zipCode: '78704',
        companyId: company.id,
        equipment: {
          create: [
            {
              equipmentTypeId: equipmentTypes[2].id,
              installDate: new Date('2021-03-10'),
            },
            {
              nickname: 'Kitchen Water Heater',
              equipmentTypeId: equipmentTypes[3].id,
              installDate: new Date('2018-08-05'),
              nextServiceDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
            },
          ],
        },
      },
    }),
  ])

  console.log(`Created ${customers.length} customers`)

  // Create sample jobs
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(9, 0, 0, 0)

  const nextWeek = new Date()
  nextWeek.setDate(nextWeek.getDate() + 7)
  nextWeek.setHours(10, 0, 0, 0)

  const jobs = await Promise.all([
    prisma.job.create({
      data: {
        jobNumber: 'JOB-2024-0001',
        title: 'AC Not Cooling',
        description: 'Customer reports AC blowing warm air',
        status: JobStatus.SCHEDULED,
        priority: Priority.HIGH,
        scheduledDate: tomorrow,
        startTime: tomorrow,
        estimatedHours: 2,
        companyId: company.id,
        customerId: customers[0].id,
        assignedToId: admin.id,
        notes: 'Check refrigerant levels',
      },
    }),
    prisma.job.create({
      data: {
        jobNumber: 'JOB-2024-0002',
        title: 'Annual Furnace Maintenance',
        description: 'Routine maintenance and inspection',
        status: JobStatus.PENDING,
        priority: Priority.MEDIUM,
        scheduledDate: nextWeek,
        startTime: nextWeek,
        estimatedHours: 1.5,
        companyId: company.id,
        customerId: customers[1].id,
        assignedToId: admin.id,
      },
    }),
    prisma.job.create({
      data: {
        jobNumber: 'JOB-2024-0003',
        title: 'Water Heater Leaking',
        description: 'Emergency repair needed',
        status: JobStatus.COMPLETED,
        priority: Priority.URGENT,
        scheduledDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        startTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        endTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
        estimatedHours: 2,
        actualHours: 2.5,
        laborCost: 250.00,
        partsCost: 150.00,
        totalCost: 400.00,
        companyId: company.id,
        customerId: customers[2].id,
        assignedToId: admin.id,
      },
    }),
  ])

  console.log(`Created ${jobs.length} jobs`)

  console.log('Seeding completed!')
  console.log('\nDemo Login:')
  console.log('Email: admin@demo.com')
  console.log('Password: demo123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
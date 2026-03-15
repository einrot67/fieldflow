import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.companyId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const status = searchParams.get('status')

    const jobs = await prisma.job.findMany({
      where: {
        companyId: session.user.companyId,
        ...(status && { status }),
      },
      include: {
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        technicians: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        _count: {
          select: {
            services: true,
            equipment: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })

    return NextResponse.json({ success: true, data: jobs })
  } catch (error) {
    console.error('GET /api/jobs error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch jobs' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.companyId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()

    // Get job count for generating job number
    const jobCount = await prisma.job.count({
      where: { companyId: session.user.companyId },
    })

    const jobNumber = `JOB-${new Date().getFullYear()}-${String(jobCount + 1).padStart(4, '0')}`

    const job = await prisma.job.create({
      data: {
        jobNumber,
        title: body.title,
        description: body.description,
        status: body.status || 'PENDING',
        priority: body.priority || 'MEDIUM',
        scheduledDate: body.scheduledDate ? new Date(body.scheduledDate) : null,
        startTime: body.startTime ? new Date(body.startTime) : null,
        endTime: body.endTime ? new Date(body.endTime) : null,
        estimatedHours: body.estimatedHours,
        notes: body.notes,
        internalNotes: body.internalNotes,
        companyId: session.user.companyId,
        customerId: body.customerId,
        assignedToId: body.assignedToId,
        technicians: body.technicianIds
          ? {
              connect: body.technicianIds.map((id: string) => ({ id })),
            }
          : undefined,
      },
      include: {
        customer: true,
        assignedTo: true,
        technicians: true,
      },
    })

    // Create activity log
    await prisma.activity.create({
      data: {
        action: 'job_created',
        description: `Job "${job.title}" created`,
        jobId: job.id,
        userId: session.user.id,
      },
    })

    return NextResponse.json({ success: true, data: job })
  } catch (error) {
    console.error('POST /api/jobs error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create job' },
      { status: 500 }
    )
  }
}

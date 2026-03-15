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
    const date = searchParams.get('date')

    const startOfDay = date ? new Date(date) : new Date()
    startOfDay.setHours(0, 0, 0, 0)

    const endOfDay = new Date(startOfDay)
    endOfDay.setHours(23, 59, 59, 999)

    const jobs = await prisma.job.findMany({
      where: {
        companyId: session.user.companyId,
        scheduledDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        customer: true,
        technicians: true,
        assignedTo: true,
      },
      orderBy: { startTime: 'asc' },
    })

    return NextResponse.json({ success: true, data: jobs })
  } catch (error) {
    console.error('GET /api/schedule error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch schedule' },
      { status: 500 }
    )
  }
}

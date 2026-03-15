import { JobStatus, Priority, InvoiceStatus, PaymentMethod, UserRole } from '@prisma/client'

// User Types
export interface User {
  id: string
  name: string | null
  email: string
  role: UserRole
  companyId: string | null
}

// Company Types
export interface Company {
  id: string
  name: string
  slug: string
  email: string
  phone: string | null
  address: string | null
  city: string | null
  state: string | null
  zipCode: string | null
  logo: string | null
  plan: string
  isActive: boolean
}

// Customer Types
export interface Customer {
  id: string
  firstName: string
  lastName: string
  email: string | null
  phone: string
  phone2: string | null
  address: string
  city: string
  state: string
  zipCode: string
  notes: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
  fullName: string // Computed
}

// Technician Types
export interface Technician {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  color: string
  isActive: boolean
  skills: string[]
  fullName: string // Computed
}

// Job Types
export interface Job {
  id: string
  jobNumber: string
  title: string
  description: string | null
  status: JobStatus
  priority: Priority
  scheduledDate: string | null
  startTime: string | null
  endTime: string | null
  estimatedHours: number | null
  actualHours: number | null
  laborCost: number | null
  partsCost: number | null
  totalCost: number | null
  notes: string | null
  internalNotes: string | null
  createdAt: string
  updatedAt: string
  
  // Relations
  customer: Customer
  customerId: string
  assignedTo: User | null
  assignedToId: string | null
  technicians: Technician[]
  services: JobService[]
  equipment: JobEquipment[]
}

export interface JobService {
  id: string
  serviceId: string
  service: Service
  quantity: number
  unitPrice: number
  totalPrice: number
  notes: string | null
}

export interface JobEquipment {
  id: string
  equipmentId: string
  equipment: Equipment
  notes: string | null
}

// Service Types
export interface Service {
  id: string
  name: string
  description: string | null
  basePrice: number
  duration: number
  isActive: boolean
}

// Equipment Types
export interface EquipmentType {
  id: string
  name: string
  brand: string | null
  model: string | null
  category: string
}

export interface Equipment {
  id: string
  nickname: string | null
  serialNumber: string | null
  installDate: string | null
  warrantyExpires: string | null
  lastServiceDate: string | null
  nextServiceDate: string | null
  notes: string | null
  equipmentType: EquipmentType
}

// Invoice Types
export interface Invoice {
  id: string
  invoiceNumber: string
  status: InvoiceStatus
  issueDate: string
  dueDate: string
  subtotal: number
  taxRate: number | null
  taxAmount: number | null
  total: number
  amountPaid: number
  balanceDue: number // Computed
  notes: string | null
  terms: string | null
  
  customer: Customer
  job: Job
  lineItems: InvoiceLineItem[]
  payments: Payment[]
}

export interface InvoiceLineItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  total: number
}

export interface Payment {
  id: string
  amount: number
  method: PaymentMethod
  reference: string | null
  notes: string | null
  paidAt: string
}

// Dashboard Types
export interface DashboardStats {
  totalJobs: number
  jobsThisWeek: number
  pendingJobs: number
  completedJobs: number
  totalRevenue: number
  revenueThisMonth: number
  outstandingInvoices: number
  upcomingJobs: Job[]
  recentActivity: Activity[]
}

export interface Activity {
  id: string
  action: string
  description: string
  metadata: Record<string, any> | null
  createdAt: string
  user: User | null
  job: Job | null
}

// Form Types
export interface CreateJobInput {
  title: string
  description?: string
  customerId: string
  status?: JobStatus
  priority?: Priority
  scheduledDate?: Date
  startTime?: Date
  endTime?: Date
  estimatedHours?: number
  assignedToId?: string
  technicianIds?: string[]
  serviceIds?: { id: string; quantity: number }[]
  equipmentIds?: string[]
  notes?: string
  internalNotes?: string
}

export interface CreateCustomerInput {
  firstName: string
  lastName: string
  email?: string
  phone: string
  phone2?: string
  address: string
  city: string
  state: string
  zipCode: string
  notes?: string
}

export interface CreateInvoiceInput {
  jobId: string
  issueDate: Date
  dueDate: Date
  lineItems: {
    description: string
    quantity: number
    unitPrice: number
  }[]
  taxRate?: number
  notes?: string
  terms?: string
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

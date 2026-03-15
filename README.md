# FieldFlow

**AI-First Field Service Management for HVAC, Plumbing & Electrical Contractors**

FieldFlow is a modern, AI-powered alternative to expensive legacy platforms like ServiceTitan and basic tools like Jobber. Built specifically for trades contractors with 2-15 technicians who need intelligent dispatch, voice AI scheduling, and modern mobile experiences.

## 🚀 Key Features

### Core Platform
- **Job Management** - Create, schedule, and track jobs from quote to invoice
- **Customer CRM** - Complete customer history, equipment records, and communication
- **Technician Dispatch** - Smart scheduling with route optimization
- **Mobile-First** - Native-app experience for field technicians
- **Invoicing & Payments** - Generate invoices and accept payments in the field

### AI-Powered Features
- **Voice AI Scheduling** - Customers can call and book appointments via AI assistant
- **Smart Dispatch** - AI recommends the best technician based on skills, location, and availability
- **Predictive Maintenance** - Alert customers before equipment fails
- **Automated Follow-ups** - AI handles review requests and rebooking

## 💰 Pricing Model

| Plan | Price | Best For |
|------|-------|----------|
| Starter | $49/mo | 1-2 techs, basic scheduling |
| Growth | $99/mo | 3-8 techs, full features |
| Pro | $199/mo | 9-15 techs, AI features |

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma
- **Auth**: NextAuth.js
- **AI/Voice**: Vapi.ai integration
- **Deployment**: Vercel

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database (Neon recommended)
- Vapi.ai account (for voice features)

### Installation

```bash
# Clone the repository
git clone https://github.com/einrot67/fieldflow.git
cd fieldflow

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Set up database
npx prisma generate
npx prisma db push
npx prisma db seed

# Run development server
npm run dev
```

Visit `http://localhost:3000` to see the application.

### Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"

# NextAuth
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Vapi AI
VAPI_API_KEY="your-vapi-api-key"
VAPI_ASSISTANT_ID="your-assistant-id"
VAPI_PHONE_NUMBER_ID="your-phone-number-id"

# App Config
APP_URL="http://localhost:3000"
APP_NAME="FieldFlow"
```

## 📁 Project Structure

```
fieldflow/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (dashboard)/        # Dashboard layout
│   │   ├── api/                # API routes
│   │   └── auth/               # Auth pages
│   ├── components/             # React components
│   ├── lib/                    # Utilities, configs
│   └── types/                  # TypeScript types
├── prisma/                     # Database schema
├── public/                     # Static assets
└── docs/                       # Documentation
```

## 🎯 Target Market

- **Primary**: HVAC contractors (2-15 techs)
- **Secondary**: Plumbing & electrical contractors
- **Tertiary**: Other field service businesses

**Market Size**: 118,000+ HVAC businesses in the US alone, with 64% still using paper/spreadsheets.

## 📊 Business Model

- **B2B SaaS** - Monthly subscriptions
- **Transaction Fees** - Payment processing (2.9% + $0.30)
- **Add-ons** - SMS credits, additional phone numbers

**Target Metrics**:
- 1,000 customers × $100/month = $1.2M ARR
- CAC: $500 (industry shows, referrals)
- LTV: $3,600 (36-month retention)
- LTV:CAC Ratio: 7.2:1

## 🛣 Roadmap

### MVP (Now)
- [x] Job scheduling & dispatch
- [x] Customer CRM
- [x] Mobile technician app
- [x] Basic invoicing

### Phase 2 (Month 2)
- [ ] Vapi voice AI integration
- [ ] Route optimization
- [ ] Customer portal
- [ ] QuickBooks integration

### Phase 3 (Month 3)
- [ ] Predictive maintenance AI
- [ ] Inventory management
- [ ] Marketing automation
- [ ] Mobile app (React Native)

## 🤝 Contributing

This is a private project. Contact the owner for access.

## 📄 License

MIT License - See [LICENSE](LICENSE) for details.

---

Built with ❤️ for the trades.
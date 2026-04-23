# 🌸 BloomCRM - Property Dealer CRM System

A comprehensive, full-stack CRM system designed specifically for property dealers in Pakistan. BloomCRM helps real estate agents manage leads efficiently, track activities, and close more deals.

## 🎨 Design Philosophy

**BloomCRM** is built around a **nature-inspired color palette** featuring:
- 🟢 **Primary Green** (#22c55e) - Growth, renewal, prosperity
- ⚪ **White** (#ffffff) - Clarity, simplicity
- 🌼 **Flower Colors** - Soft accents for natural beauty

The theme reflects the growth journey of properties and leads "blooming" into successful transactions.

## 🏗️ Architecture Overview

```
BloomCRM (Property Dealer CRM)
├── Frontend (Next.js 15 + React 19)
│   ├── Authentication Pages (Signup/Login)
│   ├── Admin Dashboard (Analytics & Insights)
│   ├── Agent Dashboard (Lead Management)
│   └── Lead Management Pages
├── Backend (Next.js API Routes)
│   ├── Authentication Endpoints
│   ├── Lead CRUD Operations
│   ├── Agent Management
│   └── Analytics Endpoints
├── Database (MongoDB with Mongoose)
│   ├── User Schema (Admin/Agent roles)
│   ├── Lead Schema (with auto-scoring)
│   ├── Activity Schema (audit trail)
│   └── Followup Schema (smart reminders)
└── Integrations
    ├── Email Notifications (Nodemailer)
    ├── WhatsApp Chat (Direct links)
    └── Real-time Updates (Socket.io)
```

## 📋 Core Features

### 1. **Authentication System** ✅
- Secure signup and login with password hashing (bcryptjs)
- JWT token-based session management
- Token verification and validation
- Role-based user types (Admin/Agent)

### 2. **Role-Based Access Control (RBAC)** ✅
- **Admin**: Full system access, analytics, lead assignment
- **Agent**: Limited access to assigned leads only
- Protected routes and endpoints
- Unauthorized access prevention

### 3. **Lead Management (CRUD)** ✅
- Create new leads with validation
- Read leads with filtering and pagination
- Update lead details, status, and notes
- Delete leads (admin only)
- Lead listing with search/filter capabilities

### 4. **Lead Scoring System** ✅
```
Budget-based Priority:
├── High Priority (Score 90): Budget > 20M PKR 🔴
├── Medium Priority (Score 70): 10M-20M PKR 🟡
└── Low Priority (Score 50): < 10M PKR 🟢
```

### 5. **Activity Timeline (Audit Trail)** ✅
- Comprehensive action logging
- Tracks: creation, assignment, status changes, notes
- User attribution for all actions
- Chronological timeline display

### 6. **Email Notifications & WhatsApp Integration** ✅
- Lead creation alerts
- Assignment notifications
- WhatsApp one-click contact
- Phone number formatting

### 7. **Analytics Dashboard** ✅
- Total leads count
- Lead distribution by status and priority
- Agent performance metrics
- Real-time analytics updates

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB instance
- Gmail account (for notifications)

### Installation

```bash
# Clone and setup
git clone <your-repo-url>
cd bloomcrm
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your settings

# Run development server
npm run dev

# Visit http://localhost:3000
```

### Build for Production
```bash
npm run build
npm start
```

## 🔐 Default Roles

1. **Admin Account**: Full system access
   - Create/assign/delete leads
   - View analytics
   - Manage agents

2. **Agent Account**: Limited access
   - View assigned leads only
   - Update lead status
   - Set follow-ups

## 📊 Database Models

### User Schema
```typescript
{
  name: string,
  email: string (unique),
  password: string (hashed),
  role: 'admin' | 'agent',
  createdAt, updatedAt
}
```

### Lead Schema
```typescript
{
  name: string,
  email: string,
  phone: string,
  propertyInterest: string,
  budget: number,
  status: enum,
  priority: 'high' | 'medium' | 'low',
  score: number (0-100),
  notes: string,
  assignedTo: ObjectId (User),
  nextFollowUp: Date,
  createdBy: ObjectId (User),
  createdAt, updatedAt
}
```

### Activity Schema
```typescript
{
  leadId: ObjectId (Lead),
  action: enum,
  performedBy: ObjectId (User),
  details: mixed,
  createdAt
}
```

## 🔌 API Endpoints

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | /api/auth/signup | ❌ | - | Create account |
| POST | /api/auth/login | ❌ | - | Login |
| GET | /api/auth/verify | ✅ | Any | Verify token |
| POST | /api/leads | ✅ | Any | Create lead |
| GET | /api/leads | ✅ | Any | List leads |
| GET | /api/leads/[id] | ✅ | Any | Get lead |
| PATCH | /api/leads/[id] | ✅ | Any | Update lead |
| DELETE | /api/leads/[id] | ✅ | Admin | Delete lead |
| POST | /api/leads/[id]/assign | ✅ | Admin | Assign lead |
| GET | /api/analytics | ✅ | Admin | Get analytics |
| GET | /api/agents | ✅ | Admin | List agents |

## 🌳 Git Branch Strategy

```
master (production)
├── feature/authentication
├── feature/role-based-access
├── feature/lead-management
├── feature/lead-scoring
├── feature/email-notifications
├── feature/whatsapp-integration
├── feature/activity-timeline
├── feature/followup-system
├── feature/analytics-dashboard
├── feature/ui-components
└── feature/real-time-updates
```

**Commits per feature**:
- Clear, descriptive commit messages
- Organized by functionality
- Regular commits showing progress
- Easy code review and tracking

## 📁 Project Structure

```
src/
├── app/api/          # API routes
├── app/dashboard/    # Dashboard pages
├── app/login/        # Auth pages
├── components/       # React components
├── lib/             # Utilities
├── middleware/      # Custom middleware
├── models/          # Mongoose schemas
└── styles/          # CSS/Tailwind
```

## 🎯 Key Technologies

- **Frontend**: Next.js 15, React 19, Tailwind CSS 4
- **Backend**: Node.js, Next.js API Routes
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT (jose), bcryptjs
- **Integrations**: Nodemailer, Socket.io
- **Validation**: Zod
- **Development**: TypeScript, ESLint

## 🔐 Security Features

- ✅ Password hashing (bcryptjs)
- ✅ JWT token verification
- ✅ Role-based access control
- ✅ Request validation (Zod schemas)
- ✅ Rate limiting (50 req/min for agents)
- ✅ CORS protection
- ✅ Secure session management

## 🎓 Educational Project

**Assignment**: Roll No 23I-0588

A Level 3 CRM system demonstrating:
- Full-stack development with modern tools
- Database design and optimization
- API development best practices
- Frontend/backend integration
- Real-world business logic
- Professional code organization

## 🤝 Contribution Workflow

1. Create feature branch from master
2. Make focused, meaningful commits
3. Write clear commit messages
4. Push to feature branch
5. Ready for code review

## 📝 Commit Message Format

```
feat(scope): description

Detailed explanation of what changed and why.

- Point 1
- Point 2
```

Example:
```
feat(authentication): implement JWT-based auth

- Add signup/login endpoints
- Implement password hashing with bcryptjs
- Add JWT token generation
- Add token verification middleware
```

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
# Follow prompts to deploy
```

### Environment Variables (Production)
```env
MONGODB_URI=your-production-mongodb-uri
NEXTAUTH_SECRET=your-production-secret
NEXTAUTH_URL=https://yourdomain.com
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

## 📞 Support

- 📧 Email: dev@bloomcrm.com
- 📚 Documentation: See `/docs`
- 🐛 Issues: GitHub Issues
- 💬 Discussions: GitHub Discussions

---

**Built with ❤️ using Next.js, MongoDB, and nature-inspired design**

*BloomCRM - Where Property Deals Bloom* 🌸

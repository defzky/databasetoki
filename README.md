# DatabaseToki - Multi-Tenant JSON Database for Vercel

**Your personal Supabase with JSON file storage. Perfect for serverless deployments.**

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

---

## 💡 What is DatabaseToki?

DatabaseToki is a **multi-tenant database service** that:
- Stores data in JSON files (serverless-friendly)
- Provides REST API for CRUD operations
- Isolates data per project
- Deploys on Vercel for free

**Use cases:**
- Personal projects
- Prototypes
- Small apps
- Development/testing

---

## 📖 API Documentation

### **Create Project**
```bash
POST /api/projects
Content-Type: application/json

{
  "name": "my-app",
  "description": "My awesome app"
}

# Response:
{
  "success": true,
  "project": {
    "id": "my-app-abc123",
    "name": "my-app",
    "apiKey": "dbtoki_live_xyz789"
  }
}
```

### **Insert Row**
```bash
POST /api/:project/:table
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json

{
  "email": "user@example.com",
  "name": "John"
}
```

### **Select Rows**
```bash
GET /api/:project/:table?eq.email=user@example.com
Authorization: Bearer YOUR_API_KEY
```

### **Update Row**
```bash
PATCH /api/:project/:table/:id
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json

{
  "name": "Jane"
}
```

### **Delete Row**
```bash
DELETE /api/:project/:table/:id
Authorization: Bearer YOUR_API_KEY
```

---

## 🗄️ Storage Structure

```
/databases/
├── my-app-abc123/
│   ├── users.json
│   ├── posts.json
│   └── _metadata.json
├── linkkamu-xyz789/
│   ├── pages.json
│   └── links.json
└── task-slayer-def456/
    ├── quests.json
    └── profiles.json
```

---

## 🔐 Security

- **API Key Authentication** - Required for all operations
- **Project Isolation** - Projects cannot access each other's data
- **Rate Limiting** - Prevents abuse
- **Input Validation** - Zod schemas

---

## 🚀 Deploy to Vercel

### **1. Push to GitHub**
```bash
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/defzky/databasetoki.git
git push -u origin main
```

### **2. Deploy on Vercel**
```bash
vercel deploy --prod
```

### **3. Enable Vercel Blob** (Optional)
For persistent storage, enable Vercel Blob in your project settings.

---

## 📊 Pricing

| Tier | Price | Projects | Storage |
|------|-------|----------|---------|
| Free | $0 | 1 | 100MB |
| Pro | $9/mo | 10 | 1GB |
| Business | $29/mo | Unlimited | 10GB |

---

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Storage:** JSON files / Vercel Blob
- **Deployment:** Vercel (Serverless)
- **Validation:** Zod
- **IDs:** UUID

---

## 📝 Integration Examples

### **Task Slayer**
```typescript
import { saveToTable, getFromTable } from '@/utils/databaseToki';

// Save data
await saveToTable('quests', { title: 'New Quest', xpReward: 50 });

// Get data
const quests = await getFromTable('quests');
```

### **LinkKamu**
```typescript
// Store link page
await saveToTable('pages', {
  title: 'My Links',
  links: [...]
});
```

---

## ⚠️ Limitations

- **Not for production** - JSON files don't scale
- **No ACID transactions** - File-based storage
- **Concurrent writes** - May have race conditions
- **Vercel limits** - Serverless function timeouts

**For production:** Migrate to Supabase, PlanetScale, or Neon.

---

## 🎯 Roadmap

### **v0.1.0 - MVP** ✅
- [x] Project CRUD
- [x] Table operations
- [x] API key auth
- [x] Landing page
- [ ] Task Slayer integration
- [ ] LinkKamu integration

### **v0.2.0 - Dashboard**
- [ ] Visual project manager
- [ ] Table viewer
- [ ] API key management

### **v0.3.0 - Advanced**
- [ ] Query filters (neq, gt, lt, like)
- [ ] Sorting & pagination
- [ ] Bulk operations

### **v0.4.0 - Monetization**
- [ ] Stripe integration
- [ ] Usage tracking
- [ ] Pro tier features

---

## 📄 License

MIT License - use for your own projects!

---

**Created by:** @defzky  
**Date:** 2026-04-16  
**Purpose:** Centralized database for all my projects

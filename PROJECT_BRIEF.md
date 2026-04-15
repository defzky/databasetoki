# DatabaseToki - Multi-Tenant JSON Database for Vercel

**Created:** 2026-04-16  
**Status:** 🚧 Planning  
**Deploy:** Vercel (Serverless)  
**Purpose:** Centralized database for all your projects

---

## 🎯 Concept

**DatabaseToki** = Supabase-lite but with **JSON file storage**

**Why?**
- You have multiple projects (Task Slayer, LinkKamu, etc.)
- Each needs a database
- Vercel serverless = no persistent database
- Solution: JSON files with multi-tenant isolation

---

## 🏗️ Architecture

```
┌─────────────────┐
│   Your Projects │
│ - Task Slayer   │
│ - LinkKamu      │
│ - Future apps   │
└────────┬────────┘
         │ HTTP API
         ↓
┌─────────────────┐
│  DatabaseToki   │
│  (Vercel)       │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  JSON Files     │
│ /databases/     │
│  - project-1/   │
│  - project-2/   │
│  - project-3/   │
└─────────────────┘
```

---

## 💰 Monetization

### **Free Tier**
- ✅ 1 project
- ✅ 100MB storage
- ✅ Basic API
- ✅ Community support

### **Pro Tier** - $9/month
- ✅ 10 projects
- ✅ 1GB storage
- ✅ Advanced queries
- ✅ Priority support

### **Business Tier** - $29/month
- ✅ Unlimited projects
- ✅ 10GB storage
- ✅ Custom domains
- ✅ SLA support

---

## 🛠️ Features

### **Core API**
```
POST   /api/projects          - Create new project
GET    /api/projects          - List all projects
GET    /api/projects/:id      - Get project info
DELETE /api/projects/:id      - Delete project

POST   /api/:project/:table   - Insert row
GET    /api/:project/:table   - Select rows
PATCH  /api/:project/:table/:id - Update row
DELETE /api/:project/:table/:id - Delete row
```

### **Storage Structure**
```
/databases/
├── task-slayer/
│   ├── users.json
│   ├── quests.json
│   └── profiles.json
├── linkkamu/
│   ├── pages.json
│   ├── links.json
│   └── analytics.json
└── new-project/
    └── *.json
```

---

## 🔐 Security

### **API Keys**
- Each project gets unique API key
- Key required for all operations
- Revocable at any time

### **Isolation**
- Projects cannot access each other's data
- File system sandboxing
- Rate limiting per project

### **Row-Level Security (RLS)**
```json
{
  "table": "quests",
  "policies": [
    {
      "name": "Users can only see their own quests",
      "filter": {
        "field": "user_id",
        "operator": "equals",
        "value": "{{auth.uid}}"
      }
    }
  ]
}
```

---

## 📁 Project Structure

```
databasetoki/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── projects/       # Project management
│   │   │   └── [project]/
│   │   │       └── [table]/    # Dynamic table API
│   │   ├── dashboard/          # Admin dashboard
│   │   └── page.tsx            # Landing page
│   ├── lib/
│   │   ├── database.ts         # JSON DB operations
│   │   ├── auth.ts             # API key validation
│   │   └── storage.ts          # File system ops
│   └── components/
├── databases/                  # JSON storage
├── vercel.json
└── package.json
```

---

## 🚀 Usage Example

### **1. Create Project**
```bash
curl -X POST https://databasetoki.vercel.app/api/projects \
  -H "Content-Type: application/json" \
  -d '{"name":"my-app","description":"My awesome app"}'

# Response:
{
  "id": "my-app-abc123",
  "apiKey": "dbtoki_live_xyz789",
  "storage": "/databases/my-app-abc123/"
}
```

### **2. Insert Data**
```bash
curl -X POST https://databasetoki.vercel.app/api/my-app-abc123/users \
  -H "Authorization: Bearer dbtoki_live_xyz789" \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","name":"John"}'
```

### **3. Query Data**
```bash
curl https://databasetoki.vercel.app/api/my-app-abc123/users?eq.email=user@example.com \
  -H "Authorization: Bearer dbtoki_live_xyz789"
```

---

## 💡 Integration with Your Projects

### **Task Slayer**
```typescript
// Instead of MockBase
const DB_URL = 'https://databasetoki.vercel.app';
const PROJECT_ID = 'task-slayer-xxx';
const API_KEY = 'dbtoki_live_xxx';

// Use DatabaseToki API
await fetch(`${DB_URL}/api/${PROJECT_ID}/quests`, {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${API_KEY}` },
  body: JSON.stringify(quest)
});
```

### **LinkKamu**
```typescript
const DB_URL = 'https://databasetoki.vercel.app';
const PROJECT_ID = 'linkkamu-yyy';
const API_KEY = 'dbtoki_live_yyy';

// Store link pages
await fetch(`${DB_URL}/api/${PROJECT_ID}/pages`, { ... });
```

---

## 📊 Vercel Deployment

### **Storage Options:**

#### **Option 1: Vercel Blob** (Recommended)
```typescript
import { blob } from '@vercel/blob';

await blob.put('databases/project-1/users.json', data);
```

**Cost:** $20/month for 100GB

#### **Option 2: GitHub as Database**
```typescript
// Store JSON in GitHub repo
await octokit.repos.createOrUpdateFileContents({
  owner: 'defzky',
  repo: 'databasetoki-data',
  path: 'databases/project-1/users.json',
  content: JSON.stringify(data)
});
```

**Cost:** Free (GitHub API limits)

#### **Option 3: External Storage**
- Cloudflare R2 (cheaper than S3)
- AWS S3
- Google Cloud Storage

---

## 🎯 Why This Works

### **For You:**
- ✅ One database for all projects
- ✅ Easy to manage
- ✅ Consistent API
- ✅ Can migrate to real DB later

### **For Vercel:**
- ✅ Serverless-friendly
- ✅ No database server needed
- ✅ Scales automatically
- ✅ Cheap to run

### **For Monetization:**
- ✅ Charge per project
- ✅ Charge per storage
- ✅ Charge per API calls
- ✅ Upsell to managed hosting

---

## 📝 Next Steps

1. **Build Core API** - Project CRUD + table operations
2. **Add Authentication** - API key system
3. **Setup Storage** - Vercel Blob or GitHub
4. **Create Dashboard** - Manage projects visually
5. **Deploy to Vercel** - Free tier to start
6. **Integrate Projects** - Task Slayer, LinkKamu

---

**Estimated Build Time:** 1-2 weeks for MVP  
**Monthly Cost:** $0-20 (Vercel Blob)  
**Break-even:** 3 Pro users ($27/month)

---

**Ready to build your own Supabase?** 🚀

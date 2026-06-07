# MongoDB Atlas Setup (Free Tier)

MongoDB Atlas is a free cloud database service. Follow these steps to get your connection string:

## Step 1: Create Account
1. Go to: https://www.mongodb.com/cloud/atlas
2. Click "Try Free"
3. Sign up with email or Google/GitHub
4. Create organization and project (defaults are fine)

## Step 2: Create Cluster
1. Click "Create a Deployment"
2. Select **M0 (Free)** tier
3. Choose region closest to you
4. Click "Create Deployment"
5. Wait 3-5 minutes for cluster to initialize

## Step 3: Add Database User
1. Click "Security" → "Quick Start" (or "Database Access")
2. Click "Add New Database User"
3. Create username: `cyber_user`
4. Create password: `your_secure_password` (remember this!)
5. Click "Add User"

## Step 4: Add IP Whitelist
1. Go to "Network Access"
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for development)
4. Click "Confirm"

## Step 5: Get Connection String
1. Click "Database" → "Clusters"
2. Click "Connect" button
3. Click "Drivers" 
4. Select Node.js and copy the connection string
5. It will look like: mongodb+srv://<USERNAME>:<PASSWORD>@cluster.mongodb.net/database

## Step 6: Update .env File
Edit `backend/.env` and update MONGODB_URI:

```env
MONGODB_URI=your_mongodb_connection_string
```

Replace:
- `cyber_user` with your username
- `your_password` with your password
- `cluster0.xxxxx.mongodb.net` with your connection string

## Step 7: Run System

The system will automatically create the database and collections on first run!

```bash
cd backend
npm install
npm start

# In another terminal:
cd frontend
npm install
npm start
```

## Troubleshooting

**Connection Failed?**
- Check username/password in connection string
- Verify IP is whitelisted (Network Access)
- Try "Allow Access from Anywhere" for testing

**Database Not Created?**
- It creates automatically on first write
- Check backend logs for connection status

**Slow First Query?**
- Atlas free tier can be slow on first query
- Normal after that

## MongoDB Atlas Features (Free Tier)
- ✅ 512 MB storage
- ✅ 100,000 operations/day
- ✅ Full MongoDB features
- ✅ No credit card (optional notifications only)
- ✅ Backups
- ✅ Monitoring

Plenty for development and testing!

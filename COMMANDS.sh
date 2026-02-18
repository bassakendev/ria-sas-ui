#!/bin/bash
# RIA SaaS Frontend - Quick Commands

# Development
npm run dev              # Start development server on http://localhost:3000
npm run build            # Build for production
npm start                # Start production server

# Code Quality
npm run lint             # Run ESLint
npm run type-check       # Check TypeScript types (if available)

# Packages
npm install              # Install dependencies
npm update               # Update dependencies
npm audit                # Check for vulnerabilities

# Database/Cache (if needed)
# npm prune               # Remove unused dependencies

# Common Issues & Solutions

# Issue: Build fails with TypeScript errors
# Solution: npm install --legacy-peer-deps

# Issue: Port 3000 already in use
# Solution: npm run dev -- -p 3001

# Issue: Module not found errors
# Solution: 
# 1. npm install
# 2. Delete node_modules
# 3. npm install again

# Issue: .env not working
# Solution:
# 1. Check filename is .env.local (not .env)
# 2. Restart dev server after changing .env.local
# 3. Ensure variable starts with NEXT_PUBLIC_ for client-side

# Issue: API connection errors
# Solution:
# 1. Verify backend is running
# 2. Check NEXT_PUBLIC_API_URL in .env.local
# 3. Check CORS configuration on backend
# 4. Open DevTools Network tab to see requests

# Issue: 401 errors on protected pages
# Solution:
# 1. Clear localStorage (Ctrl/Cmd + Shift + Delete)
# 2. Login again
# 3. Check that login endpoint returns valid token

# Useful URLs

Development:       http://localhost:3000
Public Pages:      http://localhost:3000
                   http://localhost:3000/login
                   http://localhost:3000/register
                   http://localhost:3000/pricing

Test Routes (after login):
Dashboard:         http://localhost:3000/dashboard
Clients:           http://localhost:3000/clients
Services:          http://localhost:3000/services
Invoices:          http://localhost:3000/invoices

# Environment Template

# .env.local template:
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# For production:
NEXT_PUBLIC_API_URL=https://api.your-domain.com/api

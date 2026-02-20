@echo off
cd backend
npx prisma migrate dev --name webflow_editor
npx prisma generate

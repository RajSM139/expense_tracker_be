# 🚀 Deployment Guide

## 1. Prepare Environment
- Ensure all environment variables are set (see [Setup Guide](./setup.md))
- Use production-ready Firebase and Firestore credentials

## 2. Build the Project
```bash
npm run build
```
- Output will be in the `dist/` folder

## 3. Deploy to Cloud
You can deploy the backend to any Node.js-compatible platform. Here are some options:

### Google Cloud Platform (GCP)
- Use App Engine, Cloud Run, or Compute Engine
- Set environment variables in your deployment config
- Follow [GCP Node.js deployment docs](https://cloud.google.com/nodejs/docs)

### Vercel / Heroku / Render
- Connect your GitHub repo
- Set environment variables in the dashboard
- Use the default `npm run start:prod` command

---

## 4. Post-Deployment
- Verify the API is running (e.g., `/health` endpoint)
- Check Swagger docs at `/docs`
- Monitor logs and errors

---

> For advanced deployment (Docker, CI/CD), update this doc as your workflow evolves. 
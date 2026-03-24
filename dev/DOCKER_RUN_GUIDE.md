# NurtureJoy Docker Run Guide (Neon Database)

## 1. Open terminal in the `dev` folder
```bash
cd dev
```

## 2. Create your environment file
Copy `.env.example` to `.env` and paste your Neon PostgreSQL connection string.

### Windows PowerShell
```powershell
copy .env.example .env
```

### macOS / Linux
```bash
cp .env.example .env
```

Then open `.env` and replace the placeholders with your real Neon `DATABASE_URL` and a stable `SECRET_KEY`.

Example:
```env
DATABASE_URL=postgresql://user:password@ep-example.us-east-1.aws.neon.tech/nurturejoy?sslmode=require
SECRET_KEY=use-a-long-random-secret-value-here
```

`SECRET_KEY` keeps login sessions stable across backend restarts.

## 3. Start Docker Desktop
Make sure Docker Desktop is running before building.

## 4. Build and start the containers
```bash
docker compose up --build
```

## 5. Open the app
- Frontend: http://localhost:3000
- Backend health route: http://localhost:5000

## 6. Stop containers
```bash
docker compose down
```

## 7. Rebuild after code changes
```bash
docker compose up --build
```

## 8. Push images to Docker Hub
Replace `YOUR_DOCKERHUB_USERNAME` with your Docker Hub username.

```bash
docker tag nurturejoy-frontend YOUR_DOCKERHUB_USERNAME/nurturejoy-frontend:latest
docker tag nurturejoy-backend YOUR_DOCKERHUB_USERNAME/nurturejoy-backend:latest

docker login
docker push YOUR_DOCKERHUB_USERNAME/nurturejoy-frontend:latest
docker push YOUR_DOCKERHUB_USERNAME/nurturejoy-backend:latest
```

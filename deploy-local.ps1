Write-Host "Pulling latest image from Docker Hub..."

docker compose -f docker-compose-prod.yaml pull

Write-Host "Restarting production containers..."

docker compose -f docker-compose-prod.yaml up -d

Write-Host "Checking container status..."

docker compose -f docker-compose-prod.yaml ps
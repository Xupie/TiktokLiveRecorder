.PHONY: build

up:
	docker-compose up -d

up-prod:
	make build
	docker-compose -f docker-compose.yaml up --build -d tiktok-live-recorder

down:
	docker-compose down

build:
	npm run build

run: 
	docker-compose up --build -d

debug: 
	docker-compose up --build

up: 
	docker-compose up -d

down: 
	docker-compose down

build: 
	docker-compose build

ps: 
	docker-compose ps

dclean:
	docker ps -q -a | xargs docker rm -f

re: down run

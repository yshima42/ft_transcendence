run: 
	docker-compose up --build

test: up log

up: 
	docker-compose up -d

down: 
	docker-compose down

build: 
	docker-compose build

ps: 
	docker-compose ps

log: 
	docker-compose logs -f backend

dclean:
	docker ps -q -a | xargs docker rm -f

vclean:
	docker volume rm postgres_data-volume

re: down run

rev: down vclean run

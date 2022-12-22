run: up log

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
	docker volume rm ft_transcendence_database-volume

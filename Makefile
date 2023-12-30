build:
	docker build -f php/Dockerfile -t car-game:latest --rm .
run:
	docker run -d -p 80:80 -v ./app:/var/www/app:rw -v ./apache_conf:/etc/apache2/sites-enabled -v ./logs:/var/log/apache2/car-game --name car-game car-game:latest
stop: 
	docker container stop car-game && docker container prune -f
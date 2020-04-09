docker ps

docker login

docker stop postgres_node

docker rm <containter>

docker cotainer ls

docker network create node_net

docker run \
    --name postgres_node \
    -e POSTGRES_USER=leandro \
    -e POSTGRES_PASSWORD=123 \
    -e POSTGRES_DB=heroes \
    -p 5432:5432 \
    --network node_net  \
    -d \
    postgres

winpty docker exec -it postgres_node bash

docker run \
    --name adminer \
    -p 8080:8080 \
    --network node_net \
    --link postgres:postgres_node \
    -d \
    adminer

//*******Mongo 

docker run \
    --name mongodb_node \
    -e MONGO_INITDB_ROOT_USERNAME=admin \
    -e MONGO_INITDB_ROOT_PASSWORD=123 \
    -p 27017:27017 \
    --network node_net  \
    -d \
    mongo:4

docker run \
    --name mongoclient_node \
    -p 3000:3000 \
    --network node_net \
    --link mongo:mongodb_node \
    -d \
    mongoclient/mongoclient

//Cria banco e usuario no container do mongodb

winpty docker exec -it mongodb_node \
    mongo --host localhost -u admin -p 123 --authenticationDatabase admin \
    --eval "db.getSiblingDB('herois').createUser({user:'leandro',pwd:'123',roles:[{role:'readWrite', db: 'herois'}]})"

winpty docker exec -it mongodb_node \
    mongo -u leandro -p 123  --authenticationDatabase herois
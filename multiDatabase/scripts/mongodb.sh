//databases
show dbs
use herois-db


show collections

//insert
db.herois.insert({ nome: 'Iron man', poder: 'Rico'})

// create
db.herois.create({ nome: 'Iron man', poder: 'Rico'})

// read
db.herois.find({})
db.herois.find({}).pretty()
db.herois.findOne()
db.herois.count()
db.herois.find().limit(10).sort({nome: -1})
db.herois.find({}, {poder:1, _id:0})

// update
db.herois.update({_id: ObjectId("5e8ba3eff4105f0ba5d31bad")}, {$set: {nome: 'papaleguas'}})

// delete
db.herois.delete({_id: id})

for(let i=0; i < 1000; i++){
    db.herois.insert({ nome: `Iron man Clone ${i}`, poder: 'Rico'})
}


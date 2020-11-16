const { db, syncAndSeed, model:{ Table, Person, Reservation } } = require('./db');
const express = require('express');
const path = require('path');
const app = express();

app.use(express.urlencoded({ extended:false }));
app.use(require('method-override')('_method'));
app.use('/public', express.static(path.join(__dirname, 'public'))); 


app.get('/', (req, res) => {
  res.redirect('/reservations')
})


app.get('/customers', async(req, res, next) =>{
  try{
    const people = await Person.findAll({
      include: [
        Reservation
      ],
      order: ['id']
    })
    res.send(people);
  }
  catch(ex){
    next(ex);
  }
})


app.get('/tables', async(req, res, next) => {
  try{
    const tables = await Table.findAll({
      include: [
        Reservation
      ]
    })
    res.send(tables);
  }
  catch(ex) {
    next(ex);
  }
})


app.get('/reservations', async(req, res, next) => {
  try{
    const reservations = await Reservation.findAll({
      include: [{
        model: Table,
        as: 'table'
      },
      {
        model: Person,
        as: 'reservedBy'
      }],
      order: ['id']
    })
    res.send(reservations)
  }
  catch(ex) {
    next(ex)
  }
})


const init = async() => {
  try{
    await syncAndSeed();
    const port = process.env.PORT || 3000
    app.listen(port,()=>{console.log(`Listening on Port: ${port}`)})
  }catch(error){
    console.log(error);
  }
}

init()
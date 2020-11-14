const {db,syncAndSeed,model:{Tables, Customers, Reservations}} = require('./db');
const express = require('express');
const path = require('path')
const { urlencoded } = require('express');
const app = express();

app.use(express.urlencoded({ extended:false }));
app.use(require('method-override')('_method'));
app.use('/',express.static(path.join(__dirname)));


app.get('/customers', async(req, res, next)=>{
    try{
        const customers = await Customers.findAll({
            include: [
                Reservations
            ],
            order: ['id']
        })
        res.send(customers);
    }
    catch(ex){
        next(ex);
    }
})


app.get('/tables', async(req, res, next)=> {
    try{
        const tables = await Tables.findAll({
            include: [
                Reservations
            ]
        })
        res.send(tables);
    }
    
    catch(ex) {
        next(ex);
    }
})


app.get('/reservations', async(req, res, next)=> {
    try{
        const reservations = await Reservations.findAll({
            include: [{
                model: Tables,
                as: 'table'
            },
            {
                model: Customers,
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
        console.log('READY');
        const port = process.env.PORT || 3000
        app.listen(port,()=>{console.log(`Listening on Port: ${port}`)})
    }catch(error){
        console.log(error);
    }
}

init()
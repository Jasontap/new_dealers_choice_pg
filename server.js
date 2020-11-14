const {db,syncAndSeed,model:{Facilities,Bookings,Members,Memberbookings}} = require('./db');
const express = require('express');
const path = require('path')
const { urlencoded } = require('express');
const app = express();

app.use(express.urlencoded({ extended:false }));
app.use(require('method-override')('_method'));
app.use('/',express.static(path.join(__dirname)));

app.get('/api/facilities',async(req,res,next)=>{
    try{
        const facilities = await Facilities.findAll({
            include:[
                Bookings
            ],
            order:['id']
        })
        res.send(facilities)
    }catch(ex){
        next(ex)
    }
})

app.get('/api/bookings',async(req,res,next)=>{
    try{
        const bookings = await Bookings.findAll({
            include:[
                {
                    model:Facilities,
                    as: 'facility'
                },
                {
                    model:Members,
                    as: 'bookedBy'
                }
            ],
            order:['id']
        })
        res.send(bookings)
    }catch(ex){
        next(ex)
    }
})


app.get('/api/members',async(req,res,next)=>{
    try{
        const members = await Members.findAll({
            include:[
                {
                    model:Members,
                    as: 'sponsor'
                }
            ],
            order:['id']
        })
        res.send(members)
    }catch(ex){
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
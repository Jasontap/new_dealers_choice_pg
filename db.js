const Sequelize = require('sequelize');
const {STRING,DATE,UUID,UUIDV4} = Sequelize;
const db = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/reservations_db')

const Tables = db.define('tables',{
    table_name: {
        type:STRING(20),
        allowNull:false,
        unique:true
    }
})

const Customers = db.define('customers',{
    id:{
        type:UUID,
        primaryKey:true,
        defaultValue:UUIDV4
    },
    first_name:{
        type:STRING(20),
        allowNull:false,
        unique:true
    }
})

const Reservations = db.define('reservations',{
    startTime:{
        type:DATE,
        allowNull:false,
    }
})


Reservations.belongsTo(Customers,{as: 'reservedBy'});
Customers.hasMany(Reservations,{foreignKey:'reservedById'})

Reservations.belongsTo(Tables,{as: 'table'});
Tables.hasMany(Reservations,{foreignKey:'tableId'})


const syncAndSeed = async() => {
await db.sync({force:true});

const [moe,lucy,larry]=await Promise.all(
    ['moe','lucy','larry'].map(first_name => Customers.create({first_name}))
    );

const [table1, table2, table3]=await Promise.all(
    ['table 1', 'table 2', 'table 3'].map(table_name => Tables.create({table_name}))
    );

const [reservation1, reservation2, reservation3, reservation4]=await Promise.all([
    Reservations.create({startTime:'2020-03-14 10:57:12.72-05'}),
    Reservations.create({startTime:'2020-04-14 18:57:12.72-05'}),
    Reservations.create({startTime:'2020-11-01 10:57:12.72-05'}),
    Reservations.create({startTime:'2020-10-30 09:57:12.72-05'})
])


reservation1.reservedById=moe.id;
reservation1.tableId=table1.id;
reservation2.reservedById=larry.id;
reservation2.tableId=table2.id;
reservation3.reservedById=lucy.id;
reservation3.tableId=table3.id;
reservation4.reservedById=larry.id;
reservation4.tableId=table1.id;


await Promise.all([
    reservation1.save(),
    reservation2.save(),
    reservation3.save(),
    reservation4.save(),
])
}

module.exports={
    db,
    syncAndSeed,
    model:{
        Tables,
        Customers,
        Reservations
    }
}
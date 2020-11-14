const Sequelize = require('sequelize');
const {STRING,INTEGER,DATE,UUID,UUIDV4} = Sequelize;
const db = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/acme_cc')

const Facilities = db.define('facilities',{
    id:{
        type:UUID,
        primaryKey:true,
        defaultValue:UUIDV4
    },
    fac_name:{
        type:STRING(100),
        allowNull:false,
        unique:true
    }
})

const Members = db.define('members',{
    id:{
        type:UUID,
        primaryKey:true,
        defaultValue:UUIDV4
    },
    first_name:{
        type:STRING(20),
        allowNull:false,
        unique:true
    },
})

const Bookings = db.define('bookings',{
    startTime:{
        type:DATE,
        allowNull:false,
    },
    endTime:{
        type:DATE,
        allowNull:false,
    },
})

const Memberbookings = db.define('member_bookings',{
})

Members.belongsTo(Members,{as : 'sponsor'})
Members.hasMany(Members,{foreignKey: 'sponsorId'})

Bookings.belongsTo(Members,{as: 'bookedBy'});
Members.hasMany(Bookings,{foreignKey:'bookedById'})

Bookings.belongsTo(Facilities,{as: 'facility'});
Facilities.hasMany(Bookings,{foreignKey:'facilityId'})

Memberbookings.belongsTo(Members)
Memberbookings.belongsTo(Bookings)


const syncAndSeed = async() => {
await db.sync({force:true});

const [moe,lucy,larry]=await Promise.all(
    ['moe','lucy','larry'].map(first_name => Members.create({first_name}))
    );

const [tennis,basketball,football]=await Promise.all(
    ['tennis','basketball','football'].map(fac_name => Facilities.create({fac_name}))
    );

const [booking1,booking2,booking3,booking4]=await Promise.all([
    Bookings.create({startTime:'2020-03-14 10:57:12.72-05',endTime:'2020-03-14 11:57:12.72-05'}),
    Bookings.create({startTime:'2020-04-14 18:57:12.72-05',endTime:'2020-04-14 22:57:12.72-05'}),
    Bookings.create({startTime:'2020-11-01 10:57:12.72-05',endTime:'2020-11-02 11:57:12.72-05'}),
    Bookings.create({startTime:'2020-10-30 09:57:12.72-05',endTime:'2020-10-30 09:57:12.72-05'})
])


moe.sponsorId=larry.id;
larry.sponsorId=lucy.id
booking1.bookedById=moe.id;
booking1.facilityId=tennis.id
booking2.bookedById=larry.id;
booking2.facilityId=basketball.id
booking3.bookedById=lucy.id;
booking3.facilityId=football.id
booking4.bookedById=lucy.id;
booking4.facilityId=tennis.id



await Promise.all([
    booking1.save(),
    booking2.save(),
    booking3.save(),
    booking4.save(),
    moe.save(),
    larry.save()
])
}

module.exports={
    db,
    syncAndSeed,
    model:{
        Facilities,
        Bookings,
        Members,
        Memberbookings
    }
}
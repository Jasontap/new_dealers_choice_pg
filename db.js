const Sequelize = require('sequelize');
const { STRING, DATE, UUID, UUIDV4 } = Sequelize;
const db = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/reservations_db')

const Table = db.define('table', {
  table_name: {
    type: STRING(20),
    allowNull: false,
    unique: true
  }
})

const Person = db.define('person', {
  id: {
    type: UUID,
    primaryKey: true,
    defaultValue: UUIDV4
  },
  first_name: {
    type: STRING(20),
    allowNull: false,
    unique: true
  }
})


const Reservation = db.define('reservation', {
  reserveTime: {
    type: DATE,
    allowNull: false
  }
})


Reservation.belongsTo(Person,{ as: 'reservedBy' });
Person.hasMany(Reservation,{ foreignKey:'reservedById' });

Reservation.belongsTo(Table,{ as: 'table' });
Table.hasMany(Reservation,{ foreignKey:'tableId' });

Person.belongsTo(Person,{ as: 'waitedBy' });
Person.hasMany(Person,{ foreignKey: 'waitedById' })


const syncAndSeed = async() => {
  await db.sync({ force:true });

  const [moe,lucy,larry, curley, joe, floe, zoe] = await Promise.all(
    ['moe','lucy','larry', 'curley', 'joe', 'floe', 'zoe'].map(first_name => Person.create({ first_name }))
    );

  const [table1, table2, table3] = await Promise.all(
    ['table 1', 'table 2', 'table 3'].map(table_name => Table.create({ table_name }))
    );

  const [reservation1, reservation2, reservation3, reservation4] = await Promise.all([
    Reservation.create({ reserveTime: '2020-11-14 10:57:12.72-05' }),
    Reservation.create({ reserveTime: '2020-11-15 18:57:12.72-05' }),
    Reservation.create({ reserveTime: '2020-11-15 10:57:12.72-05' }),
    Reservation.create({ reserveTime: '2020-11-21 09:57:12.72-05' })
  ])


  reservation1.reservedById = moe.id;
  reservation1.tableId = table1.id;
  moe.waitedById = joe.id;

  reservation2.reservedById = larry.id;
  reservation2.tableId = table2.id;
  larry.waitedById = floe.id;

  reservation3.reservedById = lucy.id;
  reservation3.tableId = table3.id;
  lucy.waitedById = zoe.id;

  reservation4.reservedById = curley.id;
  reservation4.tableId = table1.id;
  curley.waitedById = zoe.id;


  await Promise.all([
    reservation1.save(),
    reservation2.save(),
    reservation3.save(),
    reservation4.save(),
    moe.save(),
    larry.save(),
    lucy.save(),
    curley.save()
  ])
}

module.exports = {
  db,
  syncAndSeed,
  model: {
    Table,
    Person,
    Reservation
  }
}
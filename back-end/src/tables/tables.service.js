const knex = require("../db/connection");


function list() {
  return knex("tables")
        .groupBy("tables.table_id")
        .orderBy("tables.table_name")
        .then();
}

function read(tableId) {
  return knex("tables")
        .select("*")
        .where({ "table_id": tableId })
        .first();
}

function post(data) {
    return knex("tables")
        .insert(data)
        .returning("*")
        .then((createdRecords) => createdRecords[0]);
}

function update(tableId, reservationId) {
  return knex("tables")
        .select("*")
        .where({ table_id: tableId })
        .update( "reservation_id", reservationId );
}

function readRes(reservationId) {
  return knex("reservations")
        .where({ "reservation_id": reservationId })
        .first();
}

module.exports = {
  list,
  post,
  update,
  read,
  readRes
}
const knex = require("../db/connection");


function list(date) {
  return knex("reservations")
        .whereNot({ status: "finished" })
        .andWhere({ "reservation_date": date })
        .orderBy("reservation_time", "asc")
        .then();
}

function read(reservationId) {
  return knex("reservations")
        .where({ "reservation_id": reservationId })
        .first()
        .then();
}

function post(data) {
    return knex("reservations")
        .insert(data)
        .returning("*")
        .then((createdRecords) => createdRecords[0]);
}

function updateStatus(status, reservationId) {
  return knex("reservations")
        .where({ "reservation_id": reservationId })
        .update( "status", status)
        .returning("*")
        .then((records) => records[0]);
}

module.exports = {
  list,
  read,
  post,
  updateStatus
}
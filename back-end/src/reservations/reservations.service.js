const knex = require("../db/connection");


function list(date) {
  return knex("reservations")
        .whereNot({ status: "finished" })
        .andWhere({ "reservation_date": date })
        .orderBy("reservation_time", "asc")
        .then();
}

function listByPhone(mobile_number) {
  return knex("reservations")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
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
  listByPhone,
  read,
  post,
  updateStatus
}
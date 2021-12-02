const knex = require("../db/connection");


function list(date) {
  return knex("reservations")
        .where({ "reservation_date": date })
        .orderBy("reservation_time", "asc")
        .then();
}

function read(id) {
  return knex("reservations")
        .where({ "reservation_id": id })
        .first()
        .then();
}

function post(data) {
    return knex("reservations")
        .insert(data)
        .returning("*")
        .then((createdRecords) => createdRecords[0]);
}

module.exports = {
  list,
  read,
  post
}
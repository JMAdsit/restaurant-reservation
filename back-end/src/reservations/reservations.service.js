const knex = require("../db/connection");


function list() {
  return knex("reservations");
}

function post(data) {
    return knex("reservations")
        .insert(data)
        .returning("*")
        .then((createdRecords) => createdRecords[0]);
}

module.exports = {
  list,
  post
}
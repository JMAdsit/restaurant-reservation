/**
 * Defines the base URL for the API.
 * The default values is overridden by the `API_BASE_URL` environment variable.
 */
 
 const API_BASE_URL =
   process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";
 
 /**
  * Defines the default headers for these functions to work with `json-server`
  */
 const headers = new Headers();
 headers.append("Content-Type", "application/json");
 
 /**
  * Fetch `json` from the specified URL and handle error status codes and ignore `AbortError`s
  *
  * This function is NOT exported because it is not needed outside of this file.
  *
  * @param url
  *  the url for the requst.
  * @param options
  *  any options for fetch
  * @param onCancel
  *  value to return if fetch call is aborted. Default value is undefined.
  * @returns {Promise<Error|any>}
  *  a promise that resolves to the `json` data or an error.
  *  If the response is not in the 200 - 399 range the promise is rejected.
  */
async function fetchJson(url, options, onCancel) {
  try {
    const response = await fetch(url, options);

    if (response.status === 204) {
      return null;
    }

    const payload = await response.json();

    if (payload.error) {
      return Promise.reject({ message: payload.error });
    }
    return payload.data;
  } catch (error) {
    if (error.name !== "AbortError") {
      console.error(error.stack);
      throw error;
    }
    return Promise.resolve(onCancel);
  }
}

/**
 * Makes a get request to the base URL for reservations on the date
 * @param date
 * a string of a date in YYYY-MM-DD format
 * @param signal 
 * an abort signal
 * @returns {*}
 * a list of reservations matching the date
 */
export async function listReservations({date}, signal) {
  const url = `${API_BASE_URL}/reservations?date=${date}`
  const options = {
    method: "GET",
    headers,
    signal,
  };
  return await fetchJson(url, options);
}

/**
 * Makes a get request to the base URL for the reservation with the given id
 * @param reservation_Id
 * an id for a reservation
 * @param signal 
 * an abort signal
 * @returns {*}
 * a reservation matching the id
 */
export async function readReservation({reservation_Id}, signal) {
  const url = `${API_BASE_URL}/reservations/${reservation_Id}`;
  const options = {
    method: "GET",
    headers,
    signal,
  };
  return await fetchJson(url, options);
}

/**
 * Makes a get request to the base URL for reservations containing searched for phone number 
 * @param phoneQuery
 * a string of a whole or partial phone number
 * @param signal 
 * an abort signal
 * @returns {*}
 * a list of reservations matching the phone number
 */
export async function searchReservations({phoneQuery}, signal) {
  const url = `${API_BASE_URL}/reservations?mobile_number=${phoneQuery}`;
  const options = {
    method: "GET",
    headers,
    signal,
  };
  return await fetchJson(url, options);
}
 
/**
 * Makes a post request with a new reservation
 * @param reservation
 * an object containing the reservation data
 * @param signal 
 * an abort signal
 * @returns {*}
 * a status and the posted data
 */
export async function createReservation(reservation, signal) {
  const url = `${API_BASE_URL}/reservations`;
  const options = {
    method: "POST",
    headers,
    body: JSON.stringify(reservation),
    signal,
  };
  return await fetchJson(url, options, reservation);
}

/**
 * Makes a put request with updated reservation information
 * @param reservation
 * an object containing the reservation data
 * @param signal 
 * an abort signal
 * @returns {*}
 * a status and the updated data
 */
export async function updateReservation(reservation, signal) {
  const url = `${API_BASE_URL}/reservations/${reservation.reservation_id}`;
  const options = {
    method: "PUT",
    headers,
    body: JSON.stringify(reservation),
    signal,
  };
  return await fetchJson(url, options, reservation); 
}

/**
 * Makes a put request with updated reservation status
 * @param status
 * an object containing the new reservation status
 * @param reservation_id
 * the id of the reservation being updated
 * @param signal 
 * an abort signal
 * @returns {*}
 * a status and the updated data
 */
export async function updateStatus(status, reservation_id, signal) {
  const url = `${API_BASE_URL}/reservations/${reservation_id}/status`;
  const options = {
    method: "PUT",
    headers,
    body: JSON.stringify(status),
    signal,
  };
  return await fetchJson(url, options, status); 
}

/**
 * Makes a get request for the table information
 * @param signal 
 * an abort signal
 * @returns {*}
 * a list of all tables
 */
export async function listTables({date}, signal) {
  const url = `${API_BASE_URL}/tables`;
  const options = {
    method: "GET",
    headers,
    signal,
  };
  return await fetchJson(url, options);
}

/**
 * Makes a post request with new table information
 * @param table
 * an object containing the table data
 * @param signal 
 * an abort signal
 * @returns {*}
 * a status and the added data
 */
export async function createTable(table, signal) {
  const url = `${API_BASE_URL}/tables`;
  const options = {
    method: "POST",
    headers,
    body: JSON.stringify(table),
    signal,
  };
  return await fetchJson(url, options, table); 
}

/**
 * Makes a put request to seat a party at a table
 * @param data
 * an object containing the table and reservation data
 * @param signal 
 * an abort signal
 * @returns {*}
 * a status and the updated data
 */
export async function updateTable(data, signal) {
  const url = `${API_BASE_URL}/tables/${data.table_id}/seat`;
  const options = {
    method: "PUT",
    headers,
    body: JSON.stringify(data),
    signal,
  };
  return await fetchJson(url, options, data); 
}

/**
 * Makes a delete request to clear a seated party from a table
 * @param data
 * an object containing the table id
 * @param signal 
 * an abort signal
 * @returns {*}
 * a status and the updated data
 */
export async function clearTable(data, signal) {
  const url = `${API_BASE_URL}/tables/${data}/seat`;
  const options = {
    method: "DELETE",
    headers,
    signal,
  };
  return await fetchJson(url, options, data); 
}
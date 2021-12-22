import React, { useEffect, useState } from "react";
import { listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import useQuery from "../utils/useQuery";
import ReservationList from "../reservations/ReservationDisplay";
import TableList from "../tables/TableDisplay";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tablesError, setTablesError] = useState(null);

  const query = useQuery();
  const dateQuery = query.get("date");
  if(dateQuery) date = dateQuery;

  useEffect(loadReservations, [date]);
  useEffect(loadTables, [date]);

  function loadReservations() {
    const abortController = new AbortController();
    setReservationsError(null);
    try{
      listReservations({ date }, abortController.signal)
        .then(setReservations);
    } catch(error) {
      setReservationsError(error);
    }
    return () => abortController.abort();
  }

  function loadTables() {
    const abortController = new AbortController();
    setTablesError(null);
    try{
      listTables({ date }, abortController.signal)
        .then(setTables);
    } catch(error) {
      setTablesError(error);
    }
    return () => abortController.abort();
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <ErrorAlert error={reservationsError} />
      <ErrorAlert error={tablesError} />
      <ReservationList date={date} reservations={reservations} />
      <TableList tables={tables} date={date}/>
    </main>
  );
}

export default Dashboard;

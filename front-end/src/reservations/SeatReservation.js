import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { readReservation, listTables, updateTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function SeatReservation() {
    const { reservation_Id } = useParams();
    const [reservation, setReservation] = useState([]);
    const [tables, setTables] = useState([]);
    const [reservationError, setReservationError] = useState(null);
    const [tablesError, setTablesError] = useState(null);
    const [selectedTable, setSelectedTable] = useState(null);
  
    useEffect(loadReservation, [reservation_Id]);
    useEffect(loadTables, []);
  
    function loadReservation() {
      const abortController = new AbortController();
      setReservationError(null);
      readReservation({reservation_Id}, abortController.signal)
        .then(setReservation)
        .catch(setReservationError);
      return () => abortController.abort();
    }
  
    function loadTables() {
      const abortController = new AbortController();
      setTablesError(null);
      listTables({}, abortController.signal)
        .then(setTables)
        .catch(setTablesError);
      return () => abortController.abort();
    }

    //handle change of select option
    const changeHandler = event => {
      setSelectedTable(event.target.value);
    }

    //handle cancel button
    const history = useHistory();
    function handleCancel(event) {
        event.preventDefault();
        history.goBack();
    }

    //handle submit button
    async function handleSubmit(event) {
      event.preventDefault();
      setReservationError(null);
      setTablesError(null);

      if(selectedTable === null){
        const error = { status: 400, message: `Select a table.` }; 
        setTablesError(error);
        return;
      }

      const table = tables.find((table) => table.table_id === Number.parseInt(selectedTable));

      if(table.capacity < reservation.people) {
        const error = { status: 400, message: `Cannot seat at a table with less capacity than reservation size.` }; 
        setTablesError(error);
        return;
      }

      if(table.reservation_Id) {
        const error = { status: 400, message: `Table is occupied.` }; 
        setReservationError(error);
        return;
      }

      const data = {table_id: selectedTable, reservation_id: reservation_Id}

      try {
        await updateTable(data);
        history.push(`/dashboard?date=${reservation.reservation_date}`)
      } catch(error) {
        setTablesError(error);
      }
    }

    //Wait for data to load
    if(reservation.length < 1 || tables.length < 1){
        return <div>
            <h4>Loading...</h4>
        </div>
    }

    function generateOptions(table) {
      return <option key={table.table_id} value={table.table_id}>{table.table_name} - {table.capacity}</option>
    }

    const options = tables.map(generateOptions);
  
    return <main>
      <ErrorAlert error={reservationError} />
      <ErrorAlert error={tablesError} />
        <h1>Dashboard</h1>
        <div className="d-md-flex mb-3">
          <h4 className="mb-0">Seat Reservation for {reservation.first_name} {reservation.last_name}</h4>
          <form onSubmit={(event) => handleSubmit(event)}>
            <select required defaultValue="null" name="table_id" onChange={changeHandler}>
              <option disabled value="null">Select an option</option> 
              {options}
            </select>
            <button onClick={(event) => handleCancel(event)} className="btn btn-secondary">Cancel</button>
            <button type="submit" className="btn btn-primary">Submit</button>
          </form>
        </div>
      </main>
}

export default SeatReservation;
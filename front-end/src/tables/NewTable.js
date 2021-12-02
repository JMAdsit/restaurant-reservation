import React, {useState} from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";

function NewTable() {
    //declare table state
    let [table, setTable] = useState({
        "table_name": "",
        "capacity": ""
    });

    //handle changes in form input
    const changeHandler = event => {
        setTable({ ...table, [event.target.name]: event.target.value });
    }

    let [errorState, setErrorState] = useState(null);
    
    
    //handle cancel button
    const history = useHistory();
    function handleCancel(event) {
        event.preventDefault();
        history.goBack();
    }

    //handle submit button
    async function handleSubmit(table, event) {
        event.preventDefault();

        if(table.table_name.length < 2) {
            const error = { status: 400, message: `Table name must be at least two characters.` }; 
            setErrorState(error);
            return;
        }

        if(table.capacity < 1) {
            const error = { status: 400, message: `Must have at least one capacity.` }; 
            setErrorState(error);
            return;
        }


        // try {
        //     reservation.people = parseInt(reservation.people);
        //     await createReservation(reservation);
        //     history.push(`/dashboard?date=${reservation.reservation_date}`)
        // } catch(error) {
        //     setErrorState(error);
        // }
    }

    return <div>
    <ErrorAlert error={errorState} />
    <h2>New Table</h2>
    <form onSubmit={(event) => handleSubmit(table, event)}>
        <div className="form-group">
            <label htmlFor="table_name">Table Name
                <input
                required
                className="form-control" 
                id="table_name"
                name="table_name" 
                type="text" 
                placeholder="Table Name"
                value={table.table_name}
                onChange={changeHandler}
                />
            </label>
        </div>
        <div className="form-group">
            <label htmlFor="capacity">Capacity
                <input
                required
                className="form-control" 
                id="capacity"
                name="capacity" 
                type="number"
                value={table.capacity}
                onChange={changeHandler}
                />
            </label>
        </div>
        <button onClick={(event) => handleCancel(event)} className="btn btn-secondary">Cancel</button>
        <button type="submit" className="btn btn-primary">Submit</button>
    </form>
    </div>
}

export default NewTable;
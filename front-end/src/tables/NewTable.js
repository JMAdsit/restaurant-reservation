import React, {useState} from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { createTable } from "../utils/api.js";

function NewTable() {
    //declare states
    let [errorState, setErrorState] = useState(null);
    let [table, setTable] = useState({
        "table_name": "",
        "capacity": ""
    });

    //handle changes in form input
    const changeHandler = event => {
        setTable({ ...table, [event.target.name]: event.target.value });
    }
    
    //handle cancel button
    const history = useHistory();
    function handleCancel(event) {
        event.preventDefault();
        history.goBack();
    }

    //handle submit button
    async function handleSubmit(table, event) {
        event.preventDefault();

        //return error if name is too short
        if(table.table_name.length < 2) {
            const error = { status: 400, message: `Table name must be at least two characters.` }; 
            setErrorState(error);
            return;
        }

        //return error if capacity less than one
        if(table.capacity < 1) {
            const error = { status: 400, message: `Must have at least one capacity.` }; 
            setErrorState(error);
            return;
        }

        //make push request
        try {
            table.capacity = parseInt(table.capacity);
            await createTable(table);
            history.push(`/`)
        } catch(error) {
            setErrorState(error);
        }
    }

    //render new table form
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
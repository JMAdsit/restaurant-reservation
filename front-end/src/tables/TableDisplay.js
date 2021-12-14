import { clearTable } from "../utils/api";
import { useHistory } from "react-router-dom";

function TableList({ tables }) {
    //display function for each table
    function TableDisplay(table) {
        //check for occupancy
        let occupancy = "Free";
        if(table.reservation_id){
            occupancy = "Occupied";
        }

        
    const history = useHistory();
    //handle finish button
    async function handleFinish(event) {
        event.preventDefault();

        if(window.confirm("Is this table ready to seat new guests? This cannot be undone.")){
            try {
                await clearTable(table.table_id);
                history.go(0);
            } catch(error) {
                console.log(error);
            }
        }        
    }

    //toggle display for Finish button
    function FinishButton() {
        if(table.reservation_id) {
            return <button data-table-id-finish={table.table_id} onClick={(event) => handleFinish(event)} className="btn btn-secondary">Finish</button>
        } else {
            return null;
        }
    }

    //format singular/plural
    let people = "people";
    if(table.capacity === 1){ people = "person"}

    return <div key={table.table_id} className="card">
        <div className="card-body">
        <h5 className="card-title">Table {table.table_name}</h5>
        <p className="card-text"><small className="text-muted">Sits {table.capacity} {people}</small></p>
        <p className="card-text" data-table-id-status={table.table_id}>{occupancy}</p>
        <FinishButton />
    </div>
    </div>
    }

    //return react objects, whether loading or complete list of tables
    if(tables.length < 1) { return <h4>Loading...</h4>}
    const list = tables.map(TableDisplay);
    return <div>{list}</div>;
}

export default TableList;
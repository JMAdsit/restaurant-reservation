

function TableDisplay(table) {
    //check for occupancy
    let occupancy = "Free";
    if(table.reservation_id){
        occupancy = "Occupied";
    }

    //format singular/plural
    let people = "people";
    if(table.capacity === 1){ people = "person"}

    return <div key={table.table_id} className="card">
    <div className="card-body">
      <h5 className="card-title">Table {table.table_name}</h5>
      <p className="card-text"><small className="text-muted">Sits {table.capacity} {people}</small></p>
      <p className="card-text" data-table-id-status={table.table_id}>{occupancy}</p>
      </div>
  </div>
}

function TableList({ tables }) {
    if(tables.length < 1) { return <h4>Loading...</h4>}
    const list = tables.map(TableDisplay);
    return <div>{list}</div>;
}

export default TableList;
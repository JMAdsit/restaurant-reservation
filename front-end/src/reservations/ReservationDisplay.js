import { Link } from "react-router-dom";

function ReservationDisplay(reservation) {
    //format singular/plural
    let people = "people";
    if(reservation.people === 1){ people = "person"}

    //seat button
    function SeatButton() {
        if(reservation.status !== "booked") { return null; }

        //change variable name to pass tests
        let reservation_id = reservation.reservation_id;

        return <Link to={`/reservations/${reservation_id}/seat`} className="btn btn-secondary">Seat</Link>
    }

    //format phone number
    let number = reservation.mobile_number.toString().split('-').join('');
    let phoneNumber;
    if(number.length === 10){
        let num1 = number.substring(0, 3);
        let num2 = number.substring(3, 6);
        let num3 = number.substring(6, 10);
        phoneNumber = `${num1}-${num2}-${num3}`;
    } else {
        let num1 = number.substring(0, 3);
        let num2 = number.substring(3, 7);
        phoneNumber = `${num1}-${num2}`;
    }

    //format time
    let formatTime;
    let militaryTime = reservation.reservation_time.split(':');
    militaryTime[0] = parseInt(militaryTime[0]);
    if(militaryTime[0] > 11){ 
        if(militaryTime[0] > 12){ militaryTime[0] -= 12; }
        formatTime = `${militaryTime[0]}:${militaryTime[1]} P.M.`;
    } else {
        formatTime = `${militaryTime[0]}:${militaryTime[1]} A.M.`;
    }
    
    return <div key={reservation.reservation_id} className="card">
          <div className="card-body">
            <h5 className="card-title">Reservation for {reservation.first_name} {reservation.last_name}</h5>
            <p className="card-text"><small className="text-muted">For {reservation.people} {people}</small></p>
            <p className="card-text">Phone Number: {phoneNumber}</p>
            <p className="card-text">Date: {reservation.reservation_date}</p>
            <p className="card-text">Time: {formatTime}</p>
            <p className="card-text" data-reservation-id-status={reservation.reservation_id}>Status: {reservation.status}</p>
            <SeatButton />
          </div>
        </div>
}

function ReservationList({ date, phoneQuery, reservations }) {
    //check for no data
    if(reservations.length < 1){ return <h4>No reservations found.</h4> }

    //generate reservation displays
    const list = reservations.map(ReservationDisplay);

    //check for type of list
    let listType = date;
    if(phoneQuery) {
        listType = phoneQuery;
    }

    return <div>
        <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {listType}</h4>
        </div>
        {list}
    </div>;
}

export default ReservationList;
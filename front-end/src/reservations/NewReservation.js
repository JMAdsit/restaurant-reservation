import React, {useState} from "react";
import { useHistory } from "react-router-dom";
import { createReservation } from "../utils/api.js";
import ErrorAlert from "../layout/ErrorAlert";

function NewReservation({ date }) {
    //declare reservation state
    let [reservation, setReservation] = useState({ 
        "first_name": "", 
        "last_name": "", 
        "mobile_number": "",
        "reservation_date": "",
        "reservation_time": "",
        "people": ""
    });
    
    //handle changes in form input
    const changeHandler = event => {
        setReservation({ ...reservation, [event.target.name]: event.target.value })
    }

    let [errorState, setErrorState] = useState(null);

    //handle cancel button
    const history = useHistory();
    function handleCancel(event) {
        event.preventDefault();
        history.goBack();
    }

    //handle submit button
    async function handleSubmit(reservation, event) {
        event.preventDefault();
        setErrorState(null);

        //get day of the week
        const rdate = new Date(`${reservation.reservation_date} ${reservation.reservation_time}`);
        const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        let day = weekday[rdate.getDay()];

        if(day === "Tuesday" && rdate < new Date()) {
            const error = { status: 400, message: `Cannot schedule in the past or on Tuesdays.` }; 
            setErrorState(error);
            return;
        }

        if(day === "Tuesday") {
            const error = { status: 400, message: `Restaurant is closed on Tuesdays.` }; 
            setErrorState(error);
            return;
        }

        if(rdate < new Date()) {
            const error = { status: 400, message: `Must schedule in the future.` }; 
            setErrorState(error);
            return;
        }
        
        if(reservation.reservation_time > "21:30"){
            const error = { status: 400, message: `Must schedule before 9:30 PM.` }; 
            setErrorState(error);
            return;
        }

        if(reservation.reservation_time < "10:30"){
            const error = { status: 400, message: `Must schedule after 10:30 AM.` }; 
            setErrorState(error);
            return;
        }


        try {
            reservation.people = parseInt(reservation.people);
            await createReservation(reservation);
            history.push(`/dashboard?date=${reservation.reservation_date}`)
        } catch(error) {
            setErrorState(error);
        }
    }

    return <div>
        <ErrorAlert error={errorState} />
        <h2>New Reservation</h2>
        <form onSubmit={(event) => handleSubmit(reservation, event)}>
            <div className="form-group">
                <label htmlFor="first_name">First Name
                    <input
                    required
                    className="form-control" 
                    id="first_name"
                    name="first_name" 
                    type="text" 
                    placeholder="First Name"
                    value={reservation.first_name}
                    onChange={changeHandler}
                    />
                </label>
            </div>
            <div className="form-group">
                <label htmlFor="last_name">Last Name
                    <input
                    required
                    className="form-control" 
                    id="last_name"
                    name="last_name" 
                    type="text" 
                    placeholder="Last Name"
                    value={reservation.last_name}
                    onChange={changeHandler}
                    />
                </label>
            </div>
            <div className="form-group">
                <label htmlFor="mobile_number">Mobile Number
                    <input
                    required
                    className="form-control" 
                    id="mobile_number"
                    name="mobile_number" 
                    type="tel" 
                    placeholder="1234567890" 
                    pattern="[0-9]{7-10}"
                    value={reservation.mobile_number}
                    onChange={changeHandler}
                    />
                </label>
            </div>
            <div className="form-group">
                <label htmlFor="reservation_date">Date
                    <input
                    required
                    className="form-control" 
                    id="reservation_date"
                    name="reservation_date" 
                    type="date"
                    value={reservation.reservation_date}
                    onChange={changeHandler}
                    />
                </label>
            </div>
            <div className="form-group">
                <label htmlFor="reservation_time">Time
                    <input
                    required
                    className="form-control" 
                    id="reservation_time"
                    name="reservation_time" 
                    type="time"
                    // max="21:30"
                    value={reservation.reservation_time}
                    onChange={changeHandler}
                    />
                </label>
            </div>
            <div className="form-group">
                <label htmlFor="people">People
                    <input
                    required
                    className="form-control" 
                    id="people"
                    name="people" 
                    type="number" 
                    min="1"
                    value={reservation.people}
                    onChange={changeHandler}
                    />
                </label>
            </div>
            <button onClick={(event) => handleCancel(event)} className="btn btn-secondary">Cancel</button>
            <button type="submit" className="btn btn-primary">Submit</button>
        </form>
    </div>
}

export default NewReservation;
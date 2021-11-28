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
    })
    
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

        //get day of the week
        const d = new Date(`${reservation.reservation_date} ${reservation.reservation_time}`);
        const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        let day = weekday[d.getDay()];

        if(day === "Tuesday" && d < new Date()) {
            const error = { status: 400, message: `Cannot schedule in the past or on Tuesdays.` }; 
            setErrorState(error);
            return;
        }

        if(day === "Tuesday") {
            const error = { status: 400, message: `Restaurant is closed on Tuesdays.` }; 
            setErrorState(error);
            return;
        }

        if(d < new Date()) {
            const error = { status: 400, message: `Must schedule in the future.` }; 
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

    // //get current time and set default minimum date and time
    // let cDate = new Date();
    // let cHour = cDate.getHours();
    // let cMinute = String(cDate.getMinutes()).padStart(2, '0');
    // let cTime = `${cHour}:${cMinute}`;
    // let minDate = date;
    // let minTime = `10:30`;
    
    
    // //disable today if after 9:30 PM
    // if(cTime > `21:30`) {
    //     minDate = next(date);
    // }

    // //adjust earliest reservation time for today
    // // if(date === reservation.reservation_date) {
    // //     minTime = cTime;
    // // }

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
                    max="21:30"
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
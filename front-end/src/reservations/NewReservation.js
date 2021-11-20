import React, {useState} from "react";
import { useHistory } from "react-router-dom";

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

    //handle cancel button
    const history = useHistory();
    function handleCancel(event) {
        event.preventDefault();
        history.goBack();
    }

    //handle submit button

    //get current time and set default minimum date and time
    let cDate = new Date();
    let cHour = cDate.getHours();
    let cMinute = String(cDate.getMinutes()).padStart(2, '0');
    let cTime = `${cHour}:${cMinute}`;
    let minDate = date;
    let minTime = `10:30`;
    
    //disable today if after 9:30 PM
    if(cTime > `21:30`) {
        const tomorrow = new Date()
        tomorrow.setDate(new Date().getDate() + 1)
        let tYear = tomorrow.getFullYear();
        let tMonth = tomorrow.getMonth() + 1;
        let tDate = tomorrow.getDate();
        minDate = `${tYear}-${tMonth}-${tDate}`
    }

    //adjust earliest reservation time for today
    if(date === reservation.reservation_date) {
        minTime = cTime;
    }

    return <div>
        <h2>New Reservation</h2>
        <form /*onSubmit={}*/>
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
                    placeholder="123-456-7890" 
                    pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
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
                    min={minDate}
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
                    min={minTime}
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
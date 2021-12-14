import React from "react";

import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NewReservation from "../reservations/NewReservation";
import SeatReservation from "../reservations/SeatReservation";
import SearchReservations from "../reservations/SearchReservations";
import NewTable from "../tables/NewTable";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";




function Routes() {

  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/tables/new">
        <NewTable />
      </Route>
      <Route exact={true} path="/reservations/:reservation_Id/seat"> 
        <SeatReservation />
      </Route>
      <Route exact={true} path="/reservations/new">
        <NewReservation date={today()} />
      </Route>
      <Route exact={true} path="/reservations/:reservation_Id/edit">
        <NewReservation />
      </Route>
      <Route exact={true} path="/search">
        <SearchReservations />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/dashboard">
        <Dashboard date={today()} />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;

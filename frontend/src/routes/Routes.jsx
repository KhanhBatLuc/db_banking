import React from "react";

import { Route, Switch } from "react-router-dom";

import Home from "../pages/client/Home";
import Register from "../pages/auth/Register";
import Login from "../pages/auth/Login";
import SendMoney from "../pages/client/SendMoney";
import DashBoard from "../pages/admin/DashBoard";

import { useSelector } from "react-redux";
import TransectionsLog from "../pages/client/TransectionsLog";
import PassBook from "../pages/client/PassBook";
import ShowDetail from "../pages/client/ShowDetail";
import ManageUser from "../pages/admin/ManageUser";
import DetailUser from "../pages/admin/DetailUser";
import SaveMoney from "../pages/admin/SaveMoney";
import Chart from "../pages/admin/Chart";

const Routes = () => {
  const isLogged = useSelector(state => state.user.isLogged)
  return (
    <Switch>
      {/* -----------------Home--------------------- */}
      <Route path="/" exact component={Home} />
      {/* ---------------Auth--------------------- */}
      <Route path="/register" component={Register} />
      <Route path="/login" component={Login} />
      {/* ---------------Send Money---------------- */}
      <Route path="/chuyen-tien" component={isLogged ? SendMoney : Home} />
      {/* ---------------Transections Log--------------- */}
      <Route
        path="/lich-su-giao-dich"
        component={isLogged ? TransectionsLog : Home}
      />
      {/* ---------------Pass Book---------------------- */}
      <Route
        path="/gui-so-tiet-kiem"
        component={isLogged ? PassBook : Home}
      />
      <Route
        path="/so-tiet-kiem"
        component={isLogged ? ShowDetail : Home}
      />
      {/* ---------------Admin---------------------- */}
      <Route
        path="/admin/dashboard"
        component={isLogged ? DashBoard: Home}
      />
       <Route
        path="/admin/manage-user"
        component={isLogged ? ManageUser: Home}
      />
       <Route
        path="/admin/show-user/:id"
        component={isLogged ? DetailUser: Home}
      />
      <Route
      path="/show/save-money"
      component={isLogged ? SaveMoney: Home}
      />
       <Route
      path="/show/chart"
      component={isLogged ? Chart: Home}
    />

    </Switch>
  );
};

export default Routes;

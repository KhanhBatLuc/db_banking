import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import ManageUser from "./Admin/ManageUser";
import DetailUsers from "./Admin/DetailUsers";
import PaymentRecently from "./Admin/PaymentRecently";
import SaveMoney from "./Admin/SaveMoney";
import Chart from "./Admin/Chart";

const DashBoardAdmin = ({ type = "TS" }) => {
  const { userInfor } = useSelector((state) => state.user);
  const user = JSON.parse(localStorage.getItem("user"));

  const render = () => {
    if (type === "TS") {
      return <PaymentRecently />;
    }
    if (type === "MU") {
      return <ManageUser />;
    }
    if (type === "DETAIL_USER") {
      return <DetailUsers />;
    }
    if (type === "SAVE_MONEY") {
      return <SaveMoney />;
    }
    if (type === "CHART") {
      return <Chart />;
    }
  };

  return (
    <>
      <div>
        <div className="dsahboard-area bg-color area-padding">
          <div className="container">
            <div className="row">
              <div className="col-md-12 col-sm-12 col-xs-12">
                <div className="dashboard-head">
                  <div className="row">
                    <div className="col-md-3 col-sm-3 col-xs-12">
                      <div className="single-dash-head">
                        <div className="dashboard-profile">
                          <div className="profile-content">
                            <img
                              src="http://rockstheme.com/rocks/bultifore-preview/img/about/profile.png"
                              alt
                            />
                            <span className="pro-name">
                              {userInfor && userInfor.fullName}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3 col-sm-3 col-xs-12">
                      <div className="single-dash-head">
                        <div className="dashboard-amount">
                          <div className="amount-content">
                            <i className="flaticon-028-money" />
                            <span className="pro-name">Số Tiền Tiết Kiệm</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3 col-sm-3 col-xs-12">
                      <div className="single-dash-head">
                        <div className="dashboard-amount">
                          <div className="amount-content">
                            <i className="flaticon-043-bank-2" />
                            <span className="pro-name">Số Lượng Tài Khoản</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3 col-sm-3 col-xs-12">
                      <div className="single-dash-head">
                        <div className="dashboard-amount">
                          <div className="amount-content">
                            <i className="flaticon-050-credit-card-2" />
                            <span className="pro-name">Card Number</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-3 col-sm-3 col-xs-12">
                <aside className="sidebar">
                  <div className="dashboard-side">
                    <ul>
                    <li className={type === "CHART" ? "active" : ""}>
                        <Link to="/show/chart">
                          <i className="ti-dashboard" />
                          Thống Kê
                        </Link>
                      </li>
                      <li className={type === "TS" ? "active" : ""}>
                        <Link to="/admin/dashboard">
                          <i className="ti-dashboard" />
                          Trang Chủ
                        </Link>
                      </li>
                      <li className={type === "MU" ? "active" : ""}>
                        <Link to="/admin/manage-user">
                          <i class="bx bx-user-pin"></i>
                          Quản Lí Tài Khoản
                        </Link>
                      </li>
                      <li className={type === "SAVE_MONEY" ? "active" : ""}>
                        <Link to="/show/save-money">
                          <i class="bx bx-money"></i>
                          Quản Lí Gửi Tiết Kiệm
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div className="dashboard-support">
                    <div className="support-inner">
                      <div className="help-support">
                        <i className="flaticon-107-speech-bubbles" />
                        <a href="contact.html">
                          <span className="help-text">Need Help?</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </aside>
              </div>
              <div className="col-md-9 col-sm-9 col-xs-12">
                <div className="dashboard-content">
                  <div className="row">
                    <div className="col-md-12 col-sm-12 col-xs-12">
                      <div className="send-money-form transection-log">
                        <div className="form-text">
                          {render()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default DashBoardAdmin;

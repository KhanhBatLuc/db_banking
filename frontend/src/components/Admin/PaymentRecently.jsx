import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import adminApi from "../../api/adminApi";

const PaymentRecently = () => {
  const [listTransaction, setListTransaction] = useState([]);
  const [search, setSearch] = useState(null);

  const user = localStorage.getItem('user');

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const searchButton = async() => {
    try {
      const id = JSON.parse(user).user.id
      let res = await adminApi.sortByDate(search,id);
      if (res.data.status === 1) {
        setListTransaction(res.data.message?.data);
      }
    } catch (error) {
      console.log(error.response.data.message);
    }
  }

  useEffect(async() => {
    try {
      let res = await adminApi.getAllTransaction();
      if (res.data.status === 1) {
        setListTransaction(res.data.message.data);
      }
    } catch (error) {
      console.log(error.response.data.message);
    }
  }, []);




  return (
    <div className="form-inner table-inner">
      <div className=" " style={{ margin: " 20px 0" , float:'right' }}>
        <input
          type="date"
          style={{ color: "black" }}
          value={search}
          onChange={(e) => handleSearch(e)}
          rows={4}
        />
        <button
          onClick={searchButton}
          style={{ 
          color: 'white',
          backgroundColor: '#1b2654',
          border: '1px solid #1ba8c6',
          padding:'5px 10px',
          margin : '0 10px'
         }}>Tim Kiem</button>
      </div>
      <table>
        <tbody>
          <tr>
            <th>STK Người Gửi</th>
            <th>STK Người Nhận</th>
            <th>Ngày Giao Dịch</th>
            <th>Số Tiền Giao Dịch</th>
          </tr>
          {listTransaction.map((e) => (
            <tr>
              <td>{e.idSend}</td>
              <td>{e.idReceive}</td>
              <td>{e.date}</td>
              <td>{e.moneySend} VNĐ</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentRecently;

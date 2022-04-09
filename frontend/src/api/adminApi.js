import axiosClient from "./axiosClient";

const adminApi = {
  getAllTransaction: () => {
    const path = `/transaction/ad/show-all-transaction`;
    return axiosClient.get(path);
  },

  sortByDate: (id, day) => {
    const path = `transaction/show-by-day?day=${day}&id=${id}`;
    return axiosClient.get(path);
  },

  getAllUser: () => {
    const path = `user/ad/show-all`;
    return axiosClient.get(path);
  },

  getUserById: (id) => {
    const path = `user/ad/show-individual?id=${id}`;
    return axiosClient.get(path);
  },

  activeUser: (id, status) => {
    const path = `user/ad/active-user?id=${id}&status=${status}`;
    return axiosClient.post(path);
  },

  sortByDate: (day, id) => {
    const path = `transaction/show-by-day?day=${day} &id=${id}`;
    return axiosClient.get(path);
  },

  showAllSaving: () => {
    const path = `saving/show-all-saving`;
    return axiosClient.get(path);
  },

  //   postThemNguoiDung: (user) => {
  //     const path = "/QuanLyNguoiDung/ThemNguoiDung";

  //     return axiosClient.post(path, user);
  //   },

  //   deleteUser: (taiKhoan) => {
  //     const path = `/QuanLyNguoiDung/XoaNguoiDung/${taiKhoan}`;

  //     return axiosClient.delete(path);
  //   },

  //   editTaiKhoan: (user) => {
  //     const path = `/QuanLyNguoiDung/CapNhatThongTinNguoiDung`;
  //     return axiosClient.put(path, user);
  //   },

  //   getThongTinTaiKhoan: (info) => {
  //     const path = `/QuanLyNguoiDung/ThongTinTaiKhoan`;
  //     return axiosClient.post(path, info);
  //   },
};

export default adminApi;

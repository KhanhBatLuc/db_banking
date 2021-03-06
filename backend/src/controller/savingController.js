const { Op } = require("@sequelize/core");
require("dotenv").config();
const { validationResult } = require("express-validator");
import moment from "moment";

import db from "../models";
import statusResponse from "../utilities/statusResponse";

const sendSaving = async (req, res) => {
  try {
    const body = req.body;
    const status = body.typeStatus;
    if (status == "GDTK") {
      /// giao dich tai khoan
      let user = await db.Customer.findOne({
        where: {
          id: body.idUser,
        },
        include: [
          {
            model: db.CreditCard,
          },
        ],
      });

      if (user) {
        let money = user.CreditCard.money;
        let moneySend = body.moneySaving;
        if (Number(money) < Number(moneySend)) {
          return res
            .status(200)
            .json(
              statusResponse.createResponse(
                statusResponse.FAILED,
                "not enough to make money"
              )
            );
        }
        await db.Transaction.create({
          idSend: user.CreditCard.numberCard,
          idReceive: body.stkUserRecive,
          moneySend: moneySend,
          moneyRest: money - moneySend,
          description: body.description,
          type: "GTK",
          transactionPee: 0,
          date: body.date,
        });

        await db.CreditCard.update(
          {
            money: Number(user.CreditCard.money) - Number(moneySend),
          },
          {
            where: {
              userId: body.idUser,
            },
          }
        );

        let checkSaving = await db.Saving.findOne({
          where: {
            idUser: body.idUser,
          },
        });

        if (checkSaving) {
          await db.Saving.update(
            {
              moneySaving:
                parseInt(checkSaving.moneySaving) + parseInt(moneySend),
            },
            {
              where: {
                idUser: body.idUser,
              },
            }
          );
        } else {
          await db.Saving.create({
            idUser: body.idUser,
            moneySaving: moneySend,
            description: body.description,
            typeRate: body.typeRate,
            date: body.date,
          });
        }
      }
      return res
        .status(200)
        .json(
          statusResponse.createResponse(statusResponse.SUCCESS, "bank success")
        );
    } else {
      /// giao dich tien mat

      const saving = await db.Saving.create({
        idUser: body.idUser,
        moneySaving: body.moneySaving,
        typeRate: body.typeRate,
        description: body.description,
      });

      if (saving.dataValues) {
        return res
          .status(200)
          .json(
            statusResponse.createResponse(
              statusResponse.SUCCESS,
              "bank success"
            )
          );
      } else {
        return res
          .status(statusResponse.STATUS_NOT_FOUND)
          .json(
            statusResponse.createResponse(statusResponse.FAILED, "not found")
          );
      }
    }
  } catch (error) {
    return res
      .status(statusResponse.STATUS_CONFLICT)
      .json(
        statusResponse.createResponse(
          statusResponse.FAILED,
          "Loi o day" + error
        )
      );
  }
};

/// rut
const receiveSaving = async (req, res) => {
  try {
    const id = req.body.id;
    if (!id)
      return res
        .status(statusResponse.STATUS_NOT_FOUND)
        .json(
          statusResponse.createResponse(statusResponse.FAILED, "not found")
        );
    // has id
    const saving = await db.Saving.findOne({
      where: {
        idUser: id,
      },
    });
    // check date
    // 12 thang 0.023 6 thang 0.02
    const moneySend = saving.moneySaving;
    const typeRate = checkType(saving.typeRate); // ky han gui thang
    const checkDate = getDate(saving.date); // return so thang

    let money = validateDate(checkDate, typeRate, moneySend);

    await db.Transaction.create({
      idSend: 123,
      idReceive: req.body.stkReceive,
      moneySend: money,
      moneyRest: 0,
      description: "Rut Tien Tiet Kiem",
      type: "RTK",
      transactionPee: 0,
      date: req.body.date,
    });

    let cre = await db.CreditCard.findOne({
      where: {
        userId: id,
      },
    });

    await db.CreditCard.update(
      {
        money: Number(cre.mone) + Number(money),
      },
      {
        where: {
          userId: id,
        },
      }
    );

    return res.status(200).json(
      statusResponse.createResponse(statusResponse.SUCCESS, {
        data: {
          money: money,
          typeRate: `${typeRate} Th??ng`,
          period: checkDate,
        },
      })
    );
  } catch (error) {
    return res
      .status(statusResponse.STATUS_CONFLICT)
      .json(
        statusResponse.createResponse(
          statusResponse.FAILED,
          "Loi o day" + error
        )
      );
  }
};

const showSaving = async (req, res) => {
  try {
    const id = req.query.id;
    if (id) {
      const saving = await db.Saving.findOne({
        where: {
          idUser: id,
        },
      });

      if (saving) {
        return res.status(200).json(
          statusResponse.createResponse(statusResponse.SUCCESS, {
            data: saving,
          })
        );
      } else {
        return res
          .status(statusResponse.STATUS_NOT_FOUND)
          .json(
            statusResponse.createResponse(statusResponse.FAILED, "not found")
          );
      }
    } else {
      return res
        .status(statusResponse.STATUS_NOT_FOUND)
        .json(
          statusResponse.createResponse(statusResponse.FAILED, "not found")
        );
    }
  } catch (error) {
    return res
      .status(statusResponse.STATUS_CONFLICT)
      .json(
        statusResponse.createResponse(
          statusResponse.FAILED,
          "Loi o day" + error
        )
      );
  }
};

const showAllSaving = async (req, res) => {
  try {
    const saving = await db.Saving.findAll({
      include: [
        {
          model: db.Customer,
          include: [
            {
              model: db.CreditCard,
            },
          ],
        },
      ],
    });

    if (saving) {
      return res.status(200).json(
        statusResponse.createResponse(statusResponse.SUCCESS, {
          data: saving,
        })
      );
    } else {
      return res
        .status(statusResponse.STATUS_NOT_FOUND)
        .json(
          statusResponse.createResponse(statusResponse.FAILED, "not found")
        );
    }
  } catch (error) {
    return res
      .status(statusResponse.STATUS_CONFLICT)
      .json(
        statusResponse.createResponse(
          statusResponse.FAILED,
          "Loi o day" + error
        )
      );
  }
};

const validateDate = (checkDate, typeRate, moneySend) => {
  let money = 0;
  if (checkDate >= typeRate) {
    // dung ky han
    money = checkDate * 0.023 * moneySend;
  } else {
    money = moneySend;
  }
  return money;
};

const checkType = (text) => {
  switch (text) {
    case "12T":
      return 12;
    case "6T":
      return 6;
    default:
      return 6;
  }
};

const getDate = (date) => {
  const ngay_hien_tai = new Date().getTime();
  const ngay_gui = new Date(date).getTime();

  const period = (ngay_hien_tai - ngay_gui) / 1000 / 2592000;

  return Math.floor(period);
};

const chartSaving = async (req, res) => {
  try {
    // get all giao dich
    const data = await db.Transaction.findAll({});
    // map
    let labels = [];
    let arrDate = [];
    // data.forEach((b) => {
    //   arr.push({
    //     date: b.createdAt,
    //   });
    // });
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data[i].length; j++) {
        if (data[i]["date"] === data[j]["date"]) {
        } else {
          arrDate.push({
            date: data[i]["date"],
          });
        }
      }
    }

    //
    return res.status(200).json(
      statusResponse.createResponse(statusResponse.SUCCESS, {
        data: arrDate,
      })
    );
  } catch (error) {
    return res
      .status(statusResponse.STATUS_CONFLICT)
      .json(
        statusResponse.createResponse(
          statusResponse.FAILED,
          "Loi o day" + error
        )
      );
  }
};

module.exports = {
  sendSaving,
  receiveSaving,
  showSaving,
  showAllSaving,
  chartSaving,
};

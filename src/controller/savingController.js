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

module.exports = {
  sendSaving,
  receiveSaving,
  showSaving,
};

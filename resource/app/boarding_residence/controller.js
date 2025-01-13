const DBConn = require("../../../db");
const { globalFunc } = require("../../helper/global-func");
const { BoardingResidenceModel } = require("../../models/boarding_residence");
const { ResidenceRoomModel } = require("../../models/residence_room");
const { FacilityModel } = require("../../models/facility");
const { BenefitModel } = require("../../models/benefit");
const { methodConstant } = require("../../utils/constanta");
const controller = {};

controller.index = async (req, res, next) => {
  /* 
    #swagger.security = [{
      "bearerAuth": []
    }] 
  */
  /* 
    #swagger.tags = ['MASTER BOARDING RESIDENCE']
    #swagger.summary = 'role user'
    #swagger.description = 'every user has role for access'
    #swagger.parameters['page'] = { default: '1', description: 'Search by type' }
    #swagger.parameters['limit'] = { default: '10', description: 'Search by type' }
  */
  try {
    // get filter from query
    const filter = req.query;

    // get data from database
    const result = await BoardingResidenceModel.findAll();

    // send response to client
    return globalFunc.response({
      res,
      method: methodConstant.GET,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

controller.createNewBoardingResidence = async (req, res, next) => {
  /* 
    #swagger.security = [{
      "bearerAuth": []
    }] 
  */
  /* 
   #swagger.tags = ['MASTER BOARDING RESIDENCE']
    #swagger.summary = 'role user'
    #swagger.description = 'every user has role for access'
    #swagger.parameters['obj'] = {
      in: 'body',
      description: 'Create role',
      schema: { $ref: '#/definitions/BodyBoardingResidenceSchema' }
    }
  */
  const transaction = await DBConn.transaction();
  try {
    // get payload from body
    const payload = req.body;
    const rooms = payload.rooms;

    // create slug from name
    payload.slug = payload.name.toLowerCase().replace(/\s+/g, "-");

    // insert to database
    delete payload.rooms;
    const dBoardResidence = await BoardingResidenceModel.create(payload, {
      raw: true,
    });

    for (let room of rooms) {
      let dRoom = await ResidenceRoomModel.create(
        { ...room, residence_id: dBoardResidence.id },
        { raw: true, transaction },
      );

      //   for (let facility of room.facility) {
      //     facility.room_id = dRoom.id;
      //   }

      //   await FacilityModel.bulkCreate(room.facility, { transaction });
    }

    // send response to client
    await transaction.commit();
    return globalFunc.response({ res, method: methodConstant.POST });
  } catch (err) {
    await transaction.rollback();
    next(err);
  }
};

module.exports = controller;

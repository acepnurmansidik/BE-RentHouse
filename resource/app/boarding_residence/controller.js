const DBConn = require("../../../db");
const { globalFunc } = require("../../helper/global-func");
const { BoardingResidenceModel } = require("../../models/boarding_residence");
const { ResidenceRoomModel } = require("../../models/residence_room");
const { FacilityModel } = require("../../models/facility");
const { BenefitModel } = require("../../models/benefit");
const { methodConstant } = require("../../utils/constanta");
const { NotFoundError } = require("../../utils/errors");
const { Op } = require("sequelize");
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

      for (let facility of room.facility) {
        facility.room_id = dRoom.id;
      }
      for (let benefit of room.benefit) {
        benefit.room_id = dRoom.id;
      }

      await FacilityModel.bulkCreate(room.facility, { transaction });
      await BenefitModel.bulkCreate(room.benefit, { transaction });
    }

    // send response to client
    await transaction.commit();
    return globalFunc.response({ res, method: methodConstant.POST });
  } catch (err) {
    // await transaction.rollback();
    next(err);
  }
};

controller.updateBoardingResidence = async (req, res, next) => {
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

    // get data from params use id
    const id = req.params.id;

    // create slug from name
    payload.slug = payload.name.toLowerCase().replace(/\s+/g, "-");

    // check data in database
    const [isAvailable, idDuplicate, dRooms] = await Promise.all([
      BoardingResidenceModel.findOne({ where: { id } }),
      BoardingResidenceModel.findOne({ where: { slug: payload.slug } }),
      ResidenceRoomModel.findAll({
        where: { residence_id: id },
        attributes: ["id"],
        raw: true,
      }),
    ]);

    // send response not found when data not exist
    if (!isAvailable) throw new NotFoundError(`Data with id '${id}' not found`);
    // send bad request when data already exist
    if (!idDuplicate)
      throw new NotFoundError(
        `Data with name '${payload.name}' is already exist`,
      );

    // delete all data room, facility and benefit
    const newDRoom = dRooms.map((item) => item.id);
    await Promise.all([
      ResidenceRoomModel.destroy({ where: { residence_id: id }, transaction }),
      FacilityModel.destroy({
        where: { room_id: { [Op.in]: newDRoom } },
        transaction,
      }),
      BenefitModel.destroy({
        where: { room_id: { [Op.in]: newDRoom } },
        transaction,
      }),
      BoardingResidenceModel.update(payload, { where: { id }, transaction }),
    ]);

    for (let room of rooms) {
      let dRoom = await ResidenceRoomModel.create(
        { ...room, residence_id: id },
        { raw: true, transaction },
      );

      for (let facility of room.facility) {
        facility.room_id = dRoom.id;
      }
      for (let benefit of room.benefit) {
        benefit.room_id = dRoom.id;
      }

      await FacilityModel.bulkCreate(room.facility, { transaction });
      await BenefitModel.bulkCreate(room.benefit, { transaction });
    }

    // send response to client
    await transaction.commit();
    return globalFunc.response({ res, method: methodConstant.POST });
  } catch (err) {
    // await transaction.rollback();
    next(err);
  }
};

controller.deleteBoardingResidence = async (req, res, next) => {
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
    // get data from params use id
    const id = req.params.id;

    // check data in database
    const [isAvailable, dRooms] = await Promise.all([
      BoardingResidenceModel.findOne({ where: { id } }),
      ResidenceRoomModel.findAll({
        where: { residence_id: id },
        attributes: ["id"],
        raw: true,
      }),
    ]);

    // send response not found when data not exist
    if (!isAvailable) throw new NotFoundError(`Data with id '${id}' not found`);

    // delete all data room, facility and benefit
    const newDRoom = dRooms.map((item) => item.id);
    await Promise.all([
      ResidenceRoomModel.destroy({ where: { residence_id: id }, transaction }),
      FacilityModel.destroy({
        where: { room_id: { [Op.in]: newDRoom } },
        transaction,
      }),
      BenefitModel.destroy({
        where: { room_id: { [Op.in]: newDRoom } },
        transaction,
      }),
      BoardingResidenceModel.destroy({ where: { id }, transaction }),
    ]);

    // send response to client
    await transaction.commit();
    return globalFunc.response({ res, method: methodConstant.POST });
  } catch (err) {
    // await transaction.rollback();
    next(err);
  }
};

module.exports = controller;

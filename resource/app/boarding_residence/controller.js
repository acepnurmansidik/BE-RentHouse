const DBConn = require("../../../db");
const { globalFunc } = require("../../helper/global-func");
const { BoardingResidenceModel } = require("../../models/boarding_residence");
const { ResidenceRoomModel } = require("../../models/residence_room");
const { TestimonialModel } = require("../../models/testimonial");
const { FacilityModel } = require("../../models/facility");
const { RoomCommentModel } = require("../../models/room_comment");
const { BenefitModel } = require("../../models/benefit");
const { methodConstant } = require("../../utils/constanta");
const { NotFoundError } = require("../../utils/errors");
const { Op, fn, col } = require("sequelize");
const { TransactionModel } = require("../../models/transactions");
const { CityModel } = require("../../models/city");
const { UserModel } = require("../../models/user");
const { ImageModel } = require("../../models/image");
const ENV = require("../../utils/config");
const controller = {};

// RESIDENCES ===========================================================================
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
    filter.owner_id = req.login.id;

    // get data from database
    const result = await BoardingResidenceModel.findAll({
      where: {},
      attributes: [
        "id",
        "name",
        "description",
        [fn("CONCAT", ENV.urlImage, col("thumbnail")), "thumbnail"],
        "address",
        "category",
      ],
      include: [
        {
          model: CityModel,
          attributes: ["name", "id"],
          as: "city",
        },

        {
          model: UserModel,
          as: "owner",
          attributes: ["username", "id"],
        },
        {
          model: ResidenceRoomModel,
          as: "residence",
          include: [
            {
              model: FacilityModel,
              as: "facility_room",
            },
            {
              model: BenefitModel,
              as: "benefit_room",
            },
            {
              model: ImageModel,
              as: "room_images",
              where: { status: true },
              attributes: [
                "id",
                [fn("CONCAT", ENV.urlImage, col("path")), "name"],
              ],
            },
          ],
        },
      ],
    });

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

controller.indexOwnerBoardingResidence = async (req, res, next) => {
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
    filter.owner_id = req.login.id;

    // get data from database
    const result = await BoardingResidenceModel.findAll({
      where: { owner_id: req.login.id },
      attributes: [
        "id",
        "name",
        "description",
        [fn("CONCAT", ENV.urlImage, col("thumbnail")), "thumbnail"],
        "address",
        "category",
      ],
      include: [
        {
          model: CityModel,
          attributes: ["name", "id"],
          as: "city",
        },

        {
          model: UserModel,
          as: "owner",
          attributes: ["username", "id"],
        },
        {
          model: ResidenceRoomModel,
          as: "residence",
          include: [
            {
              model: FacilityModel,
              as: "facility_room",
            },
            {
              model: BenefitModel,
              as: "benefit_room",
            },
            {
              model: ImageModel,
              as: "room_images",
              where: { status: true },
              attributes: [
                "id",
                [fn("CONCAT", ENV.urlImage, col("path")), "name"],
              ],
            },
          ],
        },
      ],
    });

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

    // get data owner from login
    payload.owner_id = req.login.id;

    // create slug from name
    payload.slug = payload.name.toLowerCase().replace(/\s+/g, "-");
    payload.name = payload.name.toLowerCase().replace(/\b\w/g, function (char) {
      return char.toUpperCase();
    });

    // insert to database
    delete payload.rooms;
    const thumbnail = await ImageModel.findOne({
      where: { id: payload.thumbnail },
      raw: true,
      transaction,
    });

    payload.thumbnail = thumbnail.path;
    const dBoardResidence = await BoardingResidenceModel.create(payload, {
      raw: true,
      transaction,
    });

    await ImageModel.update(
      { source_id: dBoardResidence.id, status: true },
      { where: { id: thumbnail.id } },
    );

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
      await ImageModel.update(
        { source_id: dRoom.id, status: true },
        { where: { id: { [Op.in]: room.image } }, transaction },
      );
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
    payload.name = payload.name.toLowerCase().replace(/\b\w/g, function (char) {
      return char.toUpperCase();
    });

    await ImageModel.update(
      { status: false },
      {
        where: { source_id: id },
        transaction,
      },
    );

    // check data in database
    const [isAvailable, idDuplicate, dRooms, thumbnail] = await Promise.all([
      BoardingResidenceModel.findOne({ where: { id } }),
      BoardingResidenceModel.findOne({ where: { slug: payload.slug } }),
      ResidenceRoomModel.findAll({
        where: { residence_id: id },
        attributes: ["id"],
        raw: true,
      }),
      await ImageModel.findOne({
        where: { id: payload.thumbnail },
        raw: true,
        transaction,
      }),
    ]);

    // send response not found when data not exist
    if (!isAvailable) throw new NotFoundError(`Data with id '${id}' not found`);
    // send bad request when data already exist
    if (idDuplicate)
      throw new NotFoundError(
        `Data with name '${payload.name}' is already exist`,
      );

    // delete all data room, facility and benefit
    const newDRoom = dRooms.map((item) => item.id);
    payload.thumbnail = thumbnail.path;
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
      ImageModel.update(
        { status: false },
        { where: { source_id: { [Op.in]: newDRoom } }, transaction },
      ),
      ImageModel.update(
        { status: true, source_id: id },
        { where: { id: thumbnail.id }, transaction },
      ),
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
      await ImageModel.update(
        { source_id: dRoom.id, status: true },
        { where: { id: { [Op.in]: room.image } }, transaction },
      );
    }

    // send response to client
    await transaction.commit();
    return globalFunc.response({ res, method: methodConstant.PUT });
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
    newDRoom.push(id);
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
      ImageModel.update(
        { status: false },
        { where: { source_id: { [Op.in]: newDRoom } }, transaction },
      ),
    ]);

    // send response to client
    await transaction.commit();
    return globalFunc.response({ res, method: methodConstant.DELETE });
  } catch (err) {
    // await transaction.rollback();
    next(err);
  }
};

// COMMENTS =============================================================================
controller.createNewComment = async (req, res, next) => {
  /* 
    #swagger.security = [{
      "bearerAuth": []
    }] 
  */
  /* 
   #swagger.tags = ['COMMENTS BOARDING RESIDENCE']
   #swagger.summary = 'role user'
   #swagger.description = 'every user has role for access'
   #swagger.parameters['obj'] = {
      in: 'body',
      description: 'Create role',
      schema: { $ref: '#/definitions/BodyRoomCommentSchema' }
    }
  */
  try {
    // get payload from body
    const payload = req.body;

    // get data owner from login
    payload.user_id = req.login.id;

    // inser to database
    await RoomCommentModel.create(payload);

    // send response to client
    return globalFunc.response({ res, method: methodConstant.POST });
  } catch (err) {
    next(err);
  }
};

controller.updateComment = async (req, res, next) => {
  /* 
    #swagger.security = [{
      "bearerAuth": []
    }] 
  */
  /* 
   #swagger.tags = ['COMMENTS BOARDING RESIDENCE']
   #swagger.summary = 'role user'
   #swagger.description = 'every user has role for access'
    #swagger.parameters['obj'] = {
      in: 'body',
      description: 'Create role',
      schema: { $ref: '#/definitions/BodyRoomCommentSchema' }
    }
  */
  try {
    // get payload from body
    const payload = req.body;
    // get data in database use params
    const id = req.params.id;

    // inser to database
    await RoomCommentModel.update(payload, { where: { id } });

    // send response to client
    return globalFunc.response({ res, method: methodConstant.POST });
  } catch (err) {
    next(err);
  }
};

controller.deleteComment = async (req, res, next) => {
  /* 
    #swagger.security = [{
      "bearerAuth": []
    }] 
  */
  /* 
   #swagger.tags = ['COMMENTS BOARDING RESIDENCE']
   #swagger.summary = 'role user'
   #swagger.description = 'every user has role for access'
  */
  try {
    // get data in database use params
    const id = req.params.id;

    // inser to database
    await RoomCommentModel.destroy({ where: { id } });

    // send response to client
    return globalFunc.response({ res, method: methodConstant.POST });
  } catch (err) {
    next(err);
  }
};

// TESTIMONIALS =========================================================================
controller.updateTestimonial = async (req, res, next) => {
  /* 
    #swagger.security = [{
      "bearerAuth": []
    }] 
  */
  /* 
   #swagger.tags = ['TESTIMONIAL BOARDING RESIDENCE']
   #swagger.summary = 'role user'
   #swagger.description = 'every user has role for access'
    #swagger.parameters['obj'] = {
      in: 'body',
      description: 'Create role',
      schema: { $ref: '#/definitions/BodyTestimonialSchema' }
    }
  */
  try {
    // get payload from body
    const payload = req.body;

    // get data in database use params
    const id = req.params.id;

    // check data is avalable
    const isAvailable = await TestimonialModel.findOne({ where: { id } });

    // send response 404 when data not found
    if (!isAvailable) throw new NotFoundError(`Data with id ${id} not found`);

    // update data into database
    await TestimonialModel.update(
      { ...payload, status: true },
      {
        where: { id },
      },
    );

    // send response to client
    return globalFunc.response({ res, method: methodConstant.PUT });
  } catch (err) {
    next(err);
  }
};

// TRANSACTIONS =========================================================================
controller.createTransaction = async (req, res, next) => {
  /* 
    #swagger.security = [{
      "bearerAuth": []
    }] 
  */
  /* 
   #swagger.tags = ['TRANSACTION']
    #swagger.summary = 'role user'
    #swagger.description = 'every user has role for access'
    #swagger.parameters['obj'] = {
      in: 'body',
      description: 'Create role',
      schema: { $ref: '#/definitions/BodyTransactionSchema' }
    }
  */
  const transaction = await DBConn.transaction();
  try {
    // get payload from body
    const payload = req.body;

    // get data owner from login
    payload.user_id = req.login.id;

    // check data room and residence in database
    const [dRoomIsAvailable, dResidenceIsAvailable] = await Promise.all([
      ResidenceRoomModel.findOne({ where: { id: payload.room_id }, raw: true }),
      BoardingResidenceModel.findOne({ where: { id: payload.residence_id } }),
    ]);

    if (!dRoomIsAvailable)
      throw new NotFoundError(
        `Data room with id '${payload.room_id}' is not foudn`,
      );
    if (!dResidenceIsAvailable)
      throw new NotFoundError(
        `Data residence with id '${payload.residence_id}' is not foudn`,
      );

    payload.price_per_month = dRoomIsAvailable.price_per_month;
    // calculate total price
    payload.total_amount = payload.duration * dRoomIsAvailable.price_per_month;
    // create code transaction
    payload.code_trx = await globalFunc.generateTokenCode();

    // insert data transaction to database
    await TransactionModel.create(payload, { transaction });
    await transaction.commit();

    // send response to client
    return globalFunc.response({ res, method: methodConstant.POST });
  } catch (err) {
    await transaction.rollback();
    next(err);
  }
};

controller.updatePaymentTransaction = async (req, res, next) => {
  /* 
    #swagger.security = [{
      "bearerAuth": []
    }] 
  */
  /* 
   #swagger.tags = ['TRANSACTION']
    #swagger.summary = 'role user'
    #swagger.description = 'every user has role for access'
  */
  const transaction = await DBConn.transaction();
  try {
    // get id from params
    const id = req.params.id;

    // check data transaction in database
    const isAvailable = await TransactionModel.findOne({
      where: { id },
      raw: true,
    });

    if (!isAvailable)
      throw new NotFoundError(`Data transaction with id '${id}' is not found`);

    // when data available update payment_status to be true
    await TransactionModel.update(
      { payment_status: true },
      { where: { id }, transaction },
    );

    // create testimonial for rating residence

    await TestimonialModel.create(
      {
        room_id: isAvailable.room_id,
        user_id: isAvailable.user_id,
        rating: 0,
      },
      { transaction },
    );

    // send response to client
    await transaction.commit();
    return globalFunc.response({ res, method: methodConstant.POST });
  } catch (err) {
    await transaction.rollback();
    next(err);
  }
};

module.exports = controller;

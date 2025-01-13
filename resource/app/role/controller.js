const { RolesModel } = require("../../models/roles");
const { BadRequestError, NotFoundError } = require("../../utils/errors/index");

const controller = {};

controller.index = async (req, res, next) => {
  /* 
    #swagger.security = [{
      "bearerAuth": []
    }] 
  */
  /* 
    #swagger.tags = ['MASTER ROLE']
    #swagger.summary = 'role user'
    #swagger.description = 'every user has role for access'
  */
  try {
    const query = req.query;

    // get all data from table role
    const data = await RolesModel.findAll();

    // send response to client
    return res.status(200).json({ status: 200, data });
  } catch (err) {
    next(err);
  }
};

controller.createNewRole = async (req, res, next) => {
  /* 
    #swagger.security = [{
      "bearerAuth": []
    }] 
  */
  /* 
    #swagger.tags = ['MASTER ROLE']
    #swagger.summary = 'role user'
    #swagger.description = 'every user has role for access'
    #swagger.parameters['obj'] = {
      in: 'body',
      description: 'Create role',
      schema: { $ref: '#/definitions/BodyRolesSchema' }
    }
  */
  try {
    // get payload from body
    const payload = req.body;

    // buatkan slugnya
    payload.slug = payload.name.toLowerCase().replace(/\s+/g, "-");

    // insert to database
    const result = await RolesModel.create(payload);

    // send response to client
    return res.status(201).json({ status: 200, data: null });
  } catch (err) {
    next(err);
  }
};

controller.updateRole = async (req, res, next) => {
  /* 
    #swagger.security = [{
      "bearerAuth": []
    }] 
  */
  /* 
    #swagger.tags = ['MASTER ROLE']
    #swagger.summary = 'role user'
    #swagger.description = 'every user has role for access'
    #swagger.parameters['obj'] = {
      in: 'body',
      description: 'Create role',
      schema: { $ref: '#/definitions/BodyRolesSchema' }
    }
  */
  try {
    // get payload from body
    const payload = req.body;

    // get data form params use id
    const id = req.params.id;

    // konvert slug using name
    payload.slug = payload.name.toLowerCase().replace(/\s+/g, "-");

    // check is data exist in databse using id
    const [isExist, isDuplicate] = await Promise.all([
      RolesModel.findOne({ where: { id }, raw: true }),
      RolesModel.findOne({ where: { slug: payload.slug }, raw: true }),
    ]);

    if (!isExist) throw new NotFoundError(`Data with id '${id}' not found!`);
    if (isDuplicate)
      throw new BadRequestError(`Data with name '${payload.name}' is exist!`);

    console.log(payload);

    // update data in database
    await RolesModel.update(payload, { where: { id } });

    // send response to client
    return res.status(201).json({ status: 201, data: null });
  } catch (err) {
    next(err);
  }
};

controller.deleteRole = async (req, res, next) => {
  /* 
    #swagger.security = [{
      "bearerAuth": []
    }] 
  */
  /* 
    #swagger.tags = ['MASTER ROLE']
    #swagger.summary = 'role user'
    #swagger.description = 'every user has role for access'
  */
  try {
    // get id from params
    const id = req.params.id;

    // check data from database use id
    const isExist = await RolesModel.findOne({ where: { id }, raw: true });

    // send error if data not found
    if (!isExist) throw new NotFoundError(`data with id '${id}' not found`);

    // delete data from database
    await RolesModel.destroy({ where: { id } });

    // send response to client
    return res.status(201).json({ status: 201, data: null });
  } catch (err) {
    next(err);
  }
};

module.exports = controller;

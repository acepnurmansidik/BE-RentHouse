const { CityModel } = require("../../models/city");
const { globalFunc } = require("../../helper/global-func");
const { methodConstant } = require("../../utils/constanta");
const { BadRequestError, NotFoundError } = require("../../utils/errors");
const controller = {};

controller.index = async (req, res, next) => {
  /* 
    #swagger.security = [{
      "bearerAuth": []
    }] 
  */
  /* 
    #swagger.tags = ['MASTER CITY']
    #swagger.summary = 'role user'
    #swagger.description = 'every user has role for access'
    #swagger.parameters['name'] = { default: '', description: 'Search by type' }
    #swagger.parameters['page'] = { default: '1', description: 'Search by type' }
    #swagger.parameters['limit'] = { default: '10', description: 'Search by type' }
  */
  try {
    // get filter from query
    const filter = req.query;

    // get data from database
    const result = await CityModel.findAll();

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

controller.createNewCity = async (req, res, next) => {
  /* 
    #swagger.security = [{
      "bearerAuth": []
    }] 
  */
  /* 
    #swagger.tags = ['MASTER CITY']
    #swagger.summary = 'role user'
    #swagger.description = 'every user has role for access'
    #swagger.parameters['obj'] = {
      in: 'body',
      description: 'Create role',
      schema: { $ref: '#/definitions/BodyCitySchema' }
    }
  */
  try {
    // get payload from body
    const payload = req.body;
    // changes to title case name
    payload.name = payload.name.replace(/\b\w/g, (char) => char.toUpperCase());
    payload.slug = payload.name.toLowerCase().replace(/\s+/g, "-");

    // insert to database
    await CityModel.create(payload);

    // send response to client
    return globalFunc.response({
      res,
      method: methodConstant.POST,
    });
  } catch (err) {
    next(err);
  }
};

controller.updateCity = async (req, res, next) => {
  /* 
    #swagger.security = [{
      "bearerAuth": []
    }] 
  */
  /* 
    #swagger.tags = ['MASTER CITY']
    #swagger.summary = 'role user'
    #swagger.description = 'every user has role for access'
    #swagger.parameters['obj'] = {
      in: 'body',
      description: 'Create role',
      schema: { $ref: '#/definitions/BodyCitySchema' }
    }
  */
  try {
    // get payload from body
    const payload = req.body;
    // get data from db use id
    const id = req.params.id;

    // changes to title case name
    payload.name = payload.name.replace(/\b\w/g, (char) => char.toUpperCase());
    payload.slug = payload.name.toLowerCase().replace(/\s+/g, "-");

    // check is available in database
    const [isAvailable, isDuplicate] = await Promise.all([
      CityModel.findOne({ where: { id }, raw: true }),
      CityModel.findOne({ where: { slug: payload.slug }, raw: true }),
    ]);

    // send not found error if not exist
    if (!isAvailable) throw new NotFoundError(`Data with id '${id}' not found`);
    // send not found error if duplicate data
    if (isDuplicate)
      throw new BadRequestError(`Data with name '${payload.name}' is exist`);

    // update to database
    await CityModel.update(payload, { where: { id } });

    // send response to client
    return globalFunc.response({
      res,
      method: methodConstant.PUT,
    });
  } catch (err) {
    next(err);
  }
};

controller.deleteCity = async (req, res, next) => {
  /* 
    #swagger.security = [{
      "bearerAuth": []
    }] 
  */
  /* 
    #swagger.tags = ['MASTER CITY']
    #swagger.summary = 'role user'
    #swagger.description = 'every user has role for access'
    #swagger.parameters['obj'] = {
      in: 'body',
      description: 'Create role',
      schema: { $ref: '#/definitions/BodyCitySchema' }
    }
  */
  try {
    // get data from db use id
    const id = req.params.id;

    // check is available in database
    const isAvailable = await CityModel.findOne({ where: { id }, raw: true });

    // send not found error if not exist
    if (!isAvailable) throw new NotFoundError(`Data with id '${id}' not found`);

    // update to database
    await CityModel.destroy({ where: { id } });

    // send response to client
    return globalFunc.response({
      res,
      method: methodConstant.DELETE,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = controller;

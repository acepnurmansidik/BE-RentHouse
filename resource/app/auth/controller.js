const { globalFunc } = require("../../helper/global-func");
const { UserModel } = require("../../models/user");
const { BadRequestError } = require("../../utils/errors/index");
const { ImageModel } = require("../../models/image");
const { methodConstant } = require("../../utils/constanta");

const controller = {};
controller.Register = async (req, res, next) => {
  /* 
    #swagger.security = [{
      "bearerAuth": []
    }] 
  */
  /* 
    #swagger.tags = ['AUTH']
    #swagger.summary = 'role user'
    #swagger.description = 'every user has role for access'
    #swagger.parameters['obj'] = {
      in: 'body',
      description: 'Create role',
      schema: { $ref: '#/definitions/BodyRegisterSchema' }
    }
  */
  try {
    const payload = req.body;
    payload.password = await globalFunc.hashPassword({ ...payload });
    await UserModel.create(payload);

    return globalFunc.response({
      res,
      method: methodConstant.POST,
    });
  } catch (err) {
    next(err);
  }
};

controller.Login = async (req, res, next) => {
  /* 
    #swagger.tags = ['AUTH']
    #swagger.summary = 'role user'
    #swagger.description = 'every user has role for access'
    #swagger.parameters['obj'] = {
      in: 'body',
      description: 'Create role',
      schema: { $ref: '#/definitions/BodyLoginSchema' }
    }
  */
  try {
    const { username, password } = req.body;
    // check body
    if (!username || !password)
      throw new BadRequestError("Credentials is invalid");
    // get data from databse by email
    const data = await UserModel.findOne({
      where: { username },
      attributes: ["password", "username"],
    });

    // compare password from input with saving database
    const isMatch = await globalFunc.verifyPassword({
      hashPassword: data.password,
      password,
    });
    // send error password no match
    if (!isMatch) throw new BadRequestError("Credentials is invalid");

    // create JWT token for response
    const result = await globalFunc.generateJwtToken(data.toJSON());

    return globalFunc.response({
      res,
      method: methodConstant.POST,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

controller.uploadFile = async (req, res, next) => {
  /*
    #swagger.security = [{
      "bearerAuth": []
    }]
  */
  /*
    #swagger.tags = ['UPLOAD IMAGES']
    #swagger.summary = 'this API for upload images'
    #swagger.description = 'untuk referensi group'
    #swagger.consumes = ['multipart/form-data']
    #swagger.parameters['proofs'] = {
      in: 'formData',
      type: 'array',
      required: true,
      description: 'Some description...',
      collectionFormat: 'multi',
      items: { type: 'file' }
    }
  */
  try {
    const _tempID = [];
    // loop every file, then insert to array
    const fileResult = await ImageModel.bulkCreate(req.files, {
      returning: true,
    });
    for (let file of fileResult) {
      _tempID.push(file.id);
    }

    return globalFunc.response({
      res,
      method: methodConstant.POST,
      data: _tempID,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = controller;

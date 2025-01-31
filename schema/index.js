const BoardingResidenceSchema = require("./boarding_residesidence");
const CitySchema = require("./city");
const RoleSchema = require("./roles");
const RoomCommentSchema = require("./room_comment");
const TestimonialSchema = require("./testimonial");
const UserSchema = require("./user");
const TransactionSchema = require("./transaction");

const GlobalSchema = {
  ...UserSchema,
  ...RoleSchema,
  ...CitySchema,
  ...BoardingResidenceSchema,
  ...RoomCommentSchema,
  ...TestimonialSchema,
  ...TransactionSchema,
};

module.exports = GlobalSchema;

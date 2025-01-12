const {
  BoardingResidenceModelDefine,
} = require("../models/boarding_residence");
const { FacilityModelDefine } = require("../models/facility");
const { BenefitModelDefine } = require("../models/benefit");

const BoardingResidenceSchema = {
  BodyBoardingResidenceSchema: {
    ...BoardingResidenceModelDefine,
    facility: [
      {
        ...FacilityModelDefine,
      },
    ],
    benefit: [
      {
        ...BenefitModelDefine,
      },
    ],
    images: [],
  },
};

module.exports = BoardingResidenceSchema;

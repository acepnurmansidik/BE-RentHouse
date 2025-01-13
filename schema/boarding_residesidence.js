const {
  BoardingResidenceModelDefine,
} = require("../resource/models/boarding_residence");
const { FacilityModelDefine } = require("../resource/models/facility");
const { BenefitModelDefine } = require("../resource/models/benefit");

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

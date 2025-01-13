const {
  BoardingResidenceModelDefine,
} = require("../resource/models/boarding_residence");
const { FacilityModelDefine } = require("../resource/models/facility");
const { BenefitModelDefine } = require("../resource/models/benefit");
const {
  ResidenceRoomModelDefine,
} = require("../resource/models/residence_room");

const BoardingResidenceSchema = {
  BodyBoardingResidenceSchema: {
    ...BoardingResidenceModelDefine,
    rooms: [
      {
        ...ResidenceRoomModelDefine,
        facility: [
          {
            name: "bathub",
          },
        ],
        benefit: [
          {
            name: "free refund",
            description: "bisa refund kapan saja tanpa biaya admin",
          },
        ],
      },
    ],
    // images: [],
  },
};

module.exports = BoardingResidenceSchema;

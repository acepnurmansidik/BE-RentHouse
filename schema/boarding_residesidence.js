const {
  BoardingResidenceModelDefine,
} = require("../resource/models/boarding_residence");
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
        image: ["90798ede-1c50-4e93-8778-49efe7625cbf"],
      },
    ],
  },
};

module.exports = BoardingResidenceSchema;

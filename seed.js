const { User, db } = require("./db_config");
const { hashPassword } = require("./utils/passwordUtils");

const seed = async () => {
  try {
    await db.sync({ force: true });
  } catch (error) {
    console.log(error);
  }
};

seed();

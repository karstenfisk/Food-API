const { User, db, Ingredient } = require("./db_config");
const { hashPassword } = require("./utils/passwordUtils");

const seed = async () => {
  try {
    await db.sync({ force: false });
  } catch (error) {
    console.log(error);
  }
};

seed();

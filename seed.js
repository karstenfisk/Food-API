const { User, db } = require("./db_config");
const { hashPassword } = require("./utils/passwordUtils");

const seed = async () => {
  try {
    await db.sync({ force: true });
    const password = await hashPassword("password");
    await User.create({
      username: "kArsten",
      email: "kkarstn@gmail.com",
      password: password,
    });
  } catch (error) {
    console.log(error);
  }
};

seed();

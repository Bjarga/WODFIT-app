const bcrypt = require("bcrypt");

const testBcrypt = async () => {
  const password = "admin123";

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  console.log("Hashed password:", hashedPassword);

  // Compare the hashed password with the plain text password
  const match = await bcrypt.compare(password, hashedPassword);
  console.log("Password comparison result:", match);
};

testBcrypt();

const repo =require('../repository/userRepository');
const hashPassword=require('../utils/tokenUtil')

exports.registerUser = async (data) => {
  const { firstname, lastname, email, contactno, address, password } = data;

  const existing = await repo.findUserByEmailOrPhone(email || contactno);

  if (existing) {
    return {
      success: false,
      status: 409,
      message: "User already exists"
    };
  }

  const hashed = await hashPassword.hashPassword(password);

  await repo.createUser({
    firstname,
    lastname,
    email,
    contactno,
    address,
    password: hashed
  });

  return {
    success: true,
    status: 201,
    message: "User registered successfully"
  };
};
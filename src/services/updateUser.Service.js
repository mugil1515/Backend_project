const userRepo = require("../repository/userRepository");

exports.updateMyProfile = async (
  userId,
  body
) => {

  const errors = {};

  // GET CURRENT USER
  const currentUser =
    await userRepo.findUserById(
      Number(userId)
    );

  if (!currentUser) {
    throw {
      status: 404,
      message: "User not found"
    };
  }

  // EMAIL CHECK
  if (
    body.email &&
    body.email.trim() !== currentUser.email
  ) {

    const emailExists =
      await userRepo.isEmailTaken(
        body.email.trim(),
        Number(userId)
      );

    if (emailExists) {
      errors.email =
        "Email already exists";
    }
  }

  // CONTACT CHECK
  if (
    body.contactno &&
    body.contactno.trim() !== currentUser.contactno
  ) {

    const contactExists =
      await userRepo.isContactTaken(
        body.contactno.trim(),
        Number(userId)
      );

    if (contactExists) {
      errors.contactno =
        "Contact number already exists";
    }
  }

  // THROW VALIDATION ERRORS
  if (Object.keys(errors).length > 0) {
    throw {
      status: 400,
      message: "Validation failed",
      errors
    };
  }

  // UPDATE
  return await userRepo.updateMyProfile({
    userId: Number(userId),
    firstname: body.firstname,
    lastname: body.lastname,
    contactno: body.contactno,
    email: body.email
  });
};
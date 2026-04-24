const { body } = require('express-validator');

exports.registerValidator = [
  body('firstname')
    .trim()
    .notEmpty().withMessage('First name is required')
    .isLength({ min: 2 }).withMessage('First name must be at least 2 characters'),

  body('lastname')
    .trim()
    .notEmpty().withMessage('Last name is required'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Enter a valid email address')
    .normalizeEmail(),

  body('contactno')
    .trim()
    .notEmpty().withMessage('Mobile number is required')
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Enter a valid 10-digit Indian mobile number'),

  body('address')
    .trim()
    .notEmpty().withMessage('Address is required')
    .isLength({ min: 5 }).withMessage('Address must be at least 5 characters'),

  body('password')
    .trim()
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
    .matches(/[0-9]/).withMessage('Password must contain at least one number')
    .matches(/[@$!%*?&]/).withMessage('Password must contain at least one special character ')
];

exports.loginValidator = [
  body('identifier')
    .trim()
    .notEmpty().withMessage('Email or mobile number is required')
    .custom((value) => {
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      const isPhone = /^[6-9]\d{9}$/.test(value);

      if (!isEmail && !isPhone) {
        throw new Error('Enter a valid email or 10-digit mobile number');
      }
      return true;
    }),

  body('password')
    .trim()
    .notEmpty().withMessage('Password is required')
];

exports.otpValidator = [
  body('identifier')
    .trim()
    .notEmpty().withMessage('Email or mobile number is required')
    .custom((value) => {
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      const isPhone = /^[6-9]\d{9}$/.test(value);

      if (!isEmail && !isPhone) {
        throw new Error('Enter a valid email or 10-digit mobile number');
      }
      return true;
    })
];

exports.verifyOtpValidator = [
  body('identifier')
    .trim()
    .notEmpty().withMessage('Email or mobile number is required'),

  body('otp')
    .trim()
    .notEmpty().withMessage('OTP is required')
    .isLength({ min: 6, max: 6 }).withMessage('OTP must be exactly 6 digits')
    .isNumeric().withMessage('OTP must contain only numbers')
];

exports.resetPasswordValidator = [
  body("newPassword")
    .trim()
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters long")
    .matches(/[A-Z]/).withMessage("Must contain at least one uppercase letter")
    .matches(/[a-z]/).withMessage("Must contain at least one lowercase letter")
    .matches(/[0-9]/).withMessage("Must contain at least one number")
    .matches(/[@$!%*?&]/).withMessage("Must contain at least one special character"),

  body("confirmPassword")
    .trim()
    .notEmpty().withMessage("Confirm password is required")
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
];
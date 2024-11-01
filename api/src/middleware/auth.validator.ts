import { body } from "express-validator"



export const authValidators = { 
    signup: [
        body("name") 
        .trim()
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ min: 2, max: 50}) 
        .withMessage("Name must be between 2 and 50 characters"),


        body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Must be a valid email")
        .normalizeEmail(), 

        body("password") 
        .trim()
        .notEmpty()
        .withMessage("Password is required") 
         .withMessage("Password must be at least 6 characters")
            .matches(/[A-Z]/)
            .withMessage("Password must contain at least one uppercase letter"),

        body("confirmPassword")
        .trim()
        .notEmpty()
        .withMessage("Password confirmation is required")
        .custom((value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error("Passwords must match");
                }
                return true;
            })
    ],
    login: [
        body("email")
            .trim()
            .notEmpty()
            .withMessage("Email is required")
            .isEmail()
            .withMessage("Must be a valid email")
            .normalizeEmail(),
            
        body("password")
            .trim()
            .notEmpty()
            .withMessage("Password is required")
    ]
};
import { body } from 'express-validator';

export const commentValidators = {
  createComment: [
    body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is Required')
    .isLength({ min: 3, max: 100 }) 
    .withMessage('Title must be between 3 and 100 character')
    .escape()
    ,
    body('content')
      .trim()
      .notEmpty()
      .withMessage('Content is Required')
      .isLength({ min: 10 })
      .withMessage('Content must be at least 10 characters')
      .escape()
  ],

  updatePost: [
    body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters')
    .escape(), 

    body('content')
    .optional()
    .trim()
    .isLength({ min: 10 })
    .withMessage('Content must be at least 10 characters')
    .escape()
  ]
};

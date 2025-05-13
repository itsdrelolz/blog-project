import { body } from 'express-validator';
import sanitizeHtml from 'sanitize-html';

export const postValidators = {
  createPost: [
    
    body('content')
      .customSanitizer(raw =>
        sanitizeHtml(raw, {
          allowedTags: ['p','h1','h2','h3','ul','ol','li','strong','em','a','img','blockquote'],
          allowedAttributes: {
            a: ['href','target','rel'],
            img: ['src','alt','width','height']
          },
          allowedSchemes: ['http','https','mailto'],
          selfClosing: ['img'],
          transformTags: {
            'a': sanitizeHtml.simpleTransform('a', { rel: 'nofollow noopener', target: '_blank' })
          }
        })
      )
      .isLength({ min: 10 })
      .withMessage('Content must be at least 10 characters'),
  
  ],
  updatePost: [
    body('content')
      .customSanitizer(raw =>
        sanitizeHtml(raw, {
          allowedTags: ['p','h1','h2','h3','ul','ol','li','strong','em','a','img','blockquote'],
          allowedAttributes: {
            a: ['href','target','rel'],
            img: ['src','alt','width','height']
          },
          allowedSchemes: ['http','https','mailto'],
          selfClosing: ['img'],
          transformTags: {
            'a': sanitizeHtml.simpleTransform('a', { rel: 'nofollow noopener', target: '_blank' })
          }
        })
      )
      .isLength({ min: 10 })
      .withMessage('Content must be at least 10 characters'),
  ],
};








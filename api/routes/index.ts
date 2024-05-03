import express from 'express';
import { getHomePage } from './get-home-page.route';
import { postGenerateHTML } from './post-generate-html.route';

const router = express.Router();

router.get('/', getHomePage);
router.post('/generateHTML', postGenerateHTML);

export default router;

import express from 'express';
import { addCommentToNews, createNews, deleteNews, editNews, getAllNews, getComments, getCompanyNews, getLikes, getNewsById, toggleLikeOnNews } from '../controllers/newsCtrl.js';
import auth from '../middlewares/auth.js';
const router = express.Router();

router.get('/', getAllNews);
router.get('/:id', getNewsById);
router.post('/createNews', createNews);
router.post('/:newsId/comment', addCommentToNews);
router.get('/:newsId/comments', getComments);
router.get('/:newsId/likes', getLikes);
router.post('/:newsId/toggleonlike', toggleLikeOnNews);
router.get('/companyNews/:id', getCompanyNews);
router.put('/:id', editNews);
router.delete('/:id', deleteNews);

export default router;
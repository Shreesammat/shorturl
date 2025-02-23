import { Router } from 'express';
import { newLink, getRedirectInfo } from '../controllers/linkController.js'

const router = Router();

router.route("/newLink").post(newLink);
router.route('/getOriginal/:shortCode').get(getRedirectInfo);

export default router;
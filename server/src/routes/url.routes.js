import {Router} from 'express';
import { createUrl, redirection } from '../controller/url.controller.js';

const urlRouter = Router();


// urlRouter.get('/:shortCode', createUrl);

urlRouter.post('/', createUrl);

urlRouter.get('/:shortCode', redirection);

export default urlRouter;
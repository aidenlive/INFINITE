import { Router } from 'express';
import * as canvasController from '../controllers/canvasController.js';

const router = Router();

router.get('/', canvasController.getAllCanvases);
router.get('/:id', canvasController.getCanvasById);
router.post('/', canvasController.createCanvas);
router.put('/:id', canvasController.updateCanvas);
router.delete('/:id', canvasController.deleteCanvas);

export default router;

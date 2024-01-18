import express from 'express';
import {joyasController} from '../src/controllers/joyasController.js';
import {errorController} from '../src/controllers/errorController.js';

const router = express.Router();

router.get('/joyas', joyasController.getJoyas);
router.get('/joyas/filtros', joyasController.getJoyasFiltros);

router.use("*", errorController.error404);

export default router;

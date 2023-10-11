/*
api/models/index.js mounts all routes inside the models folder
these routes are mounted in ../../server.js on the route '/api/models'
*/
import { Router } from 'express';
import lab from './lab.js';
import clinic from './clinic.js';
import collaborator from './collaborator.js';
import inventory from './inventory.js';
import order from './order.js';
import service from './service.js';
import user from './user.js';
import pandaScan from './pandaScan.js';

import { UserGuard, AdminGuard  } from '../auth/routeGuard.js'


const router = Router();
router.use('/lab', UserGuard, lab);
router.use('/clinic',UserGuard, clinic);
router.use('/collaborator',UserGuard, collaborator);
router.use('/inventory',UserGuard, inventory);
router.use('/order',UserGuard, order);
router.use('/service',UserGuard, service);
router.use('/user', UserGuard, user);
router.use('/pandaScan', pandaScan);

export default router;
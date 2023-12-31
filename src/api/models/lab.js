import { Router } from 'express';
import { Lab } from '../../data/mongooseModels.js';

import { UserGuard, AdminGuard, LabGuard  } from '../auth/routeGuard.js'


const router = Router();

/**
 * @description return all labs
 * @param {Express<Request>} req the request object
 * @param {Express<Response>} res the response object
 */
router.get('/', (req, res) => {
        // #swagger.tags = ['Lab']

  Lab.find()
    .then((labs) => {
      if (!labs) {
        res.status(400).json({ message: 'No labs found' });
      } else res.json(labs);
    })
    .catch((err) => {
      res.status(500).json({ message: err });
    });
});

/**
 * @description return one lab
 * @param {Express<Request>} req the request object
 * @param {Express<Response>} res the response object
 */
router.get('/:id', LabGuard, (req, res) => {
          // #swagger.tags = ['Lab']

  Lab.findById(req.params.id)
    .then((lab) => {
      if (!lab) {
        res.status(400).json({ message: 'No lab found' });
      } else {
        res.json(lab);
      }
    })
    .catch((err) => {
      res.status(500).json({ message: err });
    });
});

/**
 * @description create one lab
 * @param {Express<Request>} req the request object
 * @param {Express<Response>} res the response object
 */
router.post('/', (req, res) => {
          // #swagger.tags = ['Lab']

  const lab = new Lab(req.body);
  lab.save()
    .then(() => {
      res.json(lab);
    })
    .catch((err) => {
      res.status(500).json({ message: err });
    });
});

/**
 * @description update one lab
 * @param {Express<Request>} req the request object
 * @param {Express<Response>} res the response object
 */
router.put('/:id', (req, res) => {
          // #swagger.tags = ['Lab']

  Lab.findOneAndUpdate({ _id: req.params.id }, { $set: req.body })
    .then(() => {
      res.json(true);
    })
    .catch((err) => {
      res.status(500).json({ code: 500, message: err });
    });
});

/**
 * @description delete one lab
 * @param {Express<Request>} req the request object
 * @param {Express<Response>} res the response object
 */
router.put('/:id', (req, res) => {
          // #swagger.tags = ['Lab']

  Lab.deleteOne({ _id: req.params.id })
    .then(() => {
      res.json(true);
    })
    .catch((err) => {
      res.status(500).json({ code: 500, message: err });
    });
});

export default router;
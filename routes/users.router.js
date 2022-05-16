const express = require('express');
const validatorHandler = require('../middlewares/validator.handler');
const { checkApiKey } = require('../middlewares/auth.handler');
const passport = require('passport');

const UserService = require('./../services/user.service');
const { createUserSchema, getUserSchema, updateUserSchema } = require('./../schemas/users.schema');

const router = express.Router();
const service = UserService.getInstance();

router.use(checkApiKey);

router.get('/', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  try {
    const users = await service.findAll();
    res.json(users);
  } catch (error) {
    next(error);
  }
});
router.post('/', validatorHandler(createUserSchema, 'body'), async (req, res, next) => {
  try {
    const body = req.body;
    const newUser = await service.create(body);
    res.json(newUser);
  } catch (error) {
    next(error);
  }
});

router.get('/available', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  try {
    const connection = await service.getAvailableUsersToConnect(req.user.sub);
    res.json(connection);
  } catch (error) {
    next(error);
  }
});
router.get('/connections', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  try {
    const connection = await service.getAcceptedConnections(req.user.sub);
    res.json(connection);
  } catch (error) {
    next(error);
  }
});
router.post('/connect', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  try {
    const data = {
      userId: req.user.sub,
      connectionId: req.body.connectionId,
    };
    const connection = await service.createConnection(data);
    res.json(connection);
  } catch (error) {
    next(error);
  }
});

router.post('/connect/accept', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  try {
    const accepted = await service.acceptConnection(req.body.connectionId, req.body);
    res.json(accepted);
  } catch (error) {
    next(error);
  }
});

router.post('/connect/delete', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  try {
    const accepted = await service.deleteConnection(req.body.connectionId);
    res.json(accepted);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', validatorHandler(getUserSchema, 'params'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const newUser = await service.findOne(id);
    res.json(newUser);
  } catch (error) {
    next(error);
  }
});

router.patch('/', passport.authenticate('jwt', { session: false }), validatorHandler(updateUserSchema, 'body'), async (req, res, next) => {
  try {
    const id = req.user.sub;
    const body = req.body;
    const user = await service.update(id, body);
    res.json(user);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', validatorHandler(getUserSchema, 'params'), async (req, res, next) => {
  try {
    const { id } = req.params;
    await service.delete(id);
    res.status(201).json({ id });
  } catch (error) {
    next(error);
  }
});

router.patch('/');

module.exports = router;

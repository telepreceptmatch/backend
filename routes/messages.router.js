const express = require('express');
const validatorHandler = require('../middlewares/validator.handler');
const { checkApiKey } = require('../middlewares/auth.handler');
const passport = require('passport');

const MessagesService = require('./../services/messages.service');
const { sendMessageSchema } = require('./../schemas/messages.schema');

const router = express.Router();
const service = MessagesService.getInstance();

router.use(checkApiKey);

router.get('/', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  try {
    const users = await service.getAllMessages(req.user.sub);
    res.json(users);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  try {
    const connectionId = req.params.id;
    const users = await service.getConversation(req.user.sub, connectionId);
    res.json(users);
  } catch (error) {
    next(error);
  }
});

router.post('/send', validatorHandler(sendMessageSchema, 'body'), passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  try {
    const body = req.body;
    console.log(body);
    const newUser = await service.sendMessage(req.user.sub, body);
    res.json(newUser);
  } catch (error) {
    next(error);
  }
});

router.get('/:userId', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  try {
    const connection = await service.getAvailableUsersToConnect(req.user.sub);
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

router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const newUser = await service.findOne(id);
    res.json(newUser);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
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

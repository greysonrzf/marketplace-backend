const express = require("express");
const validate = require("express-validation");
const handle = require("express-async-handler");

const authMiddleware = require("./app/middlewares/auth");
const {
  UserController,
  SessionController,
  AdController,
  PurchaseController
} = require("./app/controllers");

const { Ad, User, Session, Purchase } = require("./app/validators");

const routes = express.Router();

routes.get("/users", handle(UserController.index));
routes.post("/users", validate(User), handle(UserController.store));
routes.post("/sessions", validate(Session), handle(SessionController.store));

routes.use(authMiddleware);

/**
 * Ads
 */

routes.get("/ads", handle(AdController.index));
routes.get("/ads/:id", handle(AdController.show));
routes.post("/ads", validate(Ad), handle(AdController.store));
routes.put("/ads/:id", validate(Ad), handle(AdController.update));
routes.delete("/ads/:id", handle(AdController.destroy));

/**
 * Purchase
 */

routes.get("/purchases", handle(PurchaseController.index));
routes.post("/purchases", validate(Purchase), handle(PurchaseController.store));
routes.put("/accept/:id", handle(PurchaseController.accept));

module.exports = routes;

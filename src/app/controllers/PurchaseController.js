const Ad = require("../models/Ad");
const Purchase = require("../models/Purchase");
const User = require("../models/User");
const PurchaseMail = require("../jobs/PurchaseMail");
const Queue = require("../services/Queue");

class PurchaseController {
  async index(req, res) {
    const purchase = await Purchase.find();
    return res.json(purchase);
  }

  async store(req, res) {
    const { ad, content } = req.body;

    const purchaseAd = await Ad.findById(ad).populate("author");
    const user = await User.findById(req.userId);

    Queue.create(PurchaseMail.key, {
      ad: purchaseAd,
      user,
      content
    }).save();

    const purchase = await Purchase.create({
      ...req.body,
      interested: req.userId
    });

    return res.json(purchase);
  }

  async accept(req, res) {
    const sold = { ...req.body, purchasedBy: req.params.id };
    const ad = await Ad.findByIdAndUpdate(req.body.ad, sold, { new: true });
    return res.json(ad);
  }
}

module.exports = new PurchaseController();

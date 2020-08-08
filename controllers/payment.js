const stripe = require("stripe")(process.env.STRIPE_KEY);

exports.payment = async (req, res) => {
  const { id, product } = req.body;
  // const price = Number(product.price).toFixed(2);

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      // amount: +price * 100,
      amount: product.price * 100,
      currency: "usd",
      description: `Purchase of ${product.name} service`,
      payment_method: id,
      metadata: { integration_check: "accept_a_payment" },
    });
    res.status(200).send({ data: paymentIntent.client_secret });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message, statusCode: 500 });
  }
};

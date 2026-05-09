const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

app.get('/', (req, res) => res.send('TradieMate backend running.'));

app.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, trade, suburb, clientName, clientEmail } = req.body;

    if (!amount || amount < 100) {
      return res.status(400).json({ error: 'Invalid deposit amount.' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'aud',
      description: `TradieMate deposit — ${trade} job in ${suburb}`,
      receipt_email: clientEmail,
      metadata: { clientName, clientEmail, trade, suburb },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

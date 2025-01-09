import crypto from 'crypto';

export default function handler(req, res) {
    const email = req.query.email;
    const emailMd5 = crypto.createHash('md5').update(email).digest('hex');
    res.status(200).json({ emailMd5 });
  }
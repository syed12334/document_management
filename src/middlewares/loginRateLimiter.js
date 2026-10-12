const rateLimit = require('express-rate-limit');

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

const loginRateLimiter = rateLimit({
  windowMs: WINDOW_MS,
  limit: 5,                    
  skipSuccessfulRequests: true, 

  standardHeaders: true,
  legacyHeaders: false,

  handler: (req, res) => {
    const resetTime = req.rateLimit?.resetTime;
    const msLeft = resetTime ? resetTime.getTime() - Date.now() : WINDOW_MS;
    const minutes = Math.max(1, Math.ceil(msLeft / 60000));

    const message =
      `Too many login attempts. You are blocked for ${minutes} minute${minutes > 1 ? 's' : ''}. ` +
      `Please try again later.`;

    res.set('Retry-After', String(minutes * 60));

    if (req.accepts(['html', 'json']) === 'html') {
      return res.status(429).render('auth/login', {
        title: 'Login',
        layout: false,
        errors: { invalid: message },          
        old: { email: req.body?.email || '' } 
      });
    }

    return res.status(429).json({ success: false, message });
  }
});

module.exports = loginRateLimiter;
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const { Pool } = require('pg');
const expressLayouts = require('express-ejs-layouts');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const csurf = require('csurf');
const methodOverride = require('method-override');
const multer = require('multer');
const { notFoundHandler, errorHandler } = require('./middlewares/error.middleware');
const pgPool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'document_management',
  password: 'admin',
  port: 5432
});

// Routes
const dashboardRoute = require('./routes/dashboardRoute');
const authRoutes = require('./routes/authRoutes');
const loginHistoryRoutes = require('./routes/loginHistoryRoutes');
const auditLogRoutes = require('./routes/auditLogRoutes');
const folderRoutes = require('./routes/folderRoutes');
const documentRoutes = require('./routes/documentRoutes');
const roleRoutes = require('./routes/roleRoutes');
const permissionRoutes = require('./routes/permissionRoutes');
const userRoutes = require('./routes/userRoutes');
const rolePermissionRoutes = require('./routes/rolePermissionRoutes');

// --------------------------------------------------
// Load environment variables FIRST
// --------------------------------------------------
dotenv.config();

const app = express();
const PORT = process.env.PORT || 6987;

// --------------------------------------------------
// Security
// --------------------------------------------------

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "script-src":      ["'self'", "'unsafe-inline'", "https://code.jquery.com", "https://cdn.jsdelivr.net"],
      "script-src-attr": ["'unsafe-inline'"], // your onclick="..." handlers need this
      "style-src":       ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
      "font-src":        ["'self'", "https://cdn.jsdelivr.net", "data:"],
      "img-src":         ["'self'", "data:"]
    }
  }
}));

// --------------------------------------------------
// Performance
// --------------------------------------------------
app.use(compression());

// --------------------------------------------------
// Body Parser
// --------------------------------------------------
app.use(express.urlencoded({ extended: true }));
app.use(express.json());



// --------------------------------------------------
// Session
// --------------------------------------------------
app.use(session({
  store: new pgSession({
    pool: pgPool,
    tableName: 'session',
    createTableIfMissing: true
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    httpOnly: true,
    secure: false // keep false unless you're on HTTPS
  }
}));
// --------------------------------------------------
// Cookie Parser
// --------------------------------------------------
app.use(cookieParser());
app.use((req, res, next) => {
    res.locals.success = req.session.success;
    res.locals.error = req.session.error;
    delete req.session.success;
    delete req.session.error;
    next();
});

// --------------------------------------------------
// View Engine
// --------------------------------------------------
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// --------------------------------------------------
// Static Files (BEFORE csrf — static assets never need CSRF)
// --------------------------------------------------
app.use(express.static(path.join(__dirname, 'public')));

// --------------------------------------------------
// CSRF Protection — applied EXACTLY ONCE here
// --------------------------------------------------
// Upload routes (/documents/saveFile POST, /documents/:id PUT) are
// multipart/form-data, so express.urlencoded()/express.json() can't
// parse their body — req.body._csrf is empty here regardless of what
// the form sent. Those routes are skipped here and instead validated
// in documentRoutes.js, AFTER multer parses the body.
const csrfProtection = csurf({ cookie: false });

function isMultipartUploadRoute(req) {
    return (
        (req.path === '/documents/saveFile' && req.method === 'POST') ||
        (/^\/documents\/update\/[^/]+$/.test(req.path) && req.method === 'POST')
    );
}
app.use((req, res, next) => {
    if (isMultipartUploadRoute(req)) {
        // documentRoutes.js will run multer first,
        // then csrfProtection
        return next();
    }

    csrfProtection(req, res, next);
});

// Generate CSRF token for normal requests
app.use((req, res, next) => {
    if (typeof req.csrfToken === 'function') {
        res.locals.csrfToken = req.csrfToken();
    }

    next();
});

// Make APP_URL available in every EJS template
app.use((req, res, next) => {
    res.locals.appUrl = process.env.APP_URL;
    next();
});

// --------------------------------------------------
// Layout
// --------------------------------------------------
app.use(expressLayouts);
app.set('layout', 'layouts/main');
app.use('/storage/documents', express.static(
    path.join(__dirname, 'storage/documents'),
    {
        setHeaders: (res, filePath) => {
            // Force browser to display inline instead of downloading
            res.setHeader('Content-Disposition', 'inline');

            // Ensure PDFs get the correct MIME type
            if (filePath.endsWith('.pdf')) {
                res.setHeader('Content-Type', 'application/pdf');
            }
        }
    }
));
// --------------------------------------------------
// Routes
// --------------------------------------------------
app.use('/', dashboardRoute);

app.use('/login', authRoutes);
app.use('/user/login/logs', loginHistoryRoutes);
app.use('/audit/logs', auditLogRoutes);
app.use('/folders', folderRoutes);
app.use('/documents', documentRoutes);
app.use('/roles', roleRoutes);
app.use('/permissions', permissionRoutes);
app.use('/users', userRoutes);
app.use('/role/permission', rolePermissionRoutes);

// --------------------------------------------------
// Global Error Handler
// --------------------------------------------------
app.use((err, req, res, next) => {
    if (err.code === 'EBADCSRFTOKEN') {
        console.error('CSRF validation failed:', req.method, req.path);
        return res.status(403).send('Form has expired or is invalid. Please refresh the page and try again.');
    }
    if (err instanceof multer.MulterError || err.code === 'INVALID_FILE_TYPE') {
        console.error('Upload error:', err.message);
        return res.status(400).send(err.message);
    }
    console.error(err);
    res.status(500).send('Something went wrong.');
});

app.use(notFoundHandler);
app.use(errorHandler);
// 500 error messages
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).render('errors/500', {
    message: 'Something went wrong. Please try again later.'
  });
});
// --------------------------------------------------
// Start Server
// --------------------------------------------------
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
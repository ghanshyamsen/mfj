const muterMiddleware = (req, res, next) => {
    // Perform muting or any other operation on the request
    console.log('Muter middleware called');
    // You can modify request data here if needed
    // Example: req.body.muted = true;

    // Call next() to pass control to the next middleware or route handler
    next();
};

module.exports = muterMiddleware;
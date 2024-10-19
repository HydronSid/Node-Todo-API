module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(res, err);
  }
  if (process.env.NODE_ENV === "production") {
    // let error = { ...err };
    // console.log(error);

    if (err.name === "CastError") err = handleCastErrorDB(err);
    if (err.code === 11000) err = handleDuplicateFieldsErrorDB(err);
    if (err.name === "ValidationError") err = handleValidationErrorDB(err);
    //   if (err.name === 'JsonWebTokenError') err = handleJWTError();
    //   if (err.name === 'TokenExpiredError') err = handleJWTExpiredError();
    sendErrorProd(res, err);
  }
};

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path} : ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsErrorDB = (err) => {
  const value = err.errmsg.match(/(["']).*\1(?![^\s])/)[0];
  console.log(value);
  const message = `Duplicate field value : ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((e) => e.message);
  const message = `Invalid input Data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const sendErrorDev = (res, err) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (res, err) => {
  // Operation Errors , trusted error : send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // 1) Log Error
    console.error("ERROR ", err);
    // 2) Send Generaic message
    // Programming or other unknown error : dont leak error details.
    res.status(500).json({
      status: "error",
      message: "Something went Wrong.",
    });
  }
};

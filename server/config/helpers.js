/** @module config/helpers */
module.exports = {
 
 /**
  * 
  * @description log the error then send it to the next middleware 
  * in middleware.js
  * @param {Object} error - The error object
  * @param {Object} req - The request object
  * @param {Object} res - The response obejct.
  * @param {Function} next - When done, for async
  */
  errorLogger: function (error, req, res, next) {
    console.error(error.stack);
    next(error);
  },

  /**
   * 
   * @description send error message to client 
   * message for gracefull error handling on app
   * 
   * @param {Object} error - The error object
   * @param {Object} req - The request object
   * @param {Object} res - The response obejct.
   * @param {Function} next - When done, for async
   */
  errorHandler: function (error, req, res, next) {
    res.send(500, {error: error.message});
  }

};
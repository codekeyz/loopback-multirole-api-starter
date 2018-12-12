'use strict';
module.exports.ensureIDSame =
  function(model, methodsToensureIDSame) {
    if (model) {
      methodsToensureIDSame = methodsToensureIDSame || [];
      methodsToensureIDSame.forEach(function(method) {
        model.beforeRemote(method, function(context, user, next) {
          let req = context.req;
          // console.log('UserID from Access Token', req.accessToken.userId);
          let userID = req.accessToken.userId.toString();
          let userIDfromPath = req.path.split('/')[1].toString();
          if (userIDfromPath === userID) {
            next();
          } else {
            const error = new Error();
            error.status = 401;
            error.message = 'Authorization required';
            error.code = 'AUTHORIZATION REQUIRED';
            next(error);
          }
        });
      });
    }
  };

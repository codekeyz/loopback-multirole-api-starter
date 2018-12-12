"use strict";
let disableAllMethods = require("../helpers/disableRoutes").disableAllMethods;

module.exports = function(Baseuser) {
  // Enable only these endpoints
  disableAllMethods(Baseuser, [
    "login",
    "logout",
    "changePassword",
    "create",
    "patchAttributes",
    "findById",
    "count",
    "get",
    "find"
  ]);
};

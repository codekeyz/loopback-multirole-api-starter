module.exports = function(Model, options) {
  var modelName = Model.definition.name; //Get the Model Name from Model Instance
  Model.observe("before save", function(ctx, next) {
    if (!ctx.isNewInstance) {
      next();
    } else {
      Model.getDataSource().connector.connect(function(err, db) {
        var collection = db.collection("counter");
        collection.findAndModify(
          { name: modelName },
          [["_id", "asc"]],
          { $inc: { value: 1 } },
          { new: true, upsert: true },
          function(err, rec) {
            if (err) {
              console.err(err);
              next();
            } else {
              getPrimaryKeyFromModel(Model, function(primaryKey) {
                if (ctx.instance) {
                  ctx.instance[primaryKey] = rec.value.value.toString(10);
                } else {
                  ctx.data[primaryKey] = rec.value.value.toString(10);
                }
                next();
              });
            }
          }
        );
      });
    }
  });
};
//Get the Primary Key from Model
var getPrimaryKeyFromModel = function(Model, cb) {
  var properties = Model.definition.rawProperties;
  Object.keys(properties).forEach(function(key) {
    if (properties[key].id === true) {
      cb(key);
    }
  });
};

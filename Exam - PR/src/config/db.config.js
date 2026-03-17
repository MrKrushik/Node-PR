const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("Database is connected successfully😊😊...");
}).catch((err) => {
    console.log("Database is not connected🤦‍♂️😒...");
    console.log("Error : ", err);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json(errorResponse(statusCode.INTERNAL_SERVER_ERROR, true, MSG.SERVER_ERROR));

});
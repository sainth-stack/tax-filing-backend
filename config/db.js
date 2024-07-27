import mongoose from "mongoose";
import { DATABASE_URL } from "./environment.js";

//const AuditTrailModel = require("../models/AuditTrail");

//const saveChangedData = async (change) => {
//  console.log("change document", change)
//  let newChangeData = await AuditTrailModel({
//    dataDocument: change.fullDocument ? change.fullDocument : change.updateDescription,
//    operation: change.operationType,
//    collectionName: change.ns.coll,
//    userId: change.fullDocument ? change.fullDocument.userId : change.updateDescription.userId,
//    featureName: change.fullDocument ? change.fullDocument.featureName : change.updateDescription.featureName
//  })
//  newChangeData.save().then((res, err) => {
//    if (!err) {
//      console.log("Saved Data");
//    } else {
//      console.log("audit trail error", err);
//    }
//  })
//}

const connectDB = async () => {
  console.log(DATABASE_URL);
  try {
    await mongoose
      .connect(DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // useCreateIndex: true,
      })
      .then((res) => {
        //const TaskModelChange = res.models.tasks2.watch();
        //TaskModelChange.on("change", (change) => {
        //  saveChangedData(change);
        //});
        console.log("MongoDB Database Connection Success!");
        console.log(DATABASE_URL);
      });
  } catch (err) {
    console.log("MongoDB Database Connection Failed!", err.message);
  }
};

export default connectDB;

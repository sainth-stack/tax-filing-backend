import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
  companyDetails: {
    companyName: { type: String, required: true },
    constitution: { type: String, required: true },
    clientStatus: { type: String, required: true },
    authorisedPerson: { type: String, required: true },
    phone: { type: String, required: true },
    mailId: { type: String, required: true },
  },
  incomeTax: {
    pan: { type: String, required: true },
    incomeTaxPassword: { type: String, required: true },
  },
  gst: {
    gstin: { type: String, required: true },
    gstUserName: { type: String, required: true },
    gstPassword: { type: String, required: true },
    gstStatus: { type: String, required: true },
    eWayBillUsername: { type: String, required: true },
    eWayBillPassword: { type: String, required: true },
  },
  esi: {
    esiNumber: { type: String, required: true },
    esiUserId: { type: String, required: true },
    esiPassword: { type: String, required: true },
  },
  providentFund: {
    pfNumber: { type: String, required: true },
    pfUserId: { type: String, required: true },
    pfPassword: { type: String, required: true },
  },
  professionalTax: {
    ptEcNumber: { type: String, required: true },
    ptUsername: { type: String, required: true },
    ptPassword: { type: String, required: true },
    ptNumber: { type: String, required: true },
  },
  tds: {
    tan: { type: String, required: true },
    tanPassword: { type: String, required: true },
    tracesUsername: { type: String, required: true },
    tracesPassword: { type: String, required: true },
  },
  shopCommercialEstablishment: {
    seNumber: { type: String, required: true },
    seUsername: { type: String, required: true },
    sePassword: { type: String, required: true },
    seRenewalDate: { type: Date, required: true },
  },
  msme: {
    msmeNumber: { type: String, required: true },
  },
  fssai: {
    fssaiNumber: { type: String, required: true },
    fssaiUsername: { type: String, required: true },
    fssaiPassword: { type: String, required: true },
    fssaiRenewalDate: { type: Date, required: true },
  },
  factoryLicense: {
    flNumber: { type: String, required: true },
    flUsername: { type: String, required: true },
    flPassword: { type: String, required: true },
    flRenewalDate: { type: Date, required: true },
  },
  importExport: {
    iecNumber: { type: String, required: true },
    dgftUsername: { type: String, required: true },
    dgftPassword: { type: String, required: true },
    icegateUsername: { type: String, required: true },
    icegatePassword: { type: String, required: true },
  },
  partnershipFirmFormC: {
    formCNumber: { type: String, required: true },
  },
  shramSuvidhaPortal: {
    lin: { type: String, required: true },
    ssUsername: { type: String, required: true },
    ssPassword: { type: String, required: true },
  },
  mca: {
    cin: { type: String, required: true },
    mcaUsername: { type: String, required: true },
    mcaPassword: { type: String, required: true },
    bankOverdraftCashCreditRenewalDate: { type: Date, required: true },
  },
});
const companyModel = mongoose.model("Company", companySchema);
export default companyModel;

import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
  companyDetails: {
    companyName: { type: String },
    constitution: { type: String },
    clientStatus: { type: String },
    authorisedPerson: { type: String },
    phone: { type: String },
    mailId: { type: String },
  },
  incomeTax: {
    pan: { type: String },
    incomeTaxPassword: { type: String },
  },
  gst: {
    gstin: { type: String },
    gstUserName: { type: String },
    gstPassword: { type: String },
    gstStatus: { type: String },
    eWayBillUsername: { type: String },
    eWayBillPassword: { type: String },
  },
  esi: {
    esiNumber: { type: String },
    esiUserId: { type: String },
    esiPassword: { type: String },
  },
  providentFund: {
    pfNumber: { type: String },
    pfUserId: { type: String },
    pfPassword: { type: String },
  },
  professionalTax: {
    ptEcNumber: { type: String },
    ptUsername: { type: String },
    ptPassword: { type: String },
    ptNumber: { type: String },
  },
  tds: {
    tan: { type: String },
    tanPassword: { type: String },
    tracesUsername: { type: String },
    tracesPassword: { type: String },
  },
  shopCommercialEstablishment: {
    seNumber: { type: String },
    seUsername: { type: String },
    sePassword: { type: String },
    seRenewalDate: { type: String },
  },
  msme: {
    msmeNumber: { type: String },
  },
  fssai: {
    fssaiNumber: { type: String },
    fssaiUsername: { type: String },
    fssaiPassword: { type: String },
    fssaiRenewalDate: { type: String },
  },
  factoryLicense: {
    flNumber: { type: String },
    flUsername: { type: String },
    flPassword: { type: String },
    flRenewalDate: { type: String },
  },
  importExport: {
    iecNumber: { type: String },
    dgftUsername: { type: String },
    dgftPassword: { type: String },
    icegateUsername: { type: String },
    icegatePassword: { type: String },
  },
  partnershipFirmFormC: {
    formCNumber: { type: String },
  },
  shramSuvidhaPortal: {
    lin: { type: String },
    ssUsername: { type: String },
    ssPassword: { type: String },
  },
  mca: {
    cin: { type: String },
    mcaUsername: { type: String },
    mcaPassword: { type: String },
    bankOverdraftCashCreditRenewalDate: { type: String },
  },
  attachements: {
    panFile: { type: String, default: '' },
    gstFile: { type: String, default: '' },
    esiFile: { type: String, default: '' },
    pfFile: { type: String, default: '' },
    ptFile: { type: String, default: '' },
    tanFile: { type: String, default: '' },
    shopEstablishmentFile: { type: String, default: '' },
    msmeFile: { type: String, default: '' },
    fssaiFile: { type: String, default: '' },
    factoryLicenseFile: { type: String, default: '' },
    importExportFile: { type: String, default: '' },
    partnershipFormcFile: { type: String, default: '' },
    shramSuvidhaFile: { type: String, default: '' },
    mcaFile: { type: String, default: '' },
    cinFile: { type: String, default: '' },
  }
});
const companyModel = mongoose.model("Company", companySchema);
export default companyModel;

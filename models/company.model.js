const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const companySchema = new Schema({
  companyDetails: {
    companyName: String,
    constitution: String,
    clientStatus: String,
    authorisedPerson: String,
    phone: String,
    mailId: String
  },
  incomeTax: {
    incomeTaxNumber: String,
    pan: String,
    incomeTaxPassword: String
  },
  gst: {
    gstin: String,
    gstUserName: String,
    gstPassword: String,
    gstStatus: String,
    eWayBillUsername: String,
    eWayBillPassword: String
  },
  esi: {
    esiNumber: String,
    esiUserId: String,
    esiPassword: String
  },
  providentFund: {
    pfNumber: String,
    pfUserId: String,
    pfPassword: String
  },
  professionalTax: {
    ptNumber: String,
    ptEcNumber: String,
    ptUsername: String,
    ptPassword: String
  },
  tds: {
    tan: String,
    tanPassword: String,
    tracesUsername: String,
    tracesPassword: String
  },
  shopCommercialEstablishment: {
    seNumber: String,
    seUsername: String,
    sePassword: String,
    seRenewalDate: String
  },
  msme: {
    msmeNumber: String
  },
  fssai: {
    fssaiNumber: String,
    fssaiUsername: String,
    fssaiPassword: String,
    fssaiRenewalDate: String
  },
  factoryLicense: {
    flNumber: String,
    flUsername: String,
    flPassword: String,
    flRenewalDate: String
  },
  importExport: {
    iecNumber: String,
    dgftUsername: String,
    dgftPassword: String,
    icegateUsername: String,
    icegatePassword: String
  },
  partnershipFirmFormC: {
    formCNumber: String
  },
  shramSuvidhaPortal: {
    lin: String,
    ssUsername: String,
    ssPassword: String
  },
  mca: {
    mcaCin: String,
    mcaUsername: String,
    mcaPassword: String,
    bankOverdraftCashCreditRenewalDate: String
  },
  attachments: {
    pan: String,
    gst: String,
    esi: String,
    providentFund: String,
    professionalTax: String,
    tan: String,
    shopCommercialEstablishment: String,
    msme: String,
    fssai: String,
    factoryLicense: String,
    importExport: String,
    partnershipFirmFormC: String,
    shramSuvidha: String,
    mca: String,
    cin: String
  }
});

module.exports = mongoose.model('Company', companySchema);

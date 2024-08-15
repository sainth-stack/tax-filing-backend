import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    companyDetails: {
      companyName: { type: String },
      constitution: { type: String },
      subConstitution: { type: String },
      clientStatus: { type: String },
      authorisedPerson: { type: String },
      phone: { type: String },
      mailId: { type: String },
    },

    incomeTax: {
      pan: { type: String },
      incomeTaxPassword: { type: String },
      status: { type: String },
      effectiveFrom: { type: String },
      effectiveTo: { type: String },
    },

    gst: {
      gstin: { type: String },
      gstUserName: { type: String },
      gstPassword: { type: String },
      status: { type: String },
      eWayBillUsername: { type: String },
      eWayBillPassword: { type: String },
      effectiveFrom: { type: String },
      effectiveTo: { type: String },
      typeOfGstFiling: { type: String },
    },

    esi: {
      esiNumber: { type: String },
      esiUserId: { type: String },
      esiPassword: { type: String },
      status: { type: String },
      effectiveFrom: { type: String },
      effectiveTo: { type: String },
    },

    providentFund: {
      pfNumber: { type: String },
      pfUserId: { type: String },
      pfPassword: { type: String },
      status: { type: String },
      effectiveFrom: { type: String },
      effectiveTo: { type: String },
    },

    professionalTax: {
      ptEcNumber: { type: String },
      ptUsername: { type: String },
      ptPassword: { type: String },
      ptNumber: { type: String },
      status: { type: String },
      effectiveFrom: { type: String },
      effectiveTo: { type: String },
    },

    tds: {
      tan: { type: String },
      tanPassword: { type: String },
      tracesUsername: { type: String },
      tracesPassword: { type: String },
      status: { type: String },
      effectiveFrom: { type: String },
      effectiveTo: { type: String },
    },

    shopCommercialEstablishment: {
      seNumber: { type: String },
      seUsername: { type: String },
      sePassword: { type: String },
      seRenewalDate: { type: String },
      status: { type: String },
      effectiveFrom: { type: String },
      effectiveTo: { type: String },
    },

    msme: {
      msmeNumber: { type: String },
      status: { type: String },
      effectiveFrom: { type: String },
      effectiveTo: { type: String },
    },

    fssai: {
      fssaiNumber: { type: String },
      fssaiUsername: { type: String },
      fssaiPassword: { type: String },
      fssaiRenewalDate: { type: String },
      status: { type: String },
      effectiveFrom: { type: String },
      effectiveTo: { type: String },
    },

    factoryLicense: {
      flNumber: { type: String },
      flUsername: { type: String },
      flPassword: { type: String },
      flRenewalDate: { type: String },
      status: { type: String },
      effectiveFrom: { type: String },
      effectiveTo: { type: String },
    },

    importExport: {
      iecNumber: { type: String },
      dgftUsername: { type: String },
      dgftPassword: { type: String },
      icegateUsername: { type: String },
      icegatePassword: { type: String },
      status: { type: String },
      effectiveFrom: { type: String },
      effectiveTo: { type: String },
    },

    partnershipFirmFormC: {
      formCNumber: { type: String },
      status: { type: String },
      effectiveFrom: { type: String },
      effectiveTo: { type: String },
    },

    shramSuvidhaPortal: {
      lin: { type: String },
      ssUsername: { type: String },
      ssPassword: { type: String },
      status: { type: String },
      effectiveFrom: { type: String },
      effectiveTo: { type: String },
    },

    mca: {
      cin: { type: String },
      mcaUsername: { type: String },
      mcaPassword: { type: String },
      bankOverdraftCashCreditRenewalDate: { type: String },
      status: { type: String },
      effectiveFrom: { type: String },
      effectiveTo: { type: String },
    },

    attachments: {
      panFile: { type: String, default: "" },
      gstFile: { type: String, default: "" },
      esiFile: { type: String, default: "" },
      pfFile: { type: String, default: "" },
      ptFile: { type: String, default: "" },
      tanFile: { type: String, default: "" },
      shopEstablishmentFile: { type: String, default: "" },
      msmeFile: { type: String, default: "" },
      fssaiFile: { type: String, default: "" },
      factoryLicenseFile: { type: String, default: "" },
      importExportFile: { type: String, default: "" },
      partnershipFormcFile: { type: String, default: "" },
      shramSuvidhaFile: { type: String, default: "" },
      mcaFile: { type: String, default: "" },
      cinFile: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

const companyModel = mongoose.model("Company", companySchema);
export default companyModel;

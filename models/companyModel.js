import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    companyDetails: {
      companyName: {
        type: String,
        required: [true, "Company name is required"],
      },

      constitution: {
        type: String,
        // required: [true, "Constitution  is required"],
      },
      subConstitution: {
        type: String,
        // required: [true, "SubConstitution  is required"],
      },
      clientStatus: {
        type: String,
        // required: [true, "ClientStatus  is required"],
      },
      authorisedPerson: {
        type: String,
        // required: [true, "AuthorisedPerson  is required"],
      },
      phone: {
        type: String,
        // required: [true, "Phone  is required"],
      },
      mailId: {
        type: String,
        required: [true, "MailId  is required"],
      },
      pan: {
        type: String,
        required: [true, "Pan  is required"],
      },
      companyAddress: { type: String },
      effectiveFrom: {
        type: String,
        // required: [true, "EffectiveFrom  is required"],
      },
      effectiveTo: {
        type: String,
        // required: [true, "EffectiveTo  is required"],
      },
    },

    incomeTax: {
      incomeTaxPassword: {
        type: String,
        // required: [true, "Income TaxPassword is required"],
      },
      incomeTraceTaxUsername: {
        type: String,
        // required: [true, "Income TraceTax Username is required"],
      },
      incomeTraceTaxPassword: {
        type: String,
        // required: [true, "Income TraceTax Password is required"],
      },
      status: {
        type: String,
        // required: [true, "Status is required"]
      },
      effectiveFrom: {
        type: String,
        // required: [true, "EffectiveFrom is required"],
      },
      effectiveTo: {
        type: String,
        // required: [true, "EffectiveTo is required"],
      },
      approvalCertificate: {
        type: String,
        default: "",
      },
    },

    gst: {
      gstin: {
        type: String,
        // required: [true, "GSTIN is required"]
      },
      gstUserName: {
        type: String,
        // required: [true, "GST UserName is required"],
      },
      gstPassword: {
        type: String,
        // required: [true, "GST Password is required"],
      },
      status: {
        type: String,
        // required: [true, "Status is required"]
      },
      state: {
        type: String,
        // required: [true, "State is required"],
      },
      eWayBillUsername: {
        type: String,
        // required: [true, "EWayBill Username is required"],
      },
      eWayBillPassword: {
        type: String,
        // required: [true, "EWayBill Password is required"],
      },
      effectiveFrom: {
        type: String,
        // required: [true, "EffectiveFrom is required"],
      },
      effectiveTo: {
        type: String,
        // required: [true, "EffectiveTo is required"],
      },
      typeOfGstFiling: {
        type: String,
        // required: [true, "TypeOfGstFiling is required"],
      },
      dueDateReturn: { type: String },
      approvalCertificate: {
        type: String,
        default: "",
      },
    },

    esi: {
      esiNumber: { type: String,
        // required: [true, "Esi Number is required"]
      },
      esiUserId: { type: String,
        // required: [true, "Esi UserId is required"]
      },
      esiPassword: {
        type: String,
        // required: [true, "Esi Password is required"],
      },
      status: {
        type: String,
        // required: [true, "Status is required"]
      },
      effectiveFrom: {
        type: String,
        // required: [true, "EffectiveFrom is required"],
      },
      effectiveTo: {
        type: String,
        // required: [true, "EffectiveTo is required"],
      },
      approvalCertificate: {
        type: String,
        default: "",
      },
    },

    providentFund: {
      pfNumber: { type: String, 
        // required: [true, "PF Number is required"]
       },
      pfUserId: { type: String, 
        // required: [true, "PF UserId is required"]
       },
      pfPassword: { type: String,
        //  required: [true, "PF Password is required"]
         },
      status: { type: String,
        //  required: [true, "Status is required"]
         },
      effectiveFrom: {
        type: String,
        // required: [true, "EffectiveFrom is required"],
      },
      effectiveTo: {
        type: String,
        // required: [true, "EffectiveTo is required"],
      },
      approvalCertificate: {
        type: String,
        default: "",
      },
    },

    professionalTax: {
      ptEcNumber: {
        type: String,
      },
      ptUsername: {
        type: String,
        // required: [true, "PT Username is required"]
      },

      ptPassword: {
        type: String,
        // required: [true, "PT Password is required"]
      },
      ptEcUsername: {
        type: String,
        // required: [true, "PT EC Username is required"],
      },
      ptEcPassword: {
        type: String,
        // required: [true, "PT EC Password is required"],
      },

      ptNumber: {
        type: String,
        // required: [true, "PT Number is required"]
      },
      status: {
        type: String,
        // required: [true, "Status is required"]
      },
      effectiveFrom: {
        type: String,
        // required: [true, "EffectiveFrom is required"],
      },
      effectiveTo: {
        type: String,
        // required: [true, "EffectiveTo is required"],
      },
      approvalCertificate: {
        type: String,
        default: "",
      },
    },

    tds: {
      tan: {
        type: String,
        // required: [true, "TAN is required"]
      },
      tanPassword: {
        type: String,
        // required: [true, "TAN Password is required"],
      },
      tracesUsername: {
        type: String,
        // required: [true, "Traces Username is required"],
      },
      tracesPassword: {
        type: String,
        // required: [true, "Traces Password is required"],
      },
      status: {
        type: String,
        // required: [true, "Status is required"]
      },
      effectiveFrom: {
        type: String,
        // required: [true, "EffectiveFrom is required"],
      },
      effectiveTo: {
        type: String,
        // required: [true, "EffectiveTo is required"],
      },
      approvalCertificate: {
        type: String,
        default: "",
      },
    },

    shopCommercialEstablishment: {
      seNumber: {
        type: String,
        // required: [true, "SE Number is required"]
      },
      seUsername: {
        type: String,
        // required: [true, "SE Username is required"]
      },
      sePassword: {
        type: String,
        // required: [true, "SE Password is required"]
      },
      seRenewalDate: {
        type: String,
        // required: [true, "SE Renewal Date is required"],
      },
      status: {
        type: String,
        // required: [true, "Status is required"]
      },
      effectiveFrom: {
        type: String,
        
        // required: [true, "EffectiveFrom is required"],
      },
      effectiveTo: {
        type: String,
        // required: [true, "EffectiveTo is required"],
      },
      approvalCertificate: {
        type: String,
        default: "",
      },
    },

    msme: {
      msmeNumber: {
        type: String,
        // required: [true, "MSME Number is required"]
      },
      status: {
        type: String,
        // required: [true, "Status is required"]
      },
      effectiveFrom: {
        type: String,
        // required: [true, "EffectiveFrom is required"],
      },
      effectiveTo: {
        type: String,
        // required: [true, "EffectiveTo is required"],
      },
      approvalCertificate: {
        type: String,
        default: "",
      },
    },

    fssai: {
      fssaiNumber: {
        type: String,
        // required: [true, "FSSAI Number is required"],
      },
      fssaiUsername: {
        type: String,
        // required: [true, "FSSAI Username is required"],
      },
      fssaiPassword: {
        type: String,
        // required: [true, "FSSAI Password is required"],
      },
      fssaiRenewalDate: {
        type: String,
        // required: [true, "FSSAI Renewal Date is required"],
      },
      status: {
        type: String,
        // required: [true, "Status is required"]
      },
      effectiveFrom: {
        type: String,
        // required: [true, "EffectiveFrom is required"],
      },
      effectiveTo: {
        type: String,
        // required: [true, "EffectiveTo is required"],
      },
      approvalCertificate: {
        type: String,
        default: "",
      },
    },

    factoryLicense: {
      flNumber: { type: String, 
        // required: [true, "FL Number is required"] 
      },
      flUsername: { type: String, 
        // required: [true, "FL Username is required"] 
      },
      flPassword: { type: String,
        //  required: [true, "FL Password is required"] 
        },
      flRenewalDate: {
        type: String,
        // required: [true, "FL Renewal Date is required"],
      },
      status: {
        type: String,
        // required: [true, "Status is required"]
      },
      effectiveFrom: {
        type: String,
        // required: [true, "EffectiveFrom is required"],
      },
      effectiveTo: {
        type: String,
        // required: [true, "EffectiveTo is required"],
      },
      approvalCertificate: {
        type: String,
        default: "",
      },
    },

    importExport: {
      iecNumber: {
        type: String,
        // required: [true, "IEC Number is required"]
      },
      dgftUsername: {
        type: String,
        // required: [true, "DGFT Username is required"],
      },
      dgftPassword: {
        type: String,
        // required: [true, "DGFT Password is required"],
      },
      icegateUsername: {
        type: String,
        // required: [true, "ICEGATE Username is required"],
      },
      icegatePassword: {
        type: String,
        // required: [true, "ICEGATE Password is required"],
      },
      status: {
        type: String,
        // required: [true, "Status is required"]
      },
      effectiveFrom: {
        type: String,
        // required: [true, "EffectiveFrom is required"],
      },
      effectiveTo: {
        type: String,
        // required: [true, "EffectiveTo is required"],
      },
      approvalCertificate: {
        type: String,
        default: "",
      },
    },

    partnershipFirmFormC: {
      formCNumber: { type: String },
      status: { type: String },
      effectiveFrom: { type: String },
      effectiveTo: { type: String },
      approvalCertificate: {
        type: String,
        default: "",
      },
    },

    shramSuvidhaPortal: {
      lin: { type: String },
      ssUsername: { type: String },
      ssPassword: { type: String },
      status: { type: String },
      effectiveFrom: { type: String },
      effectiveTo: { type: String },
      approvalCertificate: {
        type: String,
        default: "",
      },
    },

    mca: {
      cin: { type: String },
      mcaUsername: { type: String },
      mcaPassword: { type: String },
      bankOverdraftCashCreditRenewalDate: { type: String },
      status: { type: String },
      effectiveFrom: { type: String },
      effectiveTo: { type: String },
      approvalCertificate: {
        type: String,
        default: "",
      },
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

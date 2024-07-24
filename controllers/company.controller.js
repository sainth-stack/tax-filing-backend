const CompanyModel = require('../models/company.model');
const successResponse = ({ message, data }) => ({ success: true, data: data ? data : null, message });
const failResponse = ({ message, data }) => ({ success: false, data: data ? data : null, message });

const createCompany = async (req, res) => {
  // #swagger.tags = ['Company']
  try {
    let requestBody = {
      userId: req.body.userId ? req.body.userId : 1,
      companyEntityName: req.body.companyEntityName,
      industry: req.body.industry,
      status: req.body.status,
      country: req.body.country
    }
    const newCompany = new CompanyModel(requestBody);
    await newCompany.save();
  } catch (err) {
    res.status(500).send(
      failResponse({
        message: err ? err.message : "Company Not Created!"
      })
    );
  }
};

const createOrUpdateMultipleCompanies = async (req, res) => {
  // #swagger.tags = ['Company']
  try {
    const items = req.body.data;
    var ops = [];
    items.forEach(item => {
      if (item._id) {
        ops.push(
          {
            updateOne: {
              filter: { _id: item._id },
              update: {
                $set: item,
              },
              upsert: true
            }
          }
        );
      } else {
        ops.push(
          {
            insertOne: {
              document: item
            }
          }
        )
      }
    })
    await CompanyModel.bulkWrite(ops, { ordered: false });
    res.status(200).send(
      successResponse({
        message: 'Companies Created Successfully!',
      })
    );
  } catch (err) {
    res.status(500).send(
      failResponse({
        message: err ? err.message : "Companies Not Created!"
      })
    );
  }
};

const updateCompany = async (req, res) => {
  // #swagger.tags = ['Company']
  try {
    const company = await CompanyModel.findById(req.params.id);
    if (company) {
      let data = {
        userId: req.body.userId ? req.body.userId : 1,
        companyEntityName: req.body.companyEntityName,
        industry: req.body.industry,
        status: req.body.status,
        country: req.body.country
      }
      CompanyModel.findByIdAndUpdate(req.params.id, data, (err) => {
        if (!err) {
          res.status(200).send(
            successResponse({
              message: 'Company Updated Successfully!',
            })
          );
        }
      });
    }
  } catch (err) {
    res.status(500).send(
      failResponse({
        message: err ? err.message : "Company Not Updated!"
      })
    );
  }
};

const deleteCompany = (req, res) => {
  // #swagger.tags = ['Company']
  CompanyModel.findByIdAndRemove({ _id: req.params.id }, (err) => {
    if (!err) {
      res.status(200).send(
        successResponse({
          message: 'Company Deleted Successfully!',
        })
      );
    } else {
      res.status(500).send(
        failResponse({
          message: err ? err.message : "Company Not Deleted!"
        })
      );
    }
  });
};


const deleteCompanies = (req, res) => {
  // #swagger.tags = ['Company']
  let ids = req.body.data.map(data => data._id);
  CompanyModel.deleteMany({ _id: { $in: ids } }, (err) => {
    if (!err) {
      res.status(200).send(
        successResponse({
          message: 'Companies Deleted Successfully!',
        })
      );
    } else {
      res.status(500).send(
        failResponse({
          message: err ? err.message : "Company Not Deleted!"
        })
      );
    }
  });
};


const getCompanies = async (req, res) => {
  // #swagger.tags = ['Company']
  try {
    const companies = await CompanyModel.find({}).sort({ _id: -1 });
    res.status(200).send(
      successResponse({
        message: 'Companies Retrieved Successfully!',
        data: companies
      })
    )
  } catch (err) {
    res.status(500).send(
      failResponse({
        message: err ? err.message : "Companies Not Fetched!"
      })
    );
  }
};

const getCompanyById = async (req, res) => {
  // #swagger.tags = ['Company']
  try {
    const company = await CompanyModel.findById(req.params.id);
    res.status(200).send(
      successResponse({
        message: 'Company Retrieved Successfully!',
        data: company
      })
    )
  } catch (err) {
    res.status(500).send(
      failResponse({
        message: err ? err.message : "Company Not Fetched!"
      })
    );
  }
};

module.exports = {
  createOrUpdateMultipleCompanies,
  createCompany,
  updateCompany,
  deleteCompanies,
  deleteCompany,
  getCompanies,
  getCompanyById
};

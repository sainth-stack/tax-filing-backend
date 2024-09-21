/* import jwt from "jsonwebtoken";

export const signToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: `${user.personalInformation.firstName} ${user.personalInformation.lastName}`,
      email: user.contactInformation.email,
      mobileNumber: user.contactInformation.mobileNumber,
      image: user.personalInformation.image,
      role: user.employmentInformation.role,
      department: user.employmentInformation.department,
      company: user.employmentInformation.legalEntity,
      profilePicture: user.personalInformation.profilePicture,
      lineManager: user.employmentInformation.lineManager,
      companyId: user.companyId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "2d",
    }
  );
};

export const isAuth = (req, res, next) => {
  const { authorization } = req.headers;
  if (authorization) {
    const token = authorization.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        res.status(401).send({ message: "Invalid Token" });
      } else {
        req.user = decode;
        next();
      }
    });
  } else {
    res.status(401).send({ message: "No Token" });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "Admin") {
    next();
  } else {
    res.status(401).send({ message: "Admin Token is not valid." });
  }
};
 */

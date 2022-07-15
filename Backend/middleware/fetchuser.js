const jwt = require("jsonwebtoken");

const fetchuser = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    res.status(401).send({ error: "Authenticate using a valid token" });
  }
  try {
    const data = jwt.verify(token, "sweetchildomine");
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).send({ error: "Authenticate using a valid token" });
  }
};

module.exports = fetchuser;

const adminAuth = (req, res, next) => {
  const token = "abc";
  const authenticated = token === "abc";
  if (authenticated) {
    next();
  } else {
    res.status(401).send("admin not authenticated");
  }
};

const userAuth = (req, res, next) => {
  const token = "abc";
  const authenticated = token === "abc";
  if (authenticated) {
    next();
  } else {
    res.status(401).send("user not authenticated");
  }
};

module.exports = { userAuth, adminAuth };

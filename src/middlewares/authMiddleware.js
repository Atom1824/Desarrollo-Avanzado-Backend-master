import passport from "passport";

const requireAuth = passport.authenticate("current", { session: false });

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).send({
        status: "error",
        message: "Usuario no autenticado"
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).send({
        status: "error",
        message: "No tienes permisos para acceder a este recurso"
      });
    }

    next();
  };
};

const authorizeCartAccess = (req, res, next) => {
  if (!req.user) {
    return res.status(401).send({
      status: "error",
      message: "Usuario no autenticado"
    });
  }

  if (req.user.role === "admin") return next();

  const userCart = req.user.cart ? req.user.cart.toString() : null;
  if (userCart !== req.params.cid) {
    return res.status(403).send({
      status: "error",
      message: "No tienes permisos para operar este carrito"
    });
  }

  next();
};

export { requireAuth, authorizeRoles, authorizeCartAccess };

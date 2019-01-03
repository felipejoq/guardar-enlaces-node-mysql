module.exports = {
  estaConectado(req, res, next) {
    // Método que agrega passport y que devuelve un true si hay una sesion abierta.
    if (req.isAuthenticated()) {
      return next();
    } else {
      return res.redirect("/conectarse");
    }
  },

  noEstaLogeado(req, res, next){
    if(!req.isAuthenticated()){
        return next();
    } else {
        return res.redirect('/profile');
    }
  }
};

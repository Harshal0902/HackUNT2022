module.exports = function ({ app, dbConn }) {
    app.post("/users/create", (req, res, next) => {
      const { id, email, password, fullname, avatar } = req.body;
      if (id && email && password && fullname, avatar) {
        const findAccountByEmail = "SELECT * FROM user_account WHERE user_email = ?";
        dbConn.query(findAccountByEmail, [email], function (error, account) {
          if (account && account.length !== 0) {
            res.status(200).jsonp({ message: 'The email existed in the system' });
          } else {
            const users = [[id, email, password, fullname, avatar]];
            const registerUserSql = "INSERT INTO user_account (id, user_email, user_password, user_full_name, user_avatar) VALUES ?";
            dbConn.query(registerUserSql, [users], function (error, insertedUser) {
              if (insertedUser) {
                res.status(200).jsonp({ id, email, fullname, avatar });
              } else {
                res.status(200).jsonp({ message: 'Cannot create your account, please try again' });
              }
            });
          }
        });
      } else {
        return res.status(200).jsonp({ message: "Please input required fields" });
      }
    });
  }
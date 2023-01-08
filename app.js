const express = require("express");
const path=require('path')
const adminRoutes = require('./routes/admin');//ADMIN ROUTES
const shopRoutes = require("./routes/shop");//SHOP ROUTES
const sequelize = require('./util/database');//DATABASE

// ==> error controller
const errorController = require('./controllers/error')
//REQUIRING PRODUCT MODEL
const Product = require('./model/product');
//REQUIRING USER MODEL
const User = require("./model/user");

const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }))
// ==> set view

app.set('view engine', 'ejs');
app.set('views','views')


//retriving user and adding it to the request object so we can use it latter
app.use((req, res, next) => {
  User.findByPk(1).then(user => {
    req.user = user;
    next();

  }).catch(err=>console.log("retriving user error:"+err))
})
//------------------------------------------------------

//=================== HANDLING ROUTES ============================
app.use("/admin", adminRoutes);
app.use(shopRoutes);
//==> PAGE NOT FOUND...
app.use(errorController.pageNotFound);

//-------------------------------------------------

//====================== CREATING ASSOCIATIONS ==========================
Product.belongsTo(User, { constraints: true, ondelete: 'CASCADE  ' });
User.hasMany(Product);

//-------------------------------------------------
// sequelize.sync({ force: true })
  sequelize
    .sync()
    .then((result) => {
      return User.findByPk(1);
      
    }).then(user => {
      if (!user) {
        return User.create({name:"Muslim shah", email:"smuslimshah7@gmail.com"})
      }
      return user;
    }).then(user => {
      console.log(user);
      app.listen(3000, function () {
        console.log("got connected to :3000");
      });

    })
    .catch((err) => {
      console.log(err);
    });





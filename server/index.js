
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

let User = require("./models/user_model");

const app = express();
app.use(express.json({limit: "30mb",extended:true}));
// app.use(express.urlencoded({limit: "30mb",extended:true}));
app.use(cors())
// FOR THE VALIDATIONS
const { body, validationResult } = require("express-validator");

///FOR AUTHORIZATION
const jwt = require('jsonwebtoken');


// app.use('/items',itemRoutes)
app.get('/',(req,res)=>{
    res.send('Hello')
})

// ADD OFFICIAL

app.post(
  "/add",
  [
    body("email")
      .isLength({ min: 1 })
      .withMessage("*Email Address field cannot be blank")
 

      .isEmail()
      .withMessage("*Email Address field should have email domain"),

    body("fullname")
      .isLength({ min: 1 })
      .withMessage("*Full Name field cannot be blank")

  
      .matches(/^[aA-zZ\s]+$/)
      .withMessage("*Full Name field accept characters values only"),

    body("password")
      .isLength({ min: 1 })
      .withMessage("*Password field cannot be blank"),

  ],
  (req, res, next) => {
    try {
      //HERE WE PROCESS THE VALIDATION AND STORE IT ON const errors
      const error = validationResult(req);
      let arrayofErrors = {}; // STORE HERE THE ERROR MESSAGES as an Array

      //MEANS THAT THERE IS AN ERROR EXISTING!
      if (!error.isEmpty()) {
        //EXECUTE  ONLY THE FIRST ERROR
        error.array({ onlyFirstError: true }).forEach((error) => {
          //CONDITIONING / CHECKING IF THE said errors param exist on the arrayofErrors
          if (!arrayofErrors[error.param]) {
            arrayofErrors[error.param] = [];
          }
          //IF THE ERROR PARAMS EXIST.
          arrayofErrors[error.param] = [
            ...arrayofErrors[error.param],
            error.msg,
          ];
        });
        console.log(error);

        //HERE WE SEND BACK ALL OF THE ERRORS TO THE FRONTEND WITH THE STATUS CODE OF 400
        return res.status(400).json(arrayofErrors);

      } else {
        const serial ="123";

        if(req.body.serial==serial){
          const email = req.body.email;
          const password = req.body.password;
          const verified = "false";
          const code = Math.floor(100000 + Math.random() * 900000);

          ////PROFILE

          const fullname = req.body.fullname;
          const image = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNL_ZnOTpXSvhf1UaK7beHey2BX42U6solRA&usqp=CAU";
          const bio = "Add profile bio 300 characters only.";
          
          ////SOCIAL LINKS
          const fb = "#";
          const instagram = "#";
          const telegram = "#";
          const linkedin = "#";
          const youtube = "#";
          const viber = "#";
          const tiktok = "#";
          const gcash = "#";


         ////EXPERIENCES
          const title = "N/A";
          const company = "N/A";
          const website = "N/A";
          const officeno = "N/A";
          const address = "N/A";

          ///CONTACT
          const contactWebsite = "#";
          const contactNumber = "00xx";
        


        
     
      
          
        const newUser = new User({
          address,
          officeno,
          website,
          company,
          title,
          gcash,
          contactWebsite,
          contactNumber,
          tiktok,
          viber,
          youtube,
          linkedin,
          telegram,
          instagram,
          fb,
          bio,
          image,
          fullname,
          email,  
          password,
          verified,
          code,        
        }); // Instantiate the User in user.model

        newUser
        .save() //PROMISE
        .then((user) => {
          res.json({  email: email, fullname: fullname,user })
            
          ///SEND CODE TO USER EMAIL REGISTERED!
        const nodemailer = require('nodemailer');


        // Step 1
        let transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: "orgxtopazsystem@gmail.com",
            pass: "orgxtopazsystem06+"
          }
        });

          // Step 2
          let mailOptions = {
            from: 'orgxtopazsystem@gmail.com', // TODO: email sender
            to: `${email}`, // TODO: email receiver
            subject: 'Email Verification Code',
            text: `Verify your Email using this code : ${code}


            Note : Disregard this email if you are already verified.
            
            
            
            `
          };
  
          // Step 3
          transporter.sendMail(mailOptions, (err, data) => {
            if (err) {
              console.log('Error occurs');
            }
            console.log('Email sent!!!');
          });


        })


        .catch((err) => res.status(400).json("Errors: " + err)); // CATCH THE ERROR

        }else{
          return res.status(400).json({serialError:"Wrong Serial Number"});


        }
   
      }
    } catch (err) {

    }
  }
);



///VERIFY
app.put('/verify',(req,res)=>{

  const email = req.body.email;
  const code = req.body.code;
  const userId = req.body.userId;

  console.log(email)
  console.log(code)
  console.log(userId)

  //CHECKING IF USER EXIST ON DATABASE
  User.findById(userId)

    /// VALIDATING IF THE CODE IS CORRECT
    .then(user => {


      if (user.email == email && user.code == code) {
        //SET VERIFIED TO TRUE USER CAN NOW LOG IN 

        user.verified = true;

        user.save()
        res.json("VERIFIED SUCCESSFULLY!"); // IF ERROR


      } else {
        res.status(400).json("CODE IS WRONG"); // IF ERROR
      }

    }).catch((err) => {
      res.status(400).json(err)

    })


})


///LOG IN
app.post('/login',(req,res)=>{

     const email = req.body.email;
    const password = req.body.password;
  
    //CHECKING IF USER EXIST ON DATABASE
    User.find({ $and: [{ email: { $eq: email } }, { password: { $eq: password } }, { verified: { $eq: "true" } }] })
  
      /// VALIDATING IF USER EXIST
      .then(user => {
  
        if (user.length > 0) {
          const id = user[0].id
  
          const token = jwt.sign({ id }, "jwtSecret", {
            // expiresIn:10000,
          })
         
  
          res.json({ auth: true, token: token, email:user[0].email,userId:user[0]._id,fullname:user[0].fullname })
  
        } else {
          res.status(400).json({ auth: false, message: "User didn't exist! Create Account Now" })
        }
  
      })
  

})


//MAKING FUNCTIONS TO VERIFY IF USER IS AUTHORIZED WITH THE VALID TOKEN
///SECURITY SO THAT DATA COULD NOT BE DISPLAY IF USER IS NOT LOG IN AND AUTHORIZE
const verifyJWT = (req, res, next) => {
  const token = req.headers["x-access-token"]

  if (!token) {
    res.send("YOU ARE NOT AUTHORIZED MADAPAKER!!")
  } else {
    jwt.verify(token, "jwtSecret", (err, decoded) => {
      if (err) {
        res.json({ auth: false, message: "You are not Authenticated!" })
      } else {
        req.userId = decoded.id;
        next();
      }
    })
  }

}


///GET PROFILE DETAILS

app.get("/getprofileDetails/:id",verifyJWT,(req, res, next) => {
  
  User.findById(req.params.id)
  .then((user) => res.status(200).json(user)) // IF TRUE CHECK
  .catch((err) => res.status(400).json("Error : " + err)); // IF ERROR

}
);





////ADD / UPDATE PROFILE Details
app.put("/updateprofileDetails/:id",(req, res, next) => {
  let bio = req.body.bio;
  let image = req.body.image;
  let fullname = req.body.fullname;
  
        User.findById(req.params.id)
          .then((user) => {

            ///CHECKING THE CHANGES AND APPLY
            if(bio=="" ){
              bio+=user.bio

            }if(image==""){
              image+=user.image
            }if(fullname==""){
              fullname+=user.fullname
            }



            user.bio = bio;
            user.image = image;
            user.fullname = fullname;

            user.save()

              .then((user) => res.json(user))
              .catch((err) => res.status(400).json(err));
          })
          .catch((err) => res.status(400).json("Error: " + err));
    
    
  }
);

////ADD / UPDATE SOCIAL LINKS
app.put("/updatesocialLinks/:id",(req, res, next) => {
  let fb = req.body.fb
  let instagram =req.body.instagram
  let telegram=req.body.telegram
  let  linkedin=req.body.linkedin
  let  youtube=req.body.youtube
  let viber=req.body.viber
  let tiktok=req.body.tiktok
  let gcash=req.body.gcash
  
        User.findById(req.params.id)
          .then((user) => {

            ///CHECKING THE CHANGES AND APPLY
            if(fb==""){
              fb+=user.fb

            }if(instagram==""){
              instagram+=user.instagram
            }if(telegram==""){
              telegram+=user.telegram
            }
            if(linkedin==""){
              linkedin+=user.linkedin

            }if(youtube==""){
              youtube+=user.youtube
            }if(viber==""){
              viber+=user.viber
            }
            if(tiktok==""){
              tiktok+=user.tiktok

            }if(gcash==""){
              gcash+=user.gcash
            }


            user.fb = fb;
            user.instagram = instagram;
            user.telegram = telegram;
            user.linkedin = linkedin;
            user.youtube= youtube;
            user.viber = viber;
            user.tiktok = tiktok;
            user.gcash = gcash
            user.save()

              .then((user) => res.json(user))
              .catch((err) => res.status(400).json(err));
          })
          .catch((err) => res.status(400).json("Error: " + err));
    
    
  }
);

///EMD SOCIAL LINKS FUNCTION




////ADD / UPDATE EXPERIENCE
app.put("/updateExperience/:id",(req, res, next) => {
  let title= req.body.title;
  let company= req.body.company;
  let website = req.body.website;
  let  officeno=req.body. officeno
  let  address=req.body.address;
  let contactWebsite=req.body.contactWebsite
  let  contactNumber=req.body.contactNumber
  
        User.findById(req.params.id)
          .then((user) => {

            ///CHECKING THE CHANGES AND APPLY
            if(title==""){
              title+=user.title

            }if(company==""){
              company+=user.company
            }
            if(website==""){
              website+=user.website
            }
            if(officeno==""){
              officeno+=user.officeno

            }
            if(address==""){
              address+=user.address
            }
            if(contactWebsite==""){
              contactWebsite+=user.contactWebsite
            }
            if(contactNumber==""){
              contactNumber+=user.contactNumber

            }


            user.title = title;
            user.company = company;
            user.website = website;
            user.officeno = officeno;
            user.address= address;
            user.contactWebsite = contactWebsite;
            user.contactNumber = contactNumber;
      
            user.save()

              .then((user) => res.json(user))
              .catch((err) => res.status(400).json(err));
          })
          .catch((err) => res.status(400).json("Error: " + err));    
  }
);


////END EXPERIENCE FUNCTIONS



















mongoose.connect(
"mongodb://orgxtopazsystem:orgxtopazsystem@cluster0-shard-00-00.bpdki.mongodb.net:27017,cluster0-shard-00-01.bpdki.mongodb.net:27017,cluster0-shard-00-02.bpdki.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-dtrgxv-shard-0&authSource=admin&retryWrites=true&w=majority",
  {
    useNewUrlParser: true,

    useUnifiedTopology: true,
  },
  (err) => {
    if (err) throw err;
    console.log("Connected to MongoDB!!!");
  }
); // MONGO DB NEEDED CONFIG.

const connection = mongoose.connection; // CONNECT NOW TO DATABASE / MONGO DB

connection.once("open", () => {
  console.log("MONGO DB CONNECTION ESTABLISHED! HINAMPAK");
});

app.listen(5000, () => {
  console.log("Server is running in port:" + 5000);
});

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const crypto = require("crypto");
const { sendEmail } = require("../utils/sendEmail");

// Register a new user
const Register = async (req, res) => {
   const { fName, lName, email, password } = req.body;
   const userExists = await User.findOne({ email });
   
   if (userExists) {
      return res.status(401).json({ error: 'User already exists' });
   } else {
      let hashPassword;
      const salt = await bcrypt.genSalt(10);
      hashPassword = await bcrypt.hash(password, salt);
      
      const user = new User({
         fName, lName, email, password: hashPassword
      });
     
      await user.save();
      
      const verificationToken = crypto.randomBytes(20).toString('Hex');
      user.emailVerificationToken = crypto.createHash('sha256').update(verificationToken).digest('hex');
      user.emailVerificationExpire = Date.now() + 24 * 60 * 60 * 1000;
      await user.save();
      
      const verificationUrl = `http://localhost:3000/auth/email-verification/${verificationToken}`;
      
      const message = `
      <p> Please verify your email by visiting this link - <a href=${verificationUrl}> ${verificationUrl} </a> </p>
      `;
      await sendEmail({
         to: user.email,
         subject: 'Email Verification',
         html: message
         // props 
      });
      console.log("mail sent");

   }

};
// emailverification
const emailVerification = async (req, res) => {
   const { email } = req.body;
   const user = await User.findOne({ email });
   if (!user) {
      return res.status(404).json({ error: "User does not exist" });
   } else {
      const isverified = user.isVerified;
      
      if (isverified) {
         res.status(200).json({ message: "Already verifed proceed to login" });
      } else {
         user.isVerified = true;
         await user.save();
         res.status(200).json({ message: "Mail verification successfull" });
      }
   }

};

// User login
const Login = async (req, res) => {
   const { email, password } = req.body;

   const userExists = await User.findOne({ email });

   const JWT_SECRET = process.env.JWT_SECRET;

   if (userExists && userExists.isVerified) {

      const savedPassword = userExists.password;
      const auth = await bcrypt.compare(password, savedPassword);
      if (auth) {
         const token = jwt.sign({ id: userExists._id, email: email }, JWT_SECRET, {
            expiresIn: '24h'
         });
         return res.status(201).json({ token: token, user: userExists });

      } else {

         return res.status(404).json({ error: 'Wrong credentials' });
      }
   } else if (userExists && !userExists.isVerified) {
      return res.status(401).json({ error: 'Please verify email first' });
   } else {
      return res.status(404).json({ error: 'User does not exist register first' });
   }

};




module.exports = {
   Register, Login,emailVerification
}
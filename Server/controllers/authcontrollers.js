import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../Model/userModel.js';
import transporter from '../config/nodemailer.js';




export const register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.json({ success: false, message: 'All fields are required' });
    }

    try {
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.json({ success: false, message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate token before saving
        const tempUser = new userModel({ name, email, password: hashedPassword });
        const token = jwt.sign({ id: tempUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        tempUser.token = token;

        await tempUser.save();

        // Set token in cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        // Send welcome email
        const mailOptions = {
            from: process.env.SENDEREMAIL,
            to: email,
            subject: 'Welcome to our Hacker website',
            text: `Hello ${name}, Welcome to our website! You have successfully registered.`
        };

        await transporter.sendMail(mailOptions);
        console.log("Mail sent successfully.");

        return res.json({ success: true, message: 'Registered and email sent successfully.' });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};
export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.json({ success: false, message: 'Email and password are required' });
    }

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: 'Invalid email' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: 'Invalid password' });
        }

        // Send existing token stored in DB
        const token = user.token;

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.json({ success: true, message: 'Login successful.' });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};


export const logout = async(req,res)=>{
    try {
        res.clearCookie('token',{
            httpOnly:true,
            secure : process.env.NODE_ENV==='production',
            sameSite : process.env.NODE_ENV==='production'?'none':'strict',
            
        })
        return res.json({success:true,message:'Logged out'})
    } catch (error) {
        return res.json({success:false,message:error.message});
    }
}

export const sendVerifyOtp = async(req,res)=>{
    try {
        const userId = req.userId;

        const user= await userModel.findById(userId);

        if(user?.isAccountVerified){
            return res.json({success:false,message:'Account is already verified'})
        }

        const otp = String(Math.floor(100000+Math.random()*900000));

        user.verifyOtp =otp;

        user.verifyOtpExpireAt = Date.now()+24*60*60*1000;

        await user.save();

         const mailOptions = {
            from: process.env.SENDEREMAIL,
            to : user.email,
            subject : 'Account Verification OTP',
            text : `Your OTP is  ${otp} ,Verify your account using this OTP.`
        }

        await transporter.sendMail(mailOptions);
        console.log("Mail is send.")
        
        return res.json({success:true,message:"Verification OTP sent on your Email."});


    } catch (error) {
        
       return res.json({success:false,message:error.message});
    }
}

export const verifiEmail =async(req,res)=>{

         const { otp } = req.body;
         const userId = req.userId;

          
          if (!userId || !otp){
            return res.json({success:false,message:'Missing Details'});
          }
    
    try {
         const user= await userModel.findById(userId);

         if (!user) {
            return res.json({success:false,message:'user not found'});
         }
         
         if (user.verifyOtp === '' || user.verifyOtp !== otp) {
            return res.json({success:false,message:'Invalid Otp'});
         }

         if (user.verifyOtpExpireAt < Date.now()) {
            return res.json({success:false,message:'Otp is Expired'});
         }

         user.isAccountVerified = true;
         user.verifyOtp='';
         user.verifyOtpExpireAt=0;
         await user.save();
         return res.json({success:true,message:'Email Verification Successfully'});

    } catch (error) {
         return res.json({success:false,message:error.message});
    }
}

export const isAuthenticated =async(req,res)=>{
    try {
        return res.json({success:true});
    } catch (error) {
        return res.json({success:false,message:error.message});
    }
}

export const sentResetOtp =async(req,res)=>{
    const {email}=req.body;

    if (!email) {
         return res.json({success:false,message:'email is required'});
    }

    try {
        const user = await userModel.findOne({email});

        if(!user){
            return res.json({success:false,message:'User not found'});
        }

 const otp = String(Math.floor(100000+Math.random()*900000));

        user.resetOtp =otp;

        user.resetOtpExpireAt = Date.now()+15*60*1000;

        await user.save();

         const mailOptions = {
            from: process.env.SENDEREMAIL,
            to : user.email,
            subject : 'Password Reset OTP',
            text : `Your OTP for resetting your password ${otp} .`
        }

        await transporter.sendMail(mailOptions);
        console.log("Mail is send.")
        
        return res.json({success:true,message:"OTP sent on your Email."});


    } catch (error) {
         return res.json({success:false,message:error.message});
    }

    }

export const resetPassword =async(req,res)=>{
    const {email,otp,newPassword}=req.body;

    if (!email || !otp || !newPassword) {
         return res.json({success:false,message:'email,otp and new password are required'}); 
    }

       try {
         const user= await userModel.findOne({email});

         if (!user) {
            return res.json({success:false,message:'user not found'});
         }
         
         if (user.resetOtp === '' || user.resetOtp !== otp) {
            return res.json({success:false,message:'Invalid Otp'});
         }

         if (user.resetOtpExpireAt < Date.now()) {
            return res.json({success:false,message:'Otp is Expired'});
         }

         const hashedpassword = await bcrypt.hash(newPassword,10);
         user.password = hashedpassword;
         user.resetOtp = '';
         user.resetOtpExpireAt=0;
         await user.save();
         return res.json({success:true,message:'Reset password successfully'});

    } catch (error) {
         return res.json({success:false,message:error.message});
    }
}


//2.25 min
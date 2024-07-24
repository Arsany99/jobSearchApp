import nodemailer  from "nodemailer";




export const sendEmail = async(to,subject,html)=>{

const transporter = nodemailer.createTransport({
    service:'gmail',    
  auth: {
    user: "ahmedroute5@gmail.com",
    pass: "zojzrlzqnlskfhpx",
  },
});

  const info = await transporter.sendMail({
    from: '"3b8any 👻" <ahmedroute5@gmail.com>', 
    to: to?to:'',
    subject:subject?subject: "Hello ✔", 
    html:html?html: "<b>Hello world?</b>", 
  });
//console.log(info);
if (info.accepted.length) {
    return true
    
}
return false



}
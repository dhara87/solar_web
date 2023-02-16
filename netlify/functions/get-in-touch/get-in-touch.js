
const Sib = require('sib-api-v3-sdk')

const client = Sib.ApiClient.instance
const tranEmailApi = new Sib.TransactionalEmailsApi()
const apiKey = client.authentications['api-key']
apiKey.apiKey = process.env.SEND_IN_BLUE_API

async function sendToClient(name,email,sender){
  const receivers = [
    {
      email: email,
    },
  ]

  let htmlContent =`<div> 
    <p>Dear ${name},</p>
    <p>Thank you for contacting Energy Platform</p>
    <p>We appreciate your first step towards making your own solar system, we are here to assist you and together we will assemble and install a solar system that saves thousands of dollars for you over the years.</p>
    <p>Let’s start with the first step of choosing your solar panels and the inverter.</p>
    <p>You can do this by choosing products from our DIY Kit page:</p>
    <p><a href="https://www.energyplatform.com.au/diy-kits/">https://www.energyplatform.com.au/diy-kits</a></p>
    <ol>
      <li>Select the Property type as “Residential or Commercial</li>
      <li>Choose solar modules (Panels), Inverter and mounting and electrical kit of your choice</li>
      <li>Add services and storage (Battery) as per your requirements</li>
    </ol>
    <p>We would love to assist you with all your solar requirements. Once you submit details, please expect a quotation on your registered e-mail with 24 business hours.</p>
    <p>For any further details, please e-mail us at <a href="mailto:support@energyplatform.com.au">support@energyplatform.com.au</a> or call us on <b>1300 358 709.</b>.</p>
    <p>Best Regards,</p>
    <p><a href="https://www.energyplatform.com.au/">Team Energy Platform</a></p>
    <p>1300 358 709</p>
  </div>`

  await new Promise((resolve, reject) => {
    tranEmailApi
      .sendTransacEmail({
        sender,
        to: receivers,
        subject: "Energy Platform Get in touch",
        textContent: "Contact Energy Platform",
        htmlContent: htmlContent,
      })
  });
}

exports.handler = async (event) => {
  const { name, email, mobile, address } = JSON.parse(event.body);

  const sender = {
    email: "support@energyplatform.com.au",
    name: "Energy Platform",
  }

  sendToClient(name, email, sender)

  const receivers = [
    {
      email: 'support@energyplatform.com.au',
    },
  ]

  await new Promise((resolve, reject) => {
    tranEmailApi
      .sendTransacEmail({
        sender,
        to: receivers,
        subject: "Energy Platform Get in touch",
        textContent: "Contact Energy Platform",
        htmlContent: `
        <div> <span> Name:   ${name}  <span>  <br> 
        <span> Mobile No.:   ${mobile}  <span>  <br> 
        <span> Email:   ${email}  <span>  <br> 
        <span> address:   ${address}  <span>  <br> 
        </div>
        `,
      })
      .then(() => {
        resolve();
        return {
          statusCode: 200,
          body: JSON.stringify({
            msg: "Your message was sent. Thank you."
          })
        };
      })
      .catch((err) => {
        reject();
        return {
          statusCode: 500,
          body: JSON.stringify({
            msg: err
          })
        };
      });
  });

  return {
    statusCode: 200,
    body: JSON.stringify({
      msg: "Your message was sent. Thank you."
    })
  };

};
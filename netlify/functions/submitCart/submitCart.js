const Sib = require("sib-api-v3-sdk");

const client = Sib.ApiClient.instance;
const tranEmailApi = new Sib.TransactionalEmailsApi();
const apiKey = client.authentications["api-key"];
apiKey.apiKey = process.env.SEND_IN_BLUE_API;

exports.handler = async (event) => {
  const { name, email, contact, address, property, grandTotal, items } =
    JSON.parse(event.body);

  const sender = {
    email: "support@energyplatform.com.au",
    name: "Energy Platform",
  };

  let htmlContent =
    `<div>` +
    `<p>Dear ` +
    name +
    `</p>` +
    `<p>Thank you for contacting Energy Platform!</p>` +
    `<p>We are glad that you took your first step towards building your own solar system; we acknowledge the receipt of your order and confirm that you will soon receive a detailed quotation on your registered e-mail within 24 business hours.</p>` +
    `<p>We would love to assist you with all your solar requirements.</p>` +
    `<p>Details of your order and estimation are as below: </p>` +
    `<div> 
        <span> Name:   ${name}  <span>  <br> 
        <span> Email:   ${email}  <span>  <br> 
        <span> Contact:   ${contact}  <span>  <br> 
        <span> Address:   ${address}  <span>  <br> 
        <span> Property Type:   ${property}  <span>  <br> 
    </div><br>` +
    `Cart Detail:<br>
    <table style="border:1px solid; min-width:700px;">
      <tr  style="border:1px solid;">
        <td  style="border:1px solid;"><b>No</b></td>
        <td  style="border:1px solid;"><b>Product</b></td>
        <td  style="border:1px solid;"><b>Quantity</b></td>
        <td  style="border:1px solid;"><b>Price(Estimated)</b></td>
      </tr>
    `;

  items.forEach((element, i) => {
    let pp = (parseFloat(element.price) * element.qty).toFixed(2);
    htmlContent +=
      `<tr  style="border:1px solid;">
        <td  style="border:1px solid;">` +
      (i + 1) +
      `</td>
        <td  style="border:1px solid;">` +
      element.title +
      `</td>
        <td style="border:1px solid;">` +
      element.qty +
      `</td>
        <td style="border:1px solid;">` +
      pp +
      `</td>
      </tr>
      `;
  });

  htmlContent +=
    `
    <tr  style="border:1px solid;">
      <td colspan="3" style="border:1px solid;"><b>Grand Total:</b></td>
      <td style="border:1px solid;"><b>` +
    grandTotal +
    `</b></td>
    <tr>
    </table><br/><br/>
    <p>For any further details, please e-mail us at <a href="mailto:support@energyplatform.com.au">support@energyplatform.com.au</a> or call us on <b>1300 358 709.</b></p>
    <br/>
    <p>Best Regards,</p>
    <p>Team Energy Platform</p>
    <p>1300 358 709</p>
    </div>
    `;

  const receivers = [
    {
      email: email,
    },
    {
      email: "support@energyplatform.com.au",
    },
  ];

  await new Promise((resolve, reject) => {
    tranEmailApi
      .sendTransacEmail({
        sender,
        to: receivers,
        subject: "Energy Platform:Inquiry Submited",
        textContent: "Energy Platform",
        htmlContent: htmlContent,
      })
      .then(() => {
        resolve();
        return {
          statusCode: 200,
          body: JSON.stringify({
            msg: "Your message was sent. Thank you.",
          }),
        };
      })
      .catch((err) => {
        reject();
        return {
          statusCode: 500,
          body: JSON.stringify({
            msg: err,
          }),
        };
      });
  });

  return {
    statusCode: 200,
    body: JSON.stringify({
      msg: "Your message was sent. Thank you.",
    }),
  };
};

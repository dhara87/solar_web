const Sib = require('sib-api-v3-sdk')

const client = Sib.ApiClient.instance
const tranEmailApi = new Sib.TransactionalEmailsApi()
const apiKey = client.authentications['api-key']
apiKey.apiKey = process.env.SEND_IN_BLUE_API

exports.handler = async (event) => {
  const { name, email } = JSON.parse(event.body);

  const sender = {
    email: "support@energyplatform.com.au",
    name: name,
  }

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
        textContent: "Subscribe Email",
        htmlContent: `
        <div> <h3> Subscribed Email  <h3>  <br>
        <span> Name:   ${name}  <span>  <br> 
        <span> Email:   ${email}  <span>  <br> 
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
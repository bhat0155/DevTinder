const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("./sesClient")

const createSendEmailCommand = (toAddress, fromAddress) => {
    return new SendEmailCommand({
      Destination: {

        CcAddresses: [

        ],
        ToAddresses: [
          toAddress,

        ],
      },
      Message: {

        Body: {

          Html: {
            Charset: "UTF-8",
            Data: "<h1>This is the email in html</h1>",
          },
          Text: {
            Charset: "UTF-8",
            Data: "This is email in text format",
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: "EMAIL_SUBJECT",
        },
      },
      Source: fromAddress,
      ReplyToAddresses: [
        /* more items */
      ],
    });
  };

  const run = async () => {
    const sendEmailCommand = createSendEmailCommand(
      "ekamsingh643@gmail.com",
      "ekam@devcollab.ca",
    );
  
    try {
      return await sesClient.send(sendEmailCommand);
    } catch (caught) {
      if (caught instanceof Error && caught.name === "MessageRejected") {
        const messageRejectedError = caught;
        return messageRejectedError;
      }
      throw caught;
    }
  };
  
  // snippet-end:[ses.JavaScript.email.sendEmailV3]
  module.exports = { run };
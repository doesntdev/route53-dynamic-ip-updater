const fetch = require("node-fetch");
const AWS = require("aws-sdk");
const dotenv = require("dotenv");
dotenv.config();

const route53 = new AWS.Route53();

const ipdata = () => {
  fetch("https://icanhazip.com/")
    .then((res) => res.text())
    .then((data) => {
      updateroute53(data);
    });
};

const updateroute53 = (ipaddress) => {
  var params = {
    ChangeBatch: {
      Changes: [
        {
          Action: "UPSERT",
          ResourceRecordSet: {
            Name: process.env.RESOURCE_RECORDSET_NAME,
            ResourceRecords: [
              {
                Value: ipaddress,
              },
            ],
            TTL: 60,
            Type: "A",
          },
        },
      ],
      Comment: "Dynamic DNS update",
    },
    HostedZoneId: process.env.HOSTEDZONEID,
  };

  route53.changeResourceRecordSets(params, function (err, data) {
    if (err) console.log(err, err.stack);
    else console.log(data);
  });
};

ipdata();

const fetch = require("node-fetch");
const AWS = require("aws-sdk");
const dotenv = require("dotenv");
dotenv.config();

console.log(process.env.AWS_ACCESS_KEY_ID);
const route53 = new AWS.Route53();

const ipdata = () => {
  fetch("https://icanhazip.com/")
    .then((res) => res.text())
    .then((data) => {
      updateroute53(data);
    });
};

const updateroute53 = (data) => {
  var params = {
    ChangeBatch: {
      Changes: [
        {
          Action: "UPSERT",
          ResourceRecordSet: {
            Name: "games.loganh.art",
            ResourceRecords: [
              {
                Value: data,
              },
            ],
            TTL: 60,
            Type: "A",
          },
        },
      ],
      Comment: "Dynamic DNS update",
    },
    HostedZoneId: "Z07467821BBWM2K1I4AMS",
  };

  route53.changeResourceRecordSets(params, function (err, data) {
    if (err) console.log(err, err.stack);
    else console.log(data);
  });
};

ipdata();

const { App } = require('@slack/bolt');
//const helper = require('./helper')
const axios = require('axios');
const fs = require('fs');
//import AwsRegion from './class/AwsRegion'
/* 
This sample slack application uses SocketMode
For the companion getting started setup guide, 
see: https://slack.dev/bolt-js/tutorial/getting-started 
*/

// Initializes your app with your bot token and app token
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN
});

const userInputData = new Map();
app.message('submit', async ({ message, say }) => {
  // say() sends a message to the channel where the event was triggered
  await say({
    "blocks": [
      {

        "type": "input",
        "element": {
          "type": "plain_text_input",
          "action_id": "submit_input"
        },
        "label": {
          "type": "plain_text",
          "text": "Stack Name",
          "emoji": true

        },

      },

      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": `Hey there <@${message.user}>!`
        },
        "accessory": {
          "type": "button",
          "text": {
            "type": "plain_text",
            "text": "Submit",
          },
          "action_id": "submit_click"
        }
      },

      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "This is a section block with a button."
        },
        "accessory": {
          "type": "button",
          "text": {
            "type": "plain_text",
            "text": "Click Me",
            "emoji": true
          },
          "value": "click_me_123",
          "url": "https://google.com",
          "action_id": "button-action"
        }
      }
    ]

  })
});

//generate a block that allows user to input text and click submit button, then get the input value from "submit_input" in text
app.action('submit_click', async ({ body, ack, say }) => {
  await ack();
  let submit = body.actions[0].value;
  await say(`<@${body.user.id}> selected ${submit}`);
})


//get the input value from "submit_input" in text
app.action('submit_input', async ({ body, ack, say }) => {
  await ack();
  let submit = body.actions[0].value;
  await say(`<@${body.user.id}> selected ${submit}`);
})
// Listens to incoming messages that contain "hello"
app.message('hello', async ({ message, say }) => {
  // say() sends a message to the channel where the event was triggered
  await say({
    blocks: [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": `Hey there <@${message.user}>!`
        },
        "accessory": {
          "type": "button",
          "text": {
            "type": "plain_text",
            "text": "Click Me"
          },
          "action_id": "button_click"
        }
      }
    ],
    text: `Hey there <@${message.user}>!!`
  });
});

// app.message('P2Bot', async ({ message, say }) => {
//   await say({
//     "blocks": [
//       {
//         "type": "input",
//         "element": {
//           "type": "plain_text_input",
//           "action_id": "plain_text_input-action"
//         },
//         "label": {
//           "type": "plain_text",
//           "text": "Stack Name",
//           "emoji": true
//         }
//       },
//       {
//         "type": "section",
//         "text": {
//           "type": "mrkdwn",
//           "text": "Region"
//         },
//         "accessory": {
//           "type": "static_select",
//           "placeholder": {
//             "type": "plain_text",
//             "text": "Select a region",
//             "emoji": true
//           },
//           "options": [
//             {
//               "text": {
//                 "type": "plain_text",
//                 "text": "us-east1",
//                 "emoji": true
//               },
//               "value": "value-0"
//             },
//             {
//               "text": {
//                 "type": "plain_text",
//                 "text": "us-west2",
//                 "emoji": true
//               },
//               "value": "value-1"
//             },
//             {
//               "text": {
//                 "type": "plain_text",
//                 "text": "ca-central-1",
//                 "emoji": true
//               },
//               "value": "value-2"
//             }
//           ],
//           "action_id": "select_region-action"
//         }
//       },
//       {
//         "type": "section",
//         "text": {
//           "type": "mrkdwn",
//           "text": "Cloud Provider"
//         },
//         "accessory": {
//           "type": "radio_buttons",
//           "options": [
//             {
//               "text": {
//                 "type": "plain_text",
//                 "text": "AWS",
//                 "emoji": true
//               },
//               "value": "value-0"
//             },
//             {
//               "text": {
//                 "type": "plain_text",
//                 "text": "GCP",
//                 "emoji": true
//               },
//               "value": "value-1"
//             },
//             {
//               "text": {
//                 "type": "plain_text",
//                 "text": "FedRamp",
//                 "emoji": true
//               },
//               "value": "value-2"
//             }
//           ],
//           "action_id": "cloudprovider-action"
//         }
//       },{
//         type: "input",
//         block_id: 'details_netnew_tf',
//         element: {
//           type: "static_select",
//           placeholder: {
//             type: "plain_text",
//             text: "Net New*",
//             emoji: true
//           },
//           options: [
//             {
//               text: {
//                 type: "plain_text",
//                 text: "true",
//                 emoji: true
//               },
//               value: "true"
//             },
//             {
//               text: {
//                 type: "plain_text",
//                 text: "false",
//                 emoji: true
//               },
//               value: "false"
//             },
//           ],
//           action_id: "netnew_input"
//         },
//         label: {
//           type: "plain_text",
//           text: "Net New*(T/F)",
//           emoji: true
//         }
//       } ,{
//         type: "input",
//         block_id: 'details_ridm_tf',
//         element: {
//           type: "static_select",
//           placeholder: {
//             type: "plain_text",
//             text: "Requesting IDM",
//             emoji: true
//           },
//           options: [
//             {
//               text: {
//                 type: "plain_text",
//                 text: "true",
//                 emoji: true
//               },
//               value: "true"
//             },
//             {
//               text: {
//                 type: "plain_text",
//                 text: "false",
//                 emoji: true
//               },
//               value: "false"
//             },
//           ],
//           action_id: "irdm_input"
//         },
//         label: {
//           type: "plain_text",
//           text: "Requesting IDM (T/F)",
//           emoji: true
//         }
//       } ,{
//         type: "input",
//         block_id: 'details_hipaa_tf',
//         element: {
//           type: "static_select",
//           placeholder: {
//             type: "plain_text",
//             text: "HIPAA/PCI",
//             emoji: true
//           },
//           options: [
//             {
//               text: {
//                 type: "plain_text",
//                 text: "true",
//                 emoji: true
//               },
//               value: "true"
//             },
//             {
//               text: {
//                 type: "plain_text",
//                 text: "false",
//                 emoji: true
//               },
//               value: "false"
//             },
//           ],
//           action_id: "hipaa_input"
//         },
//         label: {
//           type: "plain_text",
//           text: "HIPAA/PCI (T/F)",
//           emoji: true
//         }
//       } ,{
//         type: "input",
//         block_id: 'details_ddaa_tf',
//         element: {
//           type: "static_select",
//           placeholder: {
//             type: "plain_text",
//             text: "DDAA",
//             emoji: true
//           },
//           options: [
//             {
//               text: {
//                 type: "plain_text",
//                 text: "true",
//                 emoji: true
//               },
//               value: "true"
//             },
//             {
//               text: {
//                 type: "plain_text",
//                 text: "false",
//                 emoji: true
//               },
//               value: "false"
//             },
//           ],
//           action_id: "ddaa_input"
//         },
//         label: {
//           type: "plain_text",
//           text: "DDAA (T/F)",
//           emoji: true
//         }
//       } ,{
//         type: "input",
//         block_id: 'details_encrption_tf',
//         element: {
//           type: "static_select",
//           placeholder: {
//             type: "plain_text",
//             text: "Encryption",
//             emoji: true
//           },
//           options: [
//             {
//               text: {
//                 type: "plain_text",
//                 text: "true",
//                 emoji: true
//               },
//               value: "true"
//             },
//             {
//               text: {
//                 type: "plain_text",
//                 text: "false",
//                 emoji: true
//               },
//               value: "false"
//             },
//           ],
//           action_id: "encryption_input"
//         },
//         label: {
//           type: "plain_text",
//           text: "Encryption (T/F)",
//           emoji: true
//         }
//       },
//       {
//         "type": "section",
//         "text": {
//           "type": "mrkdwn",
//           "text": "POC"
//         },
//         "accessory": {
//           "type": "checkboxes",
//           "options": [
//             {
//               "text": {
//                 "type": "mrkdwn",
//                 "text": "POC"


//               },

//               "value": "value-0"
//             },
//           ]
//         }
//       }
//     ]
//   })
// })

//get the input value from "details-action" checkboxes action, only in text, split all selections by space
app.action('details-action', async ({ body, ack, say }) => {
  await ack();
  let details = body.actions[0].selected_options.map((option) => option.value).join(' ');
  await say(`<@${body.user.id}> selected ${details}`);
})


app.message('Menu', async ({ message, say }) => {
  await say({
    "blocks": [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "Hello, Assistant to the Regional Manager Dwight! *Michael Scott* wants to know where you'd like to take the Paper Company investors to dinner tonight.\n\n *Please select a restaurant:*"
        }
      },
      {
        "type": "divider"
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "*Farmhouse Thai Cuisine*\n:star::star::star::star: 1528 reviews\n They do have some vegan options, like the roti and curry, plus they have a ton of salad stuff and noodles can be ordered without meat!! They have something for everyone here"
        },
        "accessory": {
          "type": "image",
          "image_url": "https://s3-media3.fl.yelpcdn.com/bphoto/c7ed05m9lC2EmA3Aruue7A/o.jpg",
          "alt_text": "alt text for image"
        }
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "*Kin Khao*\n:star::star::star::star: 1638 reviews\n The sticky rice also goes wonderfully with the caramelized pork belly, which is absolutely melt-in-your-mouth and so soft."
        },
        "accessory": {
          "type": "image",
          "image_url": "https://s3-media2.fl.yelpcdn.com/bphoto/korel-1YjNtFtJlMTaC26A/o.jpg",
          "alt_text": "alt text for image"
        }
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "*Ler Ros*\n:star::star::star::star: 2082 reviews\n I would really recommend the  Yum Koh Moo Yang - Spicy lime dressing and roasted quick marinated pork shoulder, basil leaves, chili & rice powder."
        },
        "accessory": {
          "type": "image",
          "image_url": "https://s3-media2.fl.yelpcdn.com/bphoto/DawwNigKJ2ckPeDeDM7jAg/o.jpg",
          "alt_text": "alt text for image"
        }
      },
      {
        "type": "divider"
      },
      {
        "type": "actions",
        "elements": [
          {
            "type": "button",
            "text": {
              "type": "plain_text",
              "text": "Farmhouse",
              "emoji": true
            },
            "value": "click_me_123"
          },
          {
            "type": "button",
            "text": {
              "type": "plain_text",
              "text": "Kin Khao",
              "emoji": true
            },
            "value": "click_me_123",
            "url": "https://google.com"
          },
          {
            "type": "button",
            "text": {
              "type": "plain_text",
              "text": "Ler Ros",
              "emoji": true
            },
            "value": "click_me_123",
            "url": "https://google.com"
          }
        ]
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "Test block with multi static select"
        },
        "accessory": {
          "type": "multi_static_select",
          "placeholder": {
            "type": "plain_text",
            "text": "Select options",
            "emoji": true
          },
          "options": [
            {
              "text": {
                "type": "plain_text",
                "text": "*this is plain_text text*",
                "emoji": true
              },
              "value": "value-0"
            },
            {
              "text": {
                "type": "plain_text",
                "text": "*this is plain_text text*",
                "emoji": true
              },
              "value": "value-1"
            },
            {
              "text": {
                "type": "plain_text",
                "text": "*this is plain_text text*",
                "emoji": true
              },
              "value": "value-2"
            }
          ],
          "action_id": "multi_static_select-action"
        }
      },
      {
        "type": "actions",
        "elements": [
          {
            "type": "conversations_select",
            "placeholder": {
              "type": "plain_text",
              "text": "Select a conversation",
              "emoji": true
            },
            "action_id": "actionId-0"
          },
          {
            "type": "channels_select",
            "placeholder": {
              "type": "plain_text",
              "text": "Select a channel",
              "emoji": true
            },
            "action_id": "actionId-1"
          },
          {
            "type": "users_select",
            "placeholder": {
              "type": "plain_text",
              "text": "Select a user",
              "emoji": true
            },
            "action_id": "actionId-2"
          },
          {
            "type": "static_select",
            "placeholder": {
              "type": "plain_text",
              "text": "Select an item",
              "emoji": true
            },
            "options": [
              {
                "text": {
                  "type": "plain_text",
                  "text": "*this is plain_text text*",
                  "emoji": true
                },
                "value": "value-0"
              },
              {
                "text": {
                  "type": "plain_text",
                  "text": "*this is plain_text text*",
                  "emoji": true
                },
                "value": "value-1"
              },
              {
                "text": {
                  "type": "plain_text",
                  "text": "*this is plain_text text*",
                  "emoji": true
                },
                "value": "value-2"
              }
            ],
            "action_id": "actionId-3"
          }
        ]
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "Test block with users select"
        },
        "accessory": {
          "type": "users_select",
          "placeholder": {
            "type": "plain_text",
            "text": "Select a user",
            "emoji": true
          },
          "action_id": "users_select-action"
        }
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "Pick an item from the dropdown list"
        },
        "accessory": {
          "type": "static_select",
          "placeholder": {
            "type": "plain_text",
            "text": "Select an item",
            "emoji": true
          },
          "options": [
            {
              "text": {
                "type": "plain_text",
                "text": "*this is plain_text text*",
                "emoji": true
              },
              "value": "value-0"
            },
            {
              "text": {
                "type": "plain_text",
                "text": "*this is plain_text text*",
                "emoji": true
              },
              "value": "value-1"
            },
            {
              "text": {
                "type": "plain_text",
                "text": "*this is plain_text text*",
                "emoji": true
              },
              "value": "value-2"
            }
          ],
          "action_id": "static_select-action"
        }
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "This is a section block with a button."
        },
        "accessory": {
          "type": "button",
          "text": {
            "type": "plain_text",
            "text": "Click Me",
            "emoji": true
          },
          "value": "click_me_123",
          "action_id": "button-action"
        }
      }
    ]
  })
})

//get the input value from 'users_select-action' action, only in text
app.action('users_select-action', async ({ body, ack, say }) => {
  await ack();
  await say(`<@${body.user.id}> selected <@${body.actions[0].selected_user}>`);
  //await say(`<@${body.user.id}> selected <@${body.actions[0].selected_user}>`);

})


//get the input value from "cloudprovider-action" action, only in text
app.action('cloudprovider-action', async ({ body, ack, say }) => {
  await ack();
  await say(`<@${body.user.id}> selected ${body.actions[0].selected_option.text.text}`);
})


app.action('button_click', async ({ body, ack, say }) => {
  // Acknowledge the action
  await ack();
  await say(`<@${body.user.id}> clicked the button`);

});

//original version we need it
// app.command('/p2splunk', async ({ command, ack, body, client }) => {
//   await ack();
//   try {
//     const result = await client.views.open({
//       trigger_id: body.trigger_id,
//       view: {
//         type: 'modal',
//         callback_id: 'p2splunk-submit',
//         title: {
//           type: 'plain_text',
//           text: 'Product Packaging Splunk'
//         },
//         blocks: [{
//           type: "input",
//           block_id: 'stack_name',
//           label: {
//             type: 'plain_text',
//             text: 'Stack Name'
//           },
//           element: {
//             type: 'plain_text_input',
//             action_id: 'stackname_input',
//           }
//         }, {
//           type: "input",
//           block_id: 'cloud_provider',
//           element: {
//             type: "static_select",
//             placeholder: {
//               type: "plain_text",
//               text: "Select a cloud provider",
//               emoji: true
//             },
//             options: [
//               {
//                 text: {
//                   type: "plain_text",
//                   text: "AWS",
//                   emoji: true
//                 },
//                 value: "aws"
//               },
//               {
//                 text: {
//                   type: "plain_text",
//                   text: "GCP",
//                   emoji: true
//                 },
//                 value: "gcp"
//               },
//               {
//                 text: {
//                   type: "plain_text",
//                   text: "FedRamp",
//                   emoji: true
//                 },
//                 value: "fedramp"
//               }
//             ],
//             action_id: "cloud_provider_input"
//           },
//           label: {
//             type: "plain_text",
//             text: "Region",
//             emoji: true
//           }
//         }, {
//           type: "input",
//           block_id: 'region',
//           element: {
//             type: "static_select",
//             placeholder: {
//               type: "plain_text",
//               text: "Select a region",
//               emoji: true
//             },
//             options: [
//               {
//                 text: {
//                   type: "plain_text",
//                   text: "us-east-1 (N. Virginia)",
//                   emoji: true
//                 },
//                 value: "us-east1"
//               },
//               {
//                 text: {
//                   type: "plain_text",
//                   text: "us-west-2 (Oregon)",
//                   emoji: true
//                 },
//                 value: "us-west2"
//               },
//               {
//                 text: {
//                   type: "plain_text",
//                   text: "ca-central-1",
//                   emoji: true
//                 },
//                 value: "ca-central-1"
//               }
//             ],
//             action_id: "region_input"
//           },
//           label: {
//             type: "plain_text",
//             text: "Cloud Provider",
//             emoji: true
//           }
//         },
//         {
//           "type": "section",
//           "text": {
//             "type": "mrkdwn",
//             "text": "Details"
//           },
//           "accessory": {
//             "type": "multi_static_select",
//             "placeholder": {
//               "type": "plain_text",
//               "text": "Select options",
//               "emoji": true
//             },
//             "options": [
//               {
//                 "text": {
//                   "type": "plain_text",
//                   "text": "Net New *",
//                   "emoji": true
//                 },
//                 "value": "value-0"
//               },
//               {
//                 "text": {
//                   "type": "plain_text",
//                   "text": "Requesting IDM",
//                   "emoji": true
//                 },
//                 "value": "value-1"
//               },
//               {
//                 "text": {
//                   "type": "plain_text",
//                   "text": "Encryption",
//                   "emoji": true
//                 },
//                 "value": "value-2"
//               }
//             ],
//             "action_id": "multi_static_select-action"
//           }
//         }
//         ], submit: {
//           type: 'plain_text',
//           text: 'Submit',
//         }
//       }
//     })
//   } catch (error) {
//     console.error(error);
//   }
// });


// app.action({ 'callback_id': 'p2splunk-submit' }, async ({ ack, body, context }) => {
//   await ack();
//   try {
//     const result = await app.client.views.open({
//       token: context.botToken,
//       view_id: body.view.id,
//       trigger_id: body.trigger_id,
//       // View payload with updated blocks
//       view: {
//         // View identifier
//         type: "modal",
//         callback_id: 'p2splunk-submit',
//         title: {
//           type: "plain_text",
//           text: "Search Results",
//           emoji: true
//         },
//         submit: {
//           type: "plain_text",
//           text: "Submit"
//         },
//         blocks: [
//           {
//             type: "section",
//             text: {
//               type: "mrkdwn",
//               text: "Updated."
//             },
//           }
//         ]
//       }
//     });
//     console.log(result);
//   }
//   catch (error) {
//     console.error(error);
//   }
// });

//check the argument after command /p2splunk is aws or gcp, if it is aws, generate a modal view, if is gcp, generate different view
app.command('/p2splunk', async ({ command, ack, body, client }) => {
  await ack();
  let cloud_provider = command.text;
  let msg = JSON.stringify("");
  if (cloud_provider == "aws") {
    try {
      const result = await client.views.open({
        trigger_id: body.trigger_id,
        view_id: "abcde",
        hash: "156772938.1827394",
        view: {
          type: 'modal',
          callback_id: 'p2splunk-submit',
          title: {
            type: 'plain_text',
            text: 'Product Packaging Splunk'
          },
          blocks: [{
            type: "input",
            block_id: 'stack_name',
            label: {
              type: 'plain_text',
              text: 'Stack Name'
            },
            element: {
              type: 'plain_text_input',
              action_id: 'stackname_input',
              initial_value: userInputData['stack_name'] || ''
            }
           }, {
            type: "input",
            block_id: 'cloud_provider',
            element: {
              type: "static_select",
              placeholder: {
                type: "plain_text",
                text: "Select a cloud provider",
                emoji: true
              },
              options: [
                {
                  text: {
                    type: "plain_text",
                    text: "AWS",
                    emoji: true
                  },
                  value: "aws"
                },
                {
                  text: {
                    type: "plain_text",
                    text: "GCP",
                    emoji: true
                  },
                  value: "gcp"
                },
                {
                  text: {
                    type: "plain_text",
                    text: "FedRamp",
                    emoji: true
                  },
                  value: "fedramp"
                }
              ],
              action_id: "cloud_provider_input",
              initial_option: {
                text: {
                  type: 'plain_text',
                  text: 'AWS',
                  emoji: true,
                },
                value: 'aws',
              },

            },
            label: {
              type: "plain_text",
              text: "Cloud Provider(AWS)",
              emoji: true
            }
          },
          {
            "type": "section",
            "text": {
              "type": "plain_text",
              "text": "Choose a Cloud Provider",
              "emoji": true,
             
            }
          },
          {
            "type": "actions",
            "block_id": "three_buttons",
            "elements": [
              {
                "type": "button",
                "text": {
                  "type": "plain_text",
                  "text": "AWS",
                  "emoji": true
                },
                "value": "aws",
                "action_id": "button-action_aws"
              },
              {
                "type": "button",
                "text": {
                  "type": "plain_text",
                  "text": "GCP",
                  "emoji": true
                },
                "value": "gcp",
                "action_id": "button-action_gcp"
              },
              {
                "type": "button",
                "text": {
                  "type": "plain_text",
                  "text": "FedRamp",
                  "emoji": true
                },
                "value": "fedramp",
                "action_id": "button-action_fedramp"
              }
            ]
          },{
            type: "input",
            block_id: 'region',
            element: {
              type: "static_select",
              placeholder: {
                type: "plain_text",
                text: "Select a region",
                emoji: true
              },
              options: [
                {
                  text: {
                    type: "plain_text",
                    text: "us-east-1 (N. Virginia)",
                    emoji: true
                  },
                  value: "us-east-1"
                },
                {
                  text: {
                    type: "plain_text",
                    text: "us-west-2 (Oregon)",
                    emoji: true
                  },
                  value: "us-west-2"
                },
                {
                  text: {
                    type: "plain_text",
                    text: "ca-central-1 (Canada)",
                    emoji: true
                  },
                  value: "ca-central-1"
                },
                {
                  text: {
                    type: "plain_text",
                    text: "eu-west-1 (Ireland)",
                    emoji: true
                  },
                  value: "eu-west-1"
                },
                {
                  text: {
                    type: "plain_text",
                    text: "eu-west-2 (London)",
                    emoji: true
                  },
                  value: "eu-west-2"
                },
                {
                  text: {
                    type: "plain_text",
                    text: "eu-west-3 (Paris)",
                    emoji: true
                  },
                  value: "eu-west-3"
                },
                {
                  text: {
                    type: "plain_text",
                    text: "eu-central-1 (Frankfurt)",
                    emoji: true
                  },
                  value: "eu-central-1"
                },
                {
                  text: {
                    type: "plain_text",
                    text: "eu-north-1 (Stockholm)",
                    emoji: true
                  },
                  value: "eu-north-1"
                },
                {
                  text: {
                    type: "plain_text",
                    text: "ap-south-1 (Mumbai)",
                    emoji: true
                  },
                  value: "ap-south-1"
                },
                {
                  text: {
                    type: "plain_text",
                    text: "ap-northeast-1 (Tokyo)",
                    emoji: true
                  },
                  value: "ap-norteast-1"
                },
                {
                  text: {
                    type: "plain_text",
                    text: "ap-northeast-2 (Seoul)",
                    emoji: true
                  },
                  value: "ap-norteast-2"
                },
                {
                  text: {
                    type: "plain_text",
                    text: "ap-southeast-1 (Singapore)",
                    emoji: true
                  },
                  value: "ap-southeast-1"
                },
                {
                  text: {
                    type: "plain_text",
                    text: "ap-southeast-2 (Sydney)",
                    emoji: true
                  },
                  value: "ap-southeast-2"
                }
              ],
              action_id: "region_input",
              initial_option: {
                text: {
                  type: 'plain_text',
                  text: 'us-east-1 (N. Virginia)',
                  emoji: true,
                },
                value: 'us-east-1',
              },
            },
            label: {
              type: "plain_text",
              text: "Region",
              emoji: true
            }
          }, {
            type: "input",
            block_id: 'poc_tf',
            element: {
              type: "static_select",
              placeholder: {
                type: "plain_text",
                text: "POC",
                emoji: true
              },
              options: [
                {
                  text: {
                    type: "plain_text",
                    text: "true",
                    emoji: true
                  },
                  value: "true"
                },
                {
                  text: {
                    type: "plain_text",
                    text: "false",
                    emoji: true
                  },
                  value: "false"
                },
              ],
              action_id: "poc_tf_input"
            },
            label: {
              type: "plain_text",
              text: "POC(T/F)",
              emoji: true
            }
          }, {
            type: "input",
            block_id: 'poc_type',
            element: {
              type: "static_select",
              placeholder: {
                type: "plain_text",
                text: "Choose a poc type",
                emoji: true
              },
              options: [
                {
                  text: {
                    type: "plain_text",
                    text: "N/A",
                    emoji: true
                  },
                  value: "n/a"
                },
                {
                  text: {
                    type: "plain_text",
                    text: "Autobahn",
                    emoji: true
                  },
                  value: "autobahn"
                },
                {
                  text: {
                    type: "plain_text",
                    text: "Custom",
                    emoji: true
                  },
                  value: "custom"
                }
              ],
              action_id: "poc_type_input"
            },
            label: {
              type: "plain_text",
              text: "POC Type",
              emoji: true
            }
          }, {
            type: "input",
            block_id: 'autobahn_lane',
            element: {
              type: "static_select",
              placeholder: {
                type: "plain_text",
                text: "Select a Autobahn line",
                emoji: true
              },
              options: [
                {
                  text: {
                    type: "plain_text",
                    text: "AWS Monitoring POV",
                    emoji: true
                  },
                  value: "AWS Monitoring POV"
                },
                {
                  text: {
                    type: "plain_text",
                    text: "Contact Center Analytics POV",
                    emoji: true
                  },
                  value: "Contact Center Analytics POV"
                }, {
                  text: {
                    type: "plain_text",
                    text: "Enterprise Security POV",
                    emoji: true
                  },
                  value: "Enterprise Security POV"
                }, {
                  text: {
                    type: "plain_text",
                    text: "Infosec App POV",
                    emoji: true
                  },
                  value: "Infosec App POV"
                }, {
                  text: {
                    type: "plain_text",
                    text: "Infrastructure Monitoring and Troubleshooting POV",
                    emoji: true
                  },
                  value: "Infrastructure Monitoring and Troubleshootng POV"
                }, {
                  text: {
                    type: "plain_text",
                    text: "IT Foundations POV",
                    emoji: true
                  },
                  value: "IT Foundations POV"
                }, {
                  text: {
                    type: "plain_text",
                    text: "IT Ops Essentials POV",
                    emoji: true
                  },
                  value: "IT Ops Essentials POV"
                }, {
                  text: {
                    type: "plain_text",
                    text: "ITOM Modernization POV",
                    emoji: true
                  },
                  value: "ITOM Modernization POV"
                }, {
                  text: {
                    type: "plain_text",
                    text: "OT Security POV",
                    emoji: true
                  },
                  value: "OT Security POV"
                }, {
                  text: {
                    type: "plain_text",
                    text: "Remote Work Insights POV",
                    emoji: true
                  },
                  value: "Remote Work Insights POV"
                }, {
                  text: {
                    type: "plain_text",
                    text: "Security Essentials POV",
                    emoji: true
                  },
                  value: "Security Essentials POV"
                }, {
                  text: {
                    type: "plain_text",
                    text: "Website Fraud POV",
                    emoji: true
                  },
                  value: "Website Fraud POV"
                }, {
                  text: {
                    type: "plain_text",
                    text: "Website Operations POV",
                    emoji: true
                  },
                  value: "Website Operations POV"
                }
              ],
              action_id: "autobahn_lane_input"
            },
            label: {
              type: "plain_text",
              text: "Autobaun Line",
              emoji: true
            }
          }, {
            type: "input",
            block_id: 'entitlements',
            element: {
              type: "static_select",
              placeholder: {
                type: "plain_text",
                text: "Select an entitlement",
                emoji: true
              },
              options: [
                {
                  text: {
                    type: "plain_text",
                    text: "Ingest",
                    emoji: true
                  },
                  value: "ingest"
                },
                {
                  text: {
                    type: "plain_text",
                    text: "SVCs",
                    emoji: true
                  },
                  value: "svcs"
                },

              ],
              action_id: "entitlements_input",
              initial_option: {
                text: {
                  type: 'plain_text',
                  text: 'Ingest',
                  emoji: true,
                },
                value: 'ingest',
              },
            },
            label: {
              type: "plain_text",
              text: "Entitlements",
              emoji: true
            }
          },
          {
            type: "input",
            block_id: 'details_netnew_tf',
            element: {
              type: "static_select",
              placeholder: {
                type: "plain_text",
                text: "Net New*",
                emoji: true
              },
              options: [
                {
                  text: {
                    type: "plain_text",
                    text: "true",
                    emoji: true
                  },
                  value: "true"
                },
                {
                  text: {
                    type: "plain_text",
                    text: "false",
                    emoji: true
                  },
                  value: "false"
                },
              ],
              action_id: "netnew_input"
            },
            label: {
              type: "plain_text",
              text: "Net New*(T/F)",
              emoji: true
            }
          }, {
            type: "input",
            block_id: 'details_ridm_tf',
            element: {
              type: "static_select",
              placeholder: {
                type: "plain_text",
                text: "Requesting IDM",
                emoji: true
              },
              options: [
                {
                  text: {
                    type: "plain_text",
                    text: "true",
                    emoji: true
                  },
                  value: "true"
                },
                {
                  text: {
                    type: "plain_text",
                    text: "false",
                    emoji: true
                  },
                  value: "false"
                },
              ],
              action_id: "irdm_input"
            },
            label: {
              type: "plain_text",
              text: "Requesting IDM (T/F)",
              emoji: true
            }
          }, {
            type: "input",
            block_id: 'details_hipaa_tf',
            element: {
              type: "static_select",
              placeholder: {
                type: "plain_text",
                text: "HIPAA/PCI",
                emoji: true
              },
              options: [
                {
                  text: {
                    type: "plain_text",
                    text: "true",
                    emoji: true
                  },
                  value: "true"
                },
                {
                  text: {
                    type: "plain_text",
                    text: "false",
                    emoji: true
                  },
                  value: "false"
                },
              ],
              action_id: "hipaa_input"
            },
            label: {
              type: "plain_text",
              text: "HIPAA/PCI (T/F)",
              emoji: true
            }
          }, {
            type: "input",
            block_id: 'details_ddaa_tf',
            element: {
              type: "static_select",
              placeholder: {
                type: "plain_text",
                text: "DDAA",
                emoji: true
              },
              options: [
                {
                  text: {
                    type: "plain_text",
                    text: "true",
                    emoji: true
                  },
                  value: "true"
                },
                {
                  text: {
                    type: "plain_text",
                    text: "false",
                    emoji: true
                  },
                  value: "false"
                },
              ],
              action_id: "ddaa_input"
            },
            label: {
              type: "plain_text",
              text: "DDAA (T/F)",
              emoji: true
            }
           }, {
            type: "input",
            block_id: 'details_encryption_tf',
            element: {
              type: "static_select",
              placeholder: {
                type: "plain_text",
                text: "Encryption",
                emoji: true
              },
              options: [
                {
                  text: {
                    type: "plain_text",
                    text: "true",
                    emoji: true
                  },
                  value: "true"
                },
                {
                  text: {
                    type: "plain_text",
                    text: "false",
                    emoji: true
                  },
                  value: "false"
                },
              ],
              action_id: "encryption_input"
            },
            label: {
              type: "plain_text",
              text: "Encryption (T/F)",
              emoji: true
            }
           }, {
            type: "input",
            block_id: 'existing_noah_tf',
            element: {
              type: "static_select",
              placeholder: {
                type: "plain_text",
                text: "Noah",
                emoji: true
              },
              options: [
                {
                  text: {
                    type: "plain_text",
                    text: "true",
                    emoji: true
                  },
                  value: "true"
                },
                {
                  text: {
                    type: "plain_text",
                    text: "false",
                    emoji: true
                  },
                  value: "false"
                },
              ],
              action_id: "existing_noah_input"
            },
            label: {
              type: "plain_text",
              text: "Noah (T/F)",
              emoji: true
            }
           }, {
            type: "input",
            block_id: 'existing_idm_tf',
            element: {
              type: "static_select",
              placeholder: {
                type: "plain_text",
                text: "IDM",
                emoji: true
              },
              options: [
                {
                  text: {
                    type: "plain_text",
                    text: "true",
                    emoji: true
                  },
                  value: "true"
                },
                {
                  text: {
                    type: "plain_text",
                    text: "false",
                    emoji: true
                  },
                  value: "false"
                },
              ],
              action_id: "existing_idm_input"
            },
            label: {
              type: "plain_text",
              text: "IDM (T/F)",
              emoji: true
            }
           }, {
            type: "input",
            block_id: 'existing_im4gn_tf',
            element: {
              type: "static_select",
              placeholder: {
                type: "plain_text",
                text: "Im4gn Indexers",
                emoji: true
              },
              options: [
                {
                  text: {
                    type: "plain_text",
                    text: "true",
                    emoji: true
                  },
                  value: "true"
                },
                {
                  text: {
                    type: "plain_text",
                    text: "false",
                    emoji: true
                  },
                  value: "false"
                },
              ],
              action_id: "existing_im4gn_input"
            },
            label: {
              type: "plain_text",
              text: "Im4gn Indexers (T/F)",
              emoji: true
            }
           }, {
            type: "input",
            block_id: 'existing_i3en_tf',
            element: {
              type: "static_select",
              placeholder: {
                type: "plain_text",
                text: "I3en Indexers",
                emoji: true
              },
              options: [
                {
                  text: {
                    type: "plain_text",
                    text: "true",
                    emoji: true
                  },
                  value: "true"
                },
                {
                  text: {
                    type: "plain_text",
                    text: "false",
                    emoji: true
                  },
                  value: "false"
                },
              ],
              action_id: "existing_i3en_input"
            },
            label: {
              type: "plain_text",
              text: "I3en Indexers(T/F)",
              emoji: true
            }
           }, {
            type: "input",
            block_id: 'existing_x6i_tf',
            element: {
              type: "static_select",
              placeholder: {
                type: "plain_text",
                text: "X6i Instances",
                emoji: true
              },
              options: [
                {
                  text: {
                    type: "plain_text",
                    text: "true",
                    emoji: true
                  },
                  value: "true"
                },
                {
                  text: {
                    type: "plain_text",
                    text: "false",
                    emoji: true
                  },
                  value: "false"
                },
              ],
              action_id: "existing_x6i_input"
            },
            label: {
              type: "plain_text",
              text: "X6i Instances(T/F)",
              emoji: true
            }
           }, {
            type: "input",
            block_id: 'cloud_number',
            label: {
              type: 'plain_text',
              text: 'Cloud'
            },
            element: {
              type: 'plain_text_input',
              action_id: 'cloud_num_input',
              initial_value: '5'
            }
           }, {
            type: "input",
            block_id: 'es_number',
            label: {
              type: 'plain_text',
              text: 'ES'
            },
            element: {
              type: 'plain_text_input',
              action_id: 'es_num_input',
              initial_value: '0'
            }
           }, {
            type: "input",
            block_id: 'itsi_number',
            label: {
              type: 'plain_text',
              text: 'ITSI'
            },
            element: {
              type: 'plain_text_input',
              action_id: 'itsi_num_input',
              initial_value: '0'
            }
           }, {
            type: "input",
            block_id: 'pci_number',
            label: {
              type: 'plain_text',
              text: 'PCI'
            },
            element: {
              type: 'plain_text_input',
              action_id: 'pci_num_input',
              initial_value: '0'
            }
           }, {
            type: "input",
            block_id: 'vmware_number',
            label: {
              type: 'plain_text',
              text: 'VMWare'
            },
            element: {
              type: 'plain_text_input',
              action_id: 'vmware_num_input',
              initial_value: '0'
            }
           }, {
            type: "input",
            block_id: 'exchange_number',
            label: {
              type: 'plain_text',
              text: 'Exchange'
            },
            element: {
              type: 'plain_text_input',
              action_id: 'exchange_num_input',
              initial_value: '0'
            }
           },

          ], submit: {
            type: 'plain_text',
            text: 'Submit',
          }
        }
      })
    } catch (error) {
      console.error(error);
    }
  } else if (cloud_provider == "gcp") {
    try {
      const result = await client.views.open({
        trigger_id: body.trigger_id,
        view: {
          type: 'modal',
          callback_id: 'p2splunk-submit',
          title: {
            type: 'plain_text',
            text: 'Product Packaging Splunk'
          },
          blocks: [
            {
              type: "input",
              block_id: 'stack_name',
              label: {
                type: 'plain_text',
                text: 'Stack Name'
              },
              element: {
                type: 'plain_text_input',
                action_id: 'stackname_input',
              }
            }, {
              type: "input",
              block_id: 'cloud_provider',
              element: {
                type: "static_select",
                placeholder: {
                  type: "plain_text",
                  text: "Select a cloud provider",
                  emoji: true
                },
                options: [
                  {
                    text: {
                      type: "plain_text",
                      text: "AWS",
                      emoji: true
                    },
                    value: "aws"
                  },
                  {
                    text: {
                      type: "plain_text",
                      text: "GCP",
                      emoji: true
                    },
                    value: "gcp"
                  },
                  {
                    text: {
                      type: "plain_text",
                      text: "FedRamp",
                      emoji: true
                    },
                    value: "fedramp"
                  }
                ],
                action_id: "cloud_provider_input"
              },
              label: {
                type: "plain_text",
                text: "Cloud Provider(GCP)",
                emoji: true
              }
            }, {
              type: "input",
              block_id: 'region',
              element: {
                type: "static_select",
                placeholder: {
                  type: "plain_text",
                  text: "Select a region",
                  emoji: true
                },
                options: [
                  {
                    text: {
                      type: "plain_text",
                      text: "us-central-1 (lowa)",
                      emoji: true
                    },
                    value: "us-central1"
                  },
                  {
                    text: {
                      type: "plain_text",
                      text: "northamerica-northeast1 (Montrreal)",
                      emoji: true
                    },
                    value: "northamerica-northest1"
                  },
                  {
                    text: {
                      type: "plain_text",
                      text: "europe-west1 (Belgium)",
                      emoji: true
                    },
                    value: "europe-west1"
                  },
                  {
                    text: {
                      type: "plain_text",
                      text: "europe-west3 (Frankfrut)",
                      emoji: true
                    },
                    value: "europe-west3"
                  },
                  {
                    text: {
                      type: "plain_text",
                      text: "europe-west2 (London)",
                      emoji: true
                    },
                    value: "europe-west2"
                  },
                  {
                    text: {
                      type: "plain_text",
                      text: "asia-southeast1 (Singapore)",
                      emoji: true
                    },
                    value: "asia-southeast1"
                  },
                  {
                    text: {
                      type: "plain_text",
                      text: "australia-southeast1 (Syndney)",
                      emoji: true
                    },
                    value: "australia-southeast1"
                  },


                ],
                action_id: "region_input"
              },
              label: {
                type: "plain_text",
                text: "Region",
                emoji: true
              }
            }, {
              type: "input",
              block_id: 'poc_tf',
              element: {
                type: "static_select",
                placeholder: {
                  type: "plain_text",
                  text: "POC",
                  emoji: true
                },
                options: [
                  {
                    text: {
                      type: "plain_text",
                      text: "true",
                      emoji: true
                    },
                    value: "true"
                  },
                  {
                    text: {
                      type: "plain_text",
                      text: "false",
                      emoji: true
                    },
                    value: "false"
                  },
                ],
                action_id: "poc_tf_input"
              },
              label: {
                type: "plain_text",
                text: "POC(T/F)",
                emoji: true
              }
            }, {
              type: "input",
              block_id: 'existing_idm_tf',
              element: {
                type: "static_select",
                placeholder: {
                  type: "plain_text",
                  text: "IDM",
                  emoji: true
                },
                options: [
                  {
                    text: {
                      type: "plain_text",
                      text: "true",
                      emoji: true
                    },
                    value: "true"
                  },
                  {
                    text: {
                      type: "plain_text",
                      text: "false",
                      emoji: true
                    },
                    value: "false"
                  },
                ],
                action_id: "existing_idm_input"
              },
              label: {
                type: "plain_text",
                text: "IDM (T/F)",
                emoji: true
              }
            }, {
              type: "input",
              block_id: 'entitlements',
              element: {
                type: "static_select",
                placeholder: {
                  type: "plain_text",
                  text: "Select an entitlement",
                  emoji: true
                },
                options: [
                  {
                    text: {
                      type: "plain_text",
                      text: "Ingest",
                      emoji: true
                    },
                    value: "ingest"
                  },
                  {
                    text: {
                      type: "plain_text",
                      text: "SVCs",
                      emoji: true
                    },
                    value: "svcs"
                  },

                ],
                action_id: "entitlements_input",
                initial_option: {
                  text: {
                    type: 'plain_text',
                    text: 'Ingest',
                    emoji: true,
                  },
                  value: 'ingest',
                },
              },
              label: {
                type: "plain_text",
                text: "Entitlements",
                emoji: true
              }
            },
            {
              type: "input",
              block_id: 'details_netnew_tf',
              element: {
                type: "static_select",
                placeholder: {
                  type: "plain_text",
                  text: "Net New*",
                  emoji: true
                },
                options: [
                  {
                    text: {
                      type: "plain_text",
                      text: "true",
                      emoji: true
                    },
                    value: "true"
                  },
                  {
                    text: {
                      type: "plain_text",
                      text: "false",
                      emoji: true
                    },
                    value: "false"
                  },
                ],
                action_id: "netnew_input"
              },
              label: {
                type: "plain_text",
                text: "Net New*(T/F)",
                emoji: true
              }
            }, {
              type: "input",
              block_id: 'details_ridm_tf',
              element: {
                type: "static_select",
                placeholder: {
                  type: "plain_text",
                  text: "Requesting IDM",
                  emoji: true
                },
                options: [
                  {
                    text: {
                      type: "plain_text",
                      text: "true",
                      emoji: true
                    },
                    value: "true"
                  },
                  {
                    text: {
                      type: "plain_text",
                      text: "false",
                      emoji: true
                    },
                    value: "false"
                  },
                ],
                action_id: "irdm_input"
              },
              label: {
                type: "plain_text",
                text: "Requesting IDM (T/F)",
                emoji: true
              }
            }, {
              type: "input",
              block_id: 'details_encryption_tf',
              element: {
                type: "static_select",
                placeholder: {
                  type: "plain_text",
                  text: "Encryption",
                  emoji: true
                },
                options: [
                  {
                    text: {
                      type: "plain_text",
                      text: "true",
                      emoji: true
                    },
                    value: "true"
                  },
                  {
                    text: {
                      type: "plain_text",
                      text: "false",
                      emoji: true
                    },
                    value: "false"
                  },
                ],
                action_id: "encryption_input"
              },
              label: {
                type: "plain_text",
                text: "Encryption (T/F)",
                emoji: true
              }
            }, {
              type: "input",
              block_id: 'cloud_number',
              label: {
                type: 'plain_text',
                text: 'Cloud'
              },
              element: {
                type: 'plain_text_input',
                action_id: 'cloud_num_input',
              }
            }, {
              type: "input",
              block_id: 'es_number',
              label: {
                type: 'plain_text',
                text: 'ES'
              },
              element: {
                type: 'plain_text_input',
                action_id: 'es_num_input',
              }
            }, {
              type: "input",
              block_id: 'itsi_number',
              label: {
                type: 'plain_text',
                text: 'ITSI'
              },
              element: {
                type: 'plain_text_input',
                action_id: 'itsi_num_input',
              }
            }, {
              type: "input",
              block_id: 'pci_number',
              label: {
                type: 'plain_text',
                text: 'PCI'
              },
              element: {
                type: 'plain_text_input',
                action_id: 'pci_num_input',
              }
            }, {
              type: "input",
              block_id: 'vmware_number',
              label: {
                type: 'plain_text',
                text: 'VMWare'
              },
              element: {
                type: 'plain_text_input',
                action_id: 'vmware_num_input',
              }
            }, {
              type: "input",
              block_id: 'exchange_number',
              label: {
                type: 'plain_text',
                text: 'Exchange'
              },
              element: {
                type: 'plain_text_input',
                action_id: 'exchange_num_input',
              }
            },

          ], submit: {
            type: 'plain_text',
            text: 'Submit',
          }
        }
      })
    } catch (error) {
      console.error(error);
    }
  } else if (cloud_provider == "fedramp") {
    try {
      const result = await client.views.open({
        trigger_id: body.trigger_id,
        view: {
          type: 'modal',
          callback_id: 'p2splunk-submit',
          title: {
            type: 'plain_text',
            text: 'Product Packaging Splunk'
          },
          blocks: [
            {
              type: "input",
              block_id: 'stack_name',
              label: {
                type: 'plain_text',
                text: 'Stack Name'
              },
              element: {
                type: 'plain_text_input',
                action_id: 'stackname_input',
              }
            }, {
              type: "input",
              block_id: 'cloud_provider',
              element: {
                type: "static_select",
                placeholder: {
                  type: "plain_text",
                  text: "Select a cloud provider",
                  emoji: true
                },
                options: [
                  {
                    text: {
                      type: "plain_text",
                      text: "AWS",
                      emoji: true
                    },
                    value: "aws"
                  },
                  {
                    text: {
                      type: "plain_text",
                      text: "GCP",
                      emoji: true
                    },
                    value: "gcp"
                  },
                  {
                    text: {
                      type: "plain_text",
                      text: "Fedramp",
                      emoji: true
                    },
                    value: "fedramp"
                  }
                ],
                action_id: "cloud_provider_input"
              },
              label: {
                type: "plain_text",
                text: "Cloud Provider(Fedramp)",
                emoji: true
              }
            }, {
              type: "input",
              block_id: 'region',
              element: {
                type: "static_select",
                placeholder: {
                  type: "plain_text",
                  text: "Select a region",
                  emoji: true
                },
                options: [
                  {
                    text: {
                      type: "plain_text",
                      text: "us-gov-west-1 (US West)",
                      emoji: true
                    },
                    value: "us-gov-west-1"
                  },
                  {
                    text: {
                      type: "plain_text",
                      text: "us-gov-east-1 (US East)",
                      emoji: true
                    },
                    value: "us-gov-east-1"
                  },

                ],
                action_id: "region_input"
              },
              label: {
                type: "plain_text",
                text: "Region",
                emoji: true
              }
            },
            {
              type: "input",
              block_id: 'fredramp_type',
              element: {
                type: "static_select",
                placeholder: {
                  type: "plain_text",
                  text: "Select a Fredramp Type",
                  emoji: true
                },
                options: [
                  {
                    text: {
                      type: "plain_text",
                      text: "High",
                      emoji: true
                    },
                    value: "high"
                  },
                  {
                    text: {
                      type: "plain_text",
                      text: "Moderate",
                      emoji: true
                    },
                    value: "moderate"
                  }, {
                    text: {
                      type: "plain_text",
                      text: "IL5",
                      emoji: true
                    },
                    value: "il5"
                  },

                ],
                action_id: "region_input"
              },
              label: {
                type: "plain_text",
                text: "Fedramp Type",
                emoji: true
              }
            }, {
              type: "input",
              block_id: 'customer_classification',
              element: {
                type: "static_select",
                placeholder: {
                  type: "plain_text",
                  text: "Select a Customer Classification",
                  emoji: true
                },
                options: [
                  {
                    text: {
                      type: "plain_text",
                      text: "U.S. Gov: DoD/IC",
                      emoji: true
                    },
                    value: "U.S. Gov: DoD / IC"
                  },
                  {
                    text: {
                      type: "plain_text",
                      text: "State and Local Gov",
                      emoji: true
                    },
                    value: "State and Local Gov"
                  }, {
                    text: {
                      type: "plain_text",
                      text: "Non-Government",
                      emoji: true
                    },
                    value: "Non-Government"
                  },

                ],
                action_id: "region_input"
              },
              label: {
                type: "plain_text",
                text: "Customer Classification",
                emoji: true
              }
            }, {
              type: "input",
              block_id: 'entitlements',
              element: {
                type: "static_select",
                placeholder: {
                  type: "plain_text",
                  text: "Select an entitlement",
                  emoji: true
                },
                options: [
                  {
                    text: {
                      type: "plain_text",
                      text: "Ingest",
                      emoji: true
                    },
                    value: "ingest"
                  },
                  {
                    text: {
                      type: "plain_text",
                      text: "SVCs",
                      emoji: true
                    },
                    value: "svcs"
                  },

                ],
                action_id: "entitlements_input"
              },
              label: {
                type: "plain_text",
                text: "Entitlements",
                emoji: true
              }
            },
            {
              "type": "section",
              "text": {
                "type": "mrkdwn",
                "text": "Details"
              },
              "accessory": {
                "type": "multi_static_select",
                "placeholder": {
                  "type": "plain_text",
                  "text": "Select options",
                  "emoji": true
                },
                "options": [
                  {
                    "text": {
                      "type": "plain_text",
                      "text": "Net New *",
                      "emoji": true
                    },
                    "value": "net_new"
                  },
                  {
                    "text": {
                      "type": "plain_text",
                      "text": "Requesting IDM",
                      "emoji": true
                    },
                    "value": "idm"
                  },
                  {
                    "text": {
                      "type": "plain_text",
                      "text": "Encryption",
                      "emoji": true
                    },
                    "value": "encryption"
                  }
                ],
                "action_id": "multi_static_select-action"
              }
            }, {
              type: "input",
              block_id: 'cloud_number',
              label: {
                type: 'plain_text',
                text: 'Cloud'
              },
              element: {
                type: 'plain_text_input',
                action_id: 'cloud_num_input',
              }
            }, {
              type: "input",
              block_id: 'es_number',
              label: {
                type: 'plain_text',
                text: 'ES'
              },
              element: {
                type: 'plain_text_input',
                action_id: 'es_num_input',
              }
            }, {
              type: "input",
              block_id: 'itsi_number',
              label: {
                type: 'plain_text',
                text: 'ITSI'
              },
              element: {
                type: 'plain_text_input',
                action_id: 'itsi_num_input',
              }
            }, {
              type: "input",
              block_id: 'pci_number',
              label: {
                type: 'plain_text',
                text: 'PCI'
              },
              element: {
                type: 'plain_text_input',
                action_id: 'pci_num_input',
              }
            }, {
              type: "input",
              block_id: 'vmware_number',
              label: {
                type: 'plain_text',
                text: 'VMWare'
              },
              element: {
                type: 'plain_text_input',
                action_id: 'vmware_num_input',
              }
            }, {
              type: "input",
              block_id: 'exchange_number',
              label: {
                type: 'plain_text',
                text: 'Exchange'
              },
              element: {
                type: 'plain_text_input',
                action_id: 'exchange_num_input',
              }
            },

          ], submit: {
            type: 'plain_text',
            text: 'Submit',
          }
        }
      })
    } catch (error) {
      console.error(error);
    }
  }
});


//Listener for the action when a user selects an option in the modal
app.action('button-action_aws', async ({ ack, body, context, client }) => {
  try {
    await ack();
    const values = body.view.state.values;
   // const selectedOption = values.three_buttons.button-action_aws.value;
   const selectedOption = body.actions[0].value;
   const updatedView = updateModalView(body, selectedOption);
    if (selectedOption == "aws"){

    
    // Acknowledge the action request
    await ack({
      "response_action": "update",
      "view":  updatedView 
    });
    
    // Get the selected option value from the payload
    //const selectedOption = values.cloud_provider.cloud_provider_input.selected_option.value;
    console.log(selectedOption)
    // Call a function to update the modal view based on the selected option

    // Use apps.update to update the view
    await client.views.update({
     // token: process.env.SLACK_BOT_TOKEN,
      trigger_id: body.trigger_id,
      response_action: "update",
      view_id: body.view.id,
      view: updatedView,
     // hash:"156772938.1827394"
    });
  }
  } catch (error) {
    console.error('Error handling action:', error);
  }
});
function updateModalView(body, selectedOption) {
  // Create a new view object or modify the existing one based on the selected option
  const updatedView = {
    type: 'modal',
    callback_id: 'p2splunk-submit-update',
    title: {
      type: 'plain_text',
      text: 'Updated Modal Title',
    },
    blocks: [{
      type: "input",
      block_id: 'stack_name',
      label: {
        type: 'plain_text',
        text: 'Stack Name'
      },
      element: {
        type: 'plain_text_input',
        action_id: 'stackname_input',
        initial_value: userInputData['stack_name'] || ''
      }
    },{
      type: "input",
      block_id: "cloud_provider_update",
      // Add or modify blocks based on the selectedOption value
      // For example:
      label: {
        type: 'plain_text',
        text: 'Stack Name'
      },
      element: {
        type: 'plain_text_input',
        action_id: 'stackname_input',
      }
      },
      // Add other blocks as needed
    ], submit: {
      type: 'plain_text',
      text: 'Submit',
    }
  };

  return updatedView;
}
// app.action('p2splunk-submit', async ({ ack, body, view, client }) => {
//   // Acknowledge the action
//   await ack();
//   // console.log(JSON.stringify(body));//see the data getting passed
//   let msg = JSON.stringify("");


//   const user = body['user']['id'];
//   const values = body.view.state.values;
//   let stackname = values.stack_name.stackname_input.value;



//   //call sendRequest in ./helper and get response



//   let response = await sendRequest(body);
//   console.log(JSON.stringify(response));
//   //http call to local co2



//   //get all input fileds from the body
//   //call local co2
//   //map the field -> co2 json body
//   //call co2
//   //parse the respond back to the user




//   //const results = await createWpUpdate(body['user']['username'],body);

//   // if (results){
//   //   msg = 'Your update was successful.'
//   // } else {
//   //   msg = 'I am a failure but I do not know why.'
//   // }

//   //message the user 

//   try {
//     await client.chat.postMessage({
//       channel: user,
//       text: JSON.stringify(response)
//     });
//   }
//   catch (error) {
//     console.error(error);
//   }

// });

// create a body3 for all input: {"input":{"name":"tidy-toucan-urp","kind":"Stack","inputs":{"customerType":"Internal","type":"Clustered","region":"us-east-1"},"templates":[{"name":"stack/cloud_delivery/cda","inputs":{"order":{"cloud":"aws","net_new":false,"idm":false,"hipaa":false,"ddaa":false,"encryption":false,"poc":true,"poc_type":"Custom","autobahn_lane":"","existing":{"noah":false,"idm":false,"im4gn_indexers":false,"i3en_indexers":false,"x6i_instances":false},"ingest":{"cloud":5,"es":0,"itsi":0,"pci":0,"vmware":0,"exchange":0}}}}],"mixins":[]}}
// update modal view if /p2splunk the choice of cloud provider is aws
// app.action('cloud_provider_input', async ({ body, ack, say, view }) => {
//   await ack();
//   let cloud_provider = body.actions[0].selected_option.value;
//   let region = view.state.values.region.region_input.selected_option.value;
//   let stack_name = view.state.values.stack_name.stackname_input.value;
//   let details = view.state.values.multi_static_select['multi_static_select-action'].selected_options.map((option) => option.value).join(' ');
//   let msg = JSON.stringify("");
//   let response = await sendRequest(stack_name, cloud_provider, region, details);
//   console.log(JSON.stringify(response));
//   try {
//     await say({
//       "blocks": [
//         {
//           "type": "section",
//           "text": {
//             "type": "mrkdwn",
//             "text": JSON.stringify(response)
//           }
//         }
//       ]
//     });
//   }
//   catch (error) {
//     console.error(error);
//   }
// })



async function sendRequest_aws(body) {
  const local_url = 'http://localhost:8443/v3/translation/translate-order/stack'
  const url = 'https://api.co2.lve.splunkcloud.systems/v3/translation/translate-order/stack'
  const token = () => fs.readFileSync(require.resolve("~/.cloudctl/token_prod"), { encoding: "utf8" });
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token

    }
  }
  //option1: read from local fs to grab the token
  //option2: mimic cloudctl exchange the token -- go co2 lib
  const values = body.view.state.values;
  let stack_name = values.stack_name.stackname_input.value;
  let cloud_provider = values.cloud_provider.cloud_provider_input.selected_option.value;
  let region = values.region.region_input.selected_option.value;
  let details_netnew = values.details_netnew_tf.netnew_input.selected_option.value;
  details_netnew = (details_netnew === 'true');
  let details_ridm = values.details_ridm_tf.irdm_input.selected_option.value;
  details_ridm = (details_ridm === 'true');
  let details_hipaa = values.details_hipaa_tf.hipaa_input.selected_option.value;
  details_hipaa = (details_hipaa === 'true');
  let details_ddaa = values.details_ddaa_tf.ddaa_input.selected_option.value;
  details_ddaa = (details_ddaa === 'true');
  let details_encrption = values.details_encryption_tf.encryption_input.selected_option.value;
  details_encrption = (details_encrption === 'true');
  let details_poc = values.poc_tf.poc_tf_input.selected_option.value;
  details_poc = (details_poc === 'true');
  let existing_idm = (values.existing_idm_tf.existing_idm_input.selected_option.value === 'true');
  let existing_noah = (values.existing_noah_tf.existing_noah_input.selected_option.value === 'true');
  let existing_im4gn = (values.existing_im4gn_tf.existing_im4gn_input.selected_option.value === 'true');
  let existing_i3en = (values.existing_i3en_tf.existing_i3en_input.selected_option.value === 'true');
  let existing_x6i = (values.existing_x6i_tf.existing_x6i_input.selected_option.value === 'true');
  let details_poc_type = values.poc_type.poc_type_input.value;
  let details_autobahn_lane = values.autobahn_lane.autobahn_lane_input.value;
  let cloud_num = Number(values.cloud_number.cloud_num_input.value);
  let es_num = Number(values.es_number.es_num_input.value);
  let itsi_num = Number(values.itsi_number.itsi_num_input.value);
  let pci_num = Number(values.pci_number.pci_num_input.value);
  let vmware_num = Number(values.vmware_number.vmware_num_input.value);
  let exchange_num = Number(values.exchange_number.exchange_num_input.value);


  // let details_
  //let details_
  //get all values of multiple selection action id "details_input"
  // let details = values.details_input.selected_options.value.map((option) => option.value).join(' ');
  //error here is TypeError: Cannot read properties of undefined (reading 'multi_static_select-action', how to fix it
  //let details = values.multi_static_select['details_input'].selected_options.map((option) => option.value).join(' ');
  console.log(cloud_provider);
  console.log(stack_name);
  console.log(region);
  console.log(typeof details_netnew);
  // create a body3 for all input: {"input":{"name":"tidy-toucan-urp","kind":"Stack","inputs":{"customerType":"Internal","type":"Clustered","region":"us-east-1"},"templates":[{"name":"stack/cloud_delivery/cda","inputs":{"order":{"cloud":"aws","net_new":true,"idm":false,"hipaa":false,"ddaa":false,"encryption":false,"poc":true,"poc_type":"Custom","autobahn_lane":"","existing":{"noah":false,"idm":false,"im4gn_indexers":false,"i3en_indexers":false,"x6i_instances":false},"ingest":{"cloud":5,"es":0,"itsi":0,"pci":0,"vmware":0,"exchange":0}}}}],"mixins":[]}}
  const body3 = {}
  body3["input"] = {}
  body3["input"]["name"] = stack_name
  body3["input"]["kind"] = 'Stack'
  body3["input"]["inputs"] = {}
  body3["input"]["inputs"]["customerType"] = 'Internal'
  body3["input"]["inputs"]["type"] = 'Clustered'
  body3["input"]["inputs"]["region"] = region
  body3["input"]["templates"] = []
  body3["input"]["templates"][0] = {}
  body3["input"]["templates"][0]["name"] = 'stack/cloud_delivery/cda'
  body3["input"]["templates"][0]["inputs"] = {}
  body3["input"]["templates"][0]["inputs"]["order"] = {}
  body3["input"]["templates"][0]["inputs"]["order"]["cloud"] = cloud_provider
  body3["input"]["templates"][0]["inputs"]["order"]["net_new"] = details_netnew
  body3["input"]["templates"][0]["inputs"]["order"]["idm"] = details_ridm
  body3["input"]["templates"][0]["inputs"]["order"]["hipaa"] = details_hipaa
  body3["input"]["templates"][0]["inputs"]["order"]["ddaa"] = details_ddaa
  body3["input"]["templates"][0]["inputs"]["order"]["encryption"] = details_encrption
  body3["input"]["templates"][0]["inputs"]["order"]["poc"] = details_poc
  if (details_poc == true) {
    body3["input"]["templates"][0]["inputs"]["order"]["poc_type"] = details_poc_type
    body3["input"]["templates"][0]["inputs"]["order"]["autobahn_lane"] = details_autobahn_lane
  } else {
    body3["input"]["templates"][0]["inputs"]["order"]["poc_type"] = ''
    body3["input"]["templates"][0]["inputs"]["order"]["autobahn_lane"] = ''
  }

  body3["input"]["templates"][0]["inputs"]["order"]["existing"] = {}

  body3["input"]["templates"][0]["inputs"]["order"]["existing"]["noah"] = existing_noah
  body3["input"]["templates"][0]["inputs"]["order"]["existing"]["idm"] = existing_idm
  body3["input"]["templates"][0]["inputs"]["order"]["existing"]["im4gn_indexers"] = existing_im4gn
  body3["input"]["templates"][0]["inputs"]["order"]["existing"]["i3en_indexers"] = existing_i3en
  body3["input"]["templates"][0]["inputs"]["order"]["existing"]["x6i_instances"] = existing_x6i
  body3["input"]["templates"][0]["inputs"]["order"]["ingest"] = {}
  body3["input"]["templates"][0]["inputs"]["order"]["ingest"]["cloud"] = cloud_num
  body3["input"]["templates"][0]["inputs"]["order"]["ingest"]["es"] = es_num
  body3["input"]["templates"][0]["inputs"]["order"]["ingest"]["itsi"] = itsi_num
  body3["input"]["templates"][0]["inputs"]["order"]["ingest"]["pci"] = pci_num
  body3["input"]["templates"][0]["inputs"]["order"]["ingest"]["vmware"] = vmware_num
  body3["input"]["templates"][0]["inputs"]["order"]["ingest"]["exchange"] = exchange_num
  body3["input"]["mixins"] = []



  const body2 = {}
  body2["input"] = {}
  body2["input"]["name"] = 'sampleco'
  body2["input"]["inputs"] = {}
  body2["input"]["inputs"]["customerType"] = 'Dev'
  body2["input"]["inputs"]["region"] = 'us-east-1'





  //how to fix the issue:Identifier 'body' has already been declared
  //https://stackoverflow.com/questions/40858942/identifier-has-already-been-declared
  const response = await axios.post(url, body3, config)
  console.log(response.data)
  return response.data
}



async function sendRequest_gcp(body) {
  const local_url = 'http://localhost:8443/v3/translation/translate-order/stack'
  const url = 'https://api.co2.lve.splunkcloud.systems/v3/translation/translate-order/stack'
  //convert this to js code: echo $(cat ~/.cloudctl/token_prod)
  //const token = fs.readFileSync(' ~/.cloudctl/token_prod', 'utf8');

  const token = () => fs.readFileSync(require.resolve("~/.cloudctl/token_prod"), { encoding: "utf8" });
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token

    }
  }
  const values = body.view.state.values;
  let stack_name = values.stack_name.stackname_input.value;
  let cloud_provider = values.cloud_provider.cloud_provider_input.selected_option.value;
  let region = values.region.region_input.selected_option.value;
  let details_netnew = values.details_netnew_tf.netnew_input.selected_option.value;
  details_netnew = (details_netnew === 'true');
  let details_ridm = values.details_ridm_tf.irdm_input.selected_option.value;
  details_ridm = (details_ridm === 'true');
  let details_encrption = values.details_encryption_tf.encryption_input.selected_option.value;
  details_encrption = (details_encrption === 'true');
  let details_poc = values.poc_tf.poc_tf_input.selected_option.value;
  details_poc = (details_poc === 'true');
  let existing_idm = (values.existing_idm_tf.existing_idm_input.selected_option.value === 'true');
  let cloud_num = Number(values.cloud_number.cloud_num_input.value);
  let es_num = Number(values.es_number.es_num_input.value);
  let itsi_num = Number(values.itsi_number.itsi_num_input.value);
  let pci_num = Number(values.pci_number.pci_num_input.value);
  let vmware_num = Number(values.vmware_number.vmware_num_input.value);
  let exchange_num = Number(values.exchange_number.exchange_num_input.value);


  // let details_
  //let details_
  //get all values of multiple selection action id "details_input"
  // let details = values.details_input.selected_options.value.map((option) => option.value).join(' ');
  //error here is TypeError: Cannot read properties of undefined (reading 'multi_static_select-action', how to fix it
  //let details = values.multi_static_select['details_input'].selected_options.map((option) => option.value).join(' ');
  console.log(cloud_provider);
  console.log(stack_name);
  console.log(region);
  console.log(typeof details_netnew);
  // create a body3 for all input: {"input":{"name":"tidy-toucan-urp","kind":"Stack","inputs":{"customerType":"Internal","type":"Clustered","region":"us-east-1"},"templates":[{"name":"stack/cloud_delivery/cda","inputs":{"order":{"cloud":"aws","net_new":true,"idm":false,"hipaa":false,"ddaa":false,"encryption":false,"poc":true,"poc_type":"Custom","autobahn_lane":"","existing":{"noah":false,"idm":false,"im4gn_indexers":false,"i3en_indexers":false,"x6i_instances":false},"ingest":{"cloud":5,"es":0,"itsi":0,"pci":0,"vmware":0,"exchange":0}}}}],"mixins":[]}}
  // create a body4 for all input: {"input":{"name":"worthy-wolverine-n1y","kind":"Stack","inputs":{"customerType":"Internal","type":"Clustered","region":"us-central1"},"templates":[{"name":"stack/cloud_delivery/cda","inputs":{"order":{"cloud":"gcp","net_new":false,"idm":true,"hipaa":false,"ddaa":false,"encryption":false,"poc":false,"poc_type":"","autobahn_lane":"","existing":{"noah":true,"idm":false,"im4gn_indexers":true,"i3en_indexers":false,"x6i_instances":false},"ingest":{"cloud":5,"es":0,"itsi":0,"pci":0,"vmware":0,"exchange":0}}}}],"mixins":[]}}
  const body3 = {}
  body3["input"] = {}
  body3["input"]["name"] = stack_name
  body3["input"]["kind"] = 'Stack'
  body3["input"]["inputs"] = {}
  body3["input"]["inputs"]["customerType"] = 'Internal'
  body3["input"]["inputs"]["type"] = 'Clustered'
  body3["input"]["inputs"]["region"] = region
  body3["input"]["templates"] = []
  body3["input"]["templates"][0] = {}
  body3["input"]["templates"][0]["name"] = 'stack/cloud_delivery/cda'
  body3["input"]["templates"][0]["inputs"] = {}
  body3["input"]["templates"][0]["inputs"]["order"] = {}
  body3["input"]["templates"][0]["inputs"]["order"]["cloud"] = cloud_provider
  body3["input"]["templates"][0]["inputs"]["order"]["net_new"] = details_netnew
  body3["input"]["templates"][0]["inputs"]["order"]["idm"] = details_ridm
  body3["input"]["templates"][0]["inputs"]["order"]["hipaa"] = false
  body3["input"]["templates"][0]["inputs"]["order"]["ddaa"] = false
  body3["input"]["templates"][0]["inputs"]["order"]["encryption"] = details_encrption
  body3["input"]["templates"][0]["inputs"]["order"]["poc"] = details_poc
  body3["input"]["templates"][0]["inputs"]["order"]["poc_type"] = ""
  body3["input"]["templates"][0]["inputs"]["order"]["autobahn_lane"] = ""


  body3["input"]["templates"][0]["inputs"]["order"]["existing"] = {}

  body3["input"]["templates"][0]["inputs"]["order"]["existing"]["noah"] = false
  body3["input"]["templates"][0]["inputs"]["order"]["existing"]["idm"] = existing_idm
  body3["input"]["templates"][0]["inputs"]["order"]["existing"]["im4gn_indexers"] = false
  body3["input"]["templates"][0]["inputs"]["order"]["existing"]["i3en_indexers"] = false
  body3["input"]["templates"][0]["inputs"]["order"]["existing"]["x6i_instances"] = false
  body3["input"]["templates"][0]["inputs"]["order"]["ingest"] = {}
  body3["input"]["templates"][0]["inputs"]["order"]["ingest"]["cloud"] = cloud_num
  body3["input"]["templates"][0]["inputs"]["order"]["ingest"]["es"] = es_num
  body3["input"]["templates"][0]["inputs"]["order"]["ingest"]["itsi"] = itsi_num
  body3["input"]["templates"][0]["inputs"]["order"]["ingest"]["pci"] = pci_num
  body3["input"]["templates"][0]["inputs"]["order"]["ingest"]["vmware"] = vmware_num
  body3["input"]["templates"][0]["inputs"]["order"]["ingest"]["exchange"] = exchange_num
  body3["input"]["mixins"] = []


  console.log(JSON.stringify(body3))
  console.log(body3["input"]["templates"])
  console.log(body3["input"]["templates"][0]["inputs"]["order"])
  const body2 = {}
  body2["input"] = {}
  body2["input"]["name"] = 'sampleco'
  body2["input"]["inputs"] = {}
  body2["input"]["inputs"]["customerType"] = 'Dev'
  body2["input"]["inputs"]["region"] = 'us-east-1'





  //how to fix the issue:Identifier 'body' has already been declared
  //https://stackoverflow.com/questions/40858942/identifier-has-already-been-declared
  const response = await axios.post(url, body3, config)
  console.log(response.data)
  return response.data
}
//update modal
app.view('p2splunk-submit', async ({ ack, body, view, client }) => {
  // Acknowledge the action
  await ack();
  // console.log(JSON.stringify(body));//see the data getting passed
  let msg = JSON.stringify("");


  const user = body['user']['id'];

  //call sendRequest in ./helper and get response
  const values = body.view.state.values;
 //userInputData['stack_name'] = "aws";

  let cloud_provider = values.cloud_provider.cloud_provider_input.selected_option.value;
  let response = ""
  if (cloud_provider == "aws") {
    response = await sendRequest_aws(body);
  } else if (cloud_provider == "gcp") {
    response = await sendRequest_gcp(body);
  }
  console.log(JSON.stringify(response));
  //http call to local co2



  //get all input fileds from the body
  //call local co2
  //map the field -> co2 json body
  //call co2
  //parse the respond back to the user




  //const results = await createWpUpdate(body['user']['username'],body);

  // if (results){
  //   msg = 'Your update was successful.'
  // } else {
  //   msg = 'I am a failure but I do not know why.'
  // }

  //message the user 

  try {
    await client.chat.postMessage({
      channel: user,
      text: JSON.stringify(response)
    });
  }
  catch (error) {
    console.error(error);
  }

});

// app.command('/courseupdate', async ({ command, ack, body, client }) => {
//   // Acknowledge the command request
//   await ack();

//   try {
//     // Call views.open with the built-in client
//     const result = await client.views.open({
//       // Pass a valid trigger_id within 3 seconds of receiving it
//       trigger_id: body.trigger_id,
//       // View payload
//       view: {
//         type: 'modal',
//         // View identifier
//         callback_id: 'course-submit',
//         title: {
//           type: 'plain_text',
//           text: 'Course Update'
//         },
//         blocks: [{
//           type: "input",
//           block_id: 'course_selection',
//           element: {
//             type: "static_select",
//             placeholder: {
//               type: "plain_text",
//               text: "Select your course",
//               emoji: true
//             },
//             options: [
//               {
//                 text: {
//                   type: "plain_text",
//                   text: "ICC Global Leadership",
//                   emoji: true
//                 },
//                 value: "icc-global-leadership"//9
//               },
//               {
//                 text: {
//                   type: "plain_text",
//                   text: "Japanese Ethnography",
//                   emoji: true
//                 },
//                 value: "japanese-ethnography-as-a-window-to-japanese-language-and-society"//10
//               },
//               {
//                 text: {
//                   type: "plain_text",
//                   text: "Japanese Introduction to Japanese Pedagogy",
//                   emoji: true
//                 },
//                 value: "japanese-introduction-to-japanese-pedagogy"//11
//               },
//               {
//                 text: {
//                   type: "plain_text",
//                   text: "Program Management",
//                   emoji: true
//                 },
//                 value: "program-management"//12
//               },
//               {
//                 text: {
//                   type: "plain_text",
//                   text: "Software Internationalization and Localization",
//                   emoji: true
//                 },
//                 value: "software-internationalization-and-localization"//13
//               }
//             ],
//             action_id: "course_input"
//           },
//           label: {
//             type: "plain_text",
//             text: "Course selection",
//             emoji: true
//           }
//         },
//         {
//           type: 'input',
//           block_id: 'good_stuff',
//           optional: true,
//           label: {
//             type: 'plain_text',
//             text: 'What is going well this week?'
//           },
//           element: {
//             type: 'plain_text_input',
//             action_id: 'good_input',
//             multiline: true,
//           }
//         }, {
//           type: 'input',
//           block_id: 'flag_stuff',
//           optional: true,
//           label: {
//             type: 'plain_text',
//             text: 'Yellow or red flags this week?'
//           },
//           element: {
//             type: 'plain_text_input',
//             action_id: 'flag_input',
//             multiline: true
//           }
//         }, {
//           type: 'input',
//           block_id: 'other_stuff',
//           optional: true,
//           label: {
//             type: 'plain_text',
//             text: 'Anything else to share?'
//           },
//           element: {
//             type: 'plain_text_input',
//             action_id: 'other_input',
//             multiline: true
//           }
//         }
//         ],
//         submit: {
//           type: 'plain_text',
//           text: 'Submit',
//         }
//       }
//     });
//     //console.log(JSON.stringify(result));
//     //console.log(result)
//   }
//   catch (error) {
//     console.error(error);
//   }

// });
//update modal
// app.view('course-submit', async ({ ack, body, view, client }) => {
//   // Acknowledge the action
//   await ack();
//   console.log(JSON.stringify(body));//see the data getting passed
//   let msg = '';

//   const user = body['user']['id'];
//   const results = await createWpUpdate(body['user']['username'], body);

//   if (results) {
//     msg = 'Your update was successful.'
//   } else {
//     msg = 'I am a failure but I do not know why.'
//   }

//   //message the user 

//   try {
//     await client.chat.postMessage({
//       channel: user,
//       text: msg
//     });
//   }
//   catch (error) {
//     console.error(error);
//   }

// });



(async () => {
  // Start your app
  //await app.start(process.env.PORT || 3000);
  await app.start(3000);

  console.log('⚡️ Bolt app is running!');
})();



function createWpUpdate(slackuser, body) {

  const values = body.view.state.values;
  let good = values.good_stuff.good_input.value;
  let flag = values.flag_stuff.flag_input.value;
  let other = values.other_stuff.other_input.value;
  let course = values.course_selection.course_input.selected_option.value;//easy to miss selected_option
  let courseId = courseTagToID(course);
  var wp = new WPAPI({
    endpoint: 'http://experiments.middcreate.net/slack/wp-json',
    // This assumes you are using basic auth, as described further below
    username: process.env.WP_USER,
    password: process.env.WP_PASS
  });
  var user = process.env.WP_USER;

  //establish route for custom post type update ***************** from https://github.com/WP-API/node-wpapi/issues/275
  const namespace = 'wp/v2';
  const updateRoute = '/update/';

  wp.update = wp.registerRoute(namespace, updateRoute);

  //date
  const currentDate = new Date();
  const currentDayOfMonth = currentDate.getDate();
  const currentMonth = currentDate.getMonth(); // Be careful! January is 0, not 1
  const currentYear = currentDate.getFullYear();

  const dateString = currentDayOfMonth + "-" + (currentMonth + 1) + "-" + currentYear;

  wp.update().create({ //leave as post instead of update if just regular post
    // "title" and "content" are the only required properties
    title: slackuser + ' via slackbot on ' + dateString,
    content: 'nothing to see here',
    post_type: 'update',
    //  },
    meta: {
      going_well: good,//tied to defining them on the WP side w register_meta
      flags: flag,
      else: other
    },
    tags: [courseId],
    // Post will be created as a draft by default if a specific "status"
    // is not specified
    status: 'publish'
  }).then(function (response) {
    // "response" will hold all properties of your newly-created post,
    // including the unique `id` the post was assigned on creation
    //console.log( response.id );
  })
  return true;
}


function courseTagToID(course) {
  let courses = {
    'icc-global-leadership': 9,
    'japanese-ethnography-as-a-window-to-japanese-language-and-society': 10,
    'japanese-introduction-to-japanese-pedagogy': 11,
    'program-management': 12,
    'software-internationalization-and-localization': 13,
  };
  if (courses[course]) {
    return courses[course];//remember the issue with hyphens in json
  } else {
    return 1;
  }

}




// (async () => {
//   // Start your app
//   await app.start(process.env.PORT || 3000);

//   console.log('⚡️ Bolt app is running!');
// })();



//get the input value from 'users_select-action' action


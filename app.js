const { App } = require('@slack/bolt');
const axios = require('axios');
const fs = require('fs');

// Initializes your app with your bot token and app token
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN
});

const userInputData = new Map();
let inputinfo = "Based on the inputinfo  you provided: \n" 
let cloudProvider = ""

//check the argument after command /p2splunk is aws or gcp, if it is aws, generate a modal view, if is gcp, generate different view
app.command('/p2bot', async ({ command, ack, body, client }) => {
  await ack();
  let  cmd = command.text;
  if (cmd == "splunk"){
  try {
    const result = await client.views.open({
      trigger_id: body.trigger_id,
      view_id: "abcde",
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
          "type": "section",
          "text": {
            "type": "plain_text",
            "text": "Details",
            "emoji": true,

          }
        }, {
          "type": "actions",
          "elements": [
            {
              "type": "checkboxes",
              "options": [
                {
                  "text": {
                    "type": "plain_text",
                    "text": "Net New*",
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
                    "text": "HIPAA/PIC",
                    "emoji": true
                  },

                  "value": "hipaa"
                },
                {
                  "text": {
                    "type": "plain_text",
                    "text": "DDAA",
                    "emoji": true
                  },

                  "value": "ddaa"
                }, {
                  "text": {
                    "type": "plain_text",
                    "text": "Encryption",
                    "emoji": true
                  },

                  "value": "encryption"
                },
              ],
              "action_id": "details_aws_checkbox",

            },

          ]
        }, {
          "type": "section",
          "text": {
            "type": "plain_text",
            "text": "POC(t/f)",
            "emoji": true,

          }
        },
        {
          "type": "actions",
          "elements": [
            {
              "type": "checkboxes",
              "options": [
                {
                  "text": {
                    "type": "plain_text",
                    "text": "POC",
                    "emoji": true
                  },

                  "value": "poc"
                },

              ],
              "action_id": "poc_checkbox",

            },

          ]
        },
        {
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
                value: "N/A"
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
            action_id: "poc_type_input",
            initial_option :{
              text:{
                type: "plain_text",
                text: "N/A",
                emoji: true
              },
              value: "N/A"
            }
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
            action_id: "autobahn_lane_input",
            initial_option :{
              text:{
                type: "plain_text",
                text: "AWS Monitoring POV",
                emoji: true
              },
              value: "AWS Monitoring POV"
            }
          },
          label: {
            type: "plain_text",
            text: "Autobaun Line",
            emoji: true
          }
        }, {
          "type": "section",
          "text": {
            "type": "plain_text",
            "text": "Existing",
            "emoji": true,

          }
        }, {
          "type": "actions",
          "elements": [
            {
              "type": "checkboxes",
              "options": [
                {
                  "text": {
                    "type": "plain_text",
                    "text": "Noah",
                    "emoji": true
                  },

                  "value": "noah"
                },
                {
                  "text": {
                    "type": "plain_text",
                    "text": "IDM",
                    "emoji": true
                  },

                  "value": "idm"
                },
                {
                  "text": {
                    "type": "plain_text",
                    "text": "Im4gn Indexer",
                    "emoji": true
                  },

                  "value": "im4gn"
                },
                {
                  "text": {
                    "type": "plain_text",
                    "text": "I3en Indexers",
                    "emoji": true
                  },

                  "value": "i3en"
                }, {
                  "text": {
                    "type": "plain_text",
                    "text": "X6i Instances",
                    "emoji": true
                  },

                  "value": "x6i"
                },
              ],
              "action_id": "existing_checkbox",

            },

          ]
        },
        {
          "type": "section",
          "text": {
            "type": "plain_text",
            "text": "Entitlements",
            "emoji": true,

          }
        },
        {
          "type": "actions",
          "elements": [
            {
              "type": "radio_buttons",
              "options": [
                {
                  "text": {
                    "type": "plain_text",
                    "text": "Ingest",
                    "emoji": true
                  },
                  "value": "Ingest"
                },
                {
                  "text": {
                    "type": "plain_text",
                    "text": "SVCs",
                    "emoji": true
                  },
                  "value": "svcs"
                },
                
              ],
              action_id: "entitlements_input",
            
         
        },
          ]
        },
        {
          "type": "section",
          "text": {
            "type": "plain_text",
            "text": "Existing",
            "emoji": true,

          }
        },
        {
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
  }
});

app.action('entitlements_input', async ({ ack, body, context, client }) => {
  try {
    await ack();
    const values = body.view.state.values;
    const selectedOption = body.actions[0].selected_option.value;    //const updatedView = updateModalView_scvs(body, "aws");
    let updatedBlocks = updateModalView_scvs(body, "aws");
    if (selectedOption == "Ingest"){
      return
    }
    const updatedView = {
      type: 'modal',
      callback_id: 'p2splunk-submit',
      title: {
        type: 'plain_text',
        text: 'Product Packaging Splunk'
      },
      blocks: updatedBlocks,
      submit: {
        type: 'plain_text',//standard stuff and required for modals
        text: 'Submit',
      }
    }; 
    // const selectedOption = values.three_buttons.button-action_aws.value;
    //const selectedOption = body.actions[0].selected_option.value;
    console.log(selectedOption + "----------")
    
    await ack({
      "response_action": "update",
      "view": updatedView
    });
    await client.views.update({
      // token: process.env.SLACK_BOT_TOKEN,
      trigger_id: body.trigger_id,
      response_action: "update",
      view_id: body.view.id,
      view: updatedView,
    });
  } catch (error) {
    console.error('Error handling action:', error);
  }
});
app.action('button-action_aws', async ({ ack, body, context, client }) => {
  try {
    await ack();
    const values = body.view.state.values;
    // const selectedOption = values.three_buttons.button-action_aws.value;
    const selectedOption = body.actions[0].value;
    cloudProvider = selectedOption
    userInputData.set('cloud_provider', selectedOption);
    const updatedView = updateModalView_aws(body, selectedOption);
    userInputData["cloud_provider"] = selectedOption
    await ack({
      "response_action": "update",
      "view": updatedView
    });
    await client.views.update({
      // token: process.env.SLACK_BOT_TOKEN,
      trigger_id: body.trigger_id,
      response_action: "update",
      view_id: body.view.id,
      view: updatedView,
    });
  } catch (error) {
    console.error('Error handling action:', error);
  }
});
app.action('button-action_gcp', async ({ ack, body, context, client }) => {
  try {
    await ack();
    const values = body.view.state.values;
    // const selectedOption = values.three_buttons.button-action_aws.value;
    const selectedOption = body.actions[0].value;
    userInputData.set('cloud_provider', selectedOption);
    cloudProvider = selectedOption

    const updatedView = updateModalView_gcp(body, selectedOption);
    userInputData["cloud_provider"] = selectedOption
    await ack({
      "response_action": "update",
      "view": updatedView
    });
    await client.views.update({
      // token: process.env.SLACK_BOT_TOKEN,
      trigger_id: body.trigger_id,
      response_action: "update",
      view_id: body.view.id,
      view: updatedView,
      // hash:"156772938.1827394"
    });

  } catch (error) {
    console.error('Error handling action:', error);
  }
});
app.action('button-action_fedramp', async ({ ack, body, context, client }) => {
  try {
    await ack();
    const values = body.view.state.values;
    // const selectedOption = values.three_buttons.button-action_aws.value;
    const selectedOption = body.actions[0].value;
    userInputData.set('cloud_provider', selectedOption);
    cloudProvider = selectedOption

    const updatedView = updateModalView_fedramp(body, selectedOption);
    userInputData["cloud_provider"] = selectedOption
    await ack({
      "response_action": "update",
      "view": updatedView
    });
    await client.views.update({
      // token: process.env.SLACK_BOT_TOKEN,
      trigger_id: body.trigger_id,
      response_action: "update",
      view_id: body.view.id,
      view: updatedView,
      // hash:"156772938.1827394"
    });

  } catch (error) {
    console.error('Error handling action:', error);
  }
});


function updateModalView_scvs(body, selectedOption) {
  try {
    const view = body.view;
    const block21Index = body.view.blocks.findIndex((block) => block.block_id === "cloud_number");
    if (block21Index !== -1) {
      view.blocks.splice(block21Index); // +1 to keep the "block_21" as well
    }
    console.log(view.blocks)
    let updatedBlocks = view.blocks

    updatedBlocks.push({
      type: "input",
      block_id: 'it_cloud_foundations',
      label: {
        type: 'plain_text',
        text: 'IT Cloud Foundations'
      },
      element: {
        type: 'plain_text_input',
        action_id: 'it_cloud_foundations_input',
        initial_value: '10'
      }
    }, {
      type: "input",
      block_id: 'security_cloud_foundations',
      label: {
        type: 'plain_text',
        text: 'Security Cloud Foundations'
      },
      element: {
        type: 'plain_text_input',
        action_id: 'security_cloud_foundations_input',
        initial_value: '0'
      }
    },  {
      type: "input",
      block_id: 'splunk_cloud_platform',
      label: {
        type: 'plain_text',
        text: 'Splunk Cloud Platform'
      },
      element: {
        type: 'plain_text_input',
        action_id: 'splunk_cloud_platform_input',
        initial_value: '0'
      }
    },{
      "type": "section",
      "text": {
        "type": "plain_text",
        "text": "Apps",
        "emoji": true,

      }
    },  {
      "type": "actions",
      "elements": [
        {
          "type": "checkboxes",
          "options": [
            {
              "text": {
                "type": "plain_text",
                "text": "ES",
                "emoji": true
              },

              "value": "es"
            },
            {
              "text": {
                "type": "plain_text",
                "text": "ITSI",
                "emoji": true
              },

              "value": "itsi"
            },
            {
              "text": {
                "type": "plain_text",
                "text": "PCI",
                "emoji": true
              },

              "value": "pci"
            },{
              "text": {
                "type": "plain_text",
                "text": "VMWare",
                "emoji": true
              },

              "value": "vmware"
            },{
              "text": {
                "type": "plain_text",
                "text": "Exchange",
                "emoji": true
              },

              "value": "exchange"
            },
          ],
          "action_id": "apps_checkbox",
          //"initial_options" :(userInputData.get('details')).map((value) => ({ text: { type: 'plain_text', text: value }, value })),
          //   "initial_options": [
          //     {
          //         "text": {
          //             "type": "plain_text",
          //             "text": "Net New*",
          //             "emoji": true
          //         },
          //         "value": "net_new"
          //     },
          //     {
          //         "text": {
          //             "type": "plain_text",
          //             "text": "Requesting IDM",
          //             "emoji": true
          //         },
          //         "value": "idm"
          //     },{
          //       text: { type: 'plain_text', text: 'DDAA', emoji: true },
          //       value: 'ddaa'
          //     }

          // ],

          
        },

      ]
    }, 

    );
    console.log("my updated blocks is:")
    
   
    return updatedBlocks
    
      

  }catch (error) {
    console.error('Error handling checkbox selection:', error);
  }
}




function updateModalView_scvs2(body, selectedOption) {
  //get the exisiting view
  cloud_provider = userInputData["cloud_provider"]
  let all_details = userInputData.get("details");
  let netnew = false
  ini_v = generate_details_map(userInputData.get('details'))
  ini_poc = generate_poc_map(userInputData.get('poc_checkbox'))
  ini_existing = generate_exisiting_map(userInputData.get('existing_checkbox'))

  if (all_details.includes("net_new")) {
    netnew = true
  }
  let updatedView = {}
  console.log(cloud_provider + netnew) 
  if (cloud_provider == "aws") {
    
    if (netnew == true){
      console.log("=====")
      updatedView = {
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
          "type": "section",
          "text": {
            "type": "plain_text",
            "text": "Choose a Cloud Provider",
            "emoji": true,
          }
        }, {
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
                type: "plain_text",
                text: "us-east-1 (N. Virginia)",
                emoji: true
              },
              value: "us-east-1"
            },
          },
          label: {
            type: "plain_text",
            text: "Region",
            emoji: true
          }
        }, {
          "type": "section",
          "text": {
            "type": "plain_text",
            "text": "Details",
            "emoji": true,
    
          }
        }, {
          "type": "actions",
          "elements": [
            {
              "type": "checkboxes",
              "options": [
                {
                  "text": {
                    "type": "plain_text",
                    "text": "Net New*",
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
                    "text": "HIPAA/PIC",
                    "emoji": true
                  },
    
                  "value": "hipaa"
                },
                {
                  "text": {
                    "type": "plain_text",
                    "text": "DDAA",
                    "emoji": true
                  },
    
                  "value": "ddaa"
                }, {
                  "text": {
                    "type": "plain_text",
                    "text": "Encryption",
                    "emoji": true
                  },
    
                  "value": "encryption"
                },
              ],
              "action_id": "details_aws_checkbox",
              //"initial_options" :(userInputData.get('details')).map((value) => ({ text: { type: 'plain_text', text: value }, value })),
              //   "initial_options": [
              //     {
              //         "text": {
              //             "type": "plain_text",
              //             "text": "Net New*",
              //             "emoji": true
              //         },
              //         "value": "net_new"
              //     },
              //     {
              //         "text": {
              //             "type": "plain_text",
              //             "text": "Requesting IDM",
              //             "emoji": true
              //         },
              //         "value": "idm"
              //     },{
              //       text: { type: 'plain_text', text: 'DDAA', emoji: true },
              //       value: 'ddaa'
              //     }
    
              // ],
    
              "initial_options": ini_v,
            },
    
          ]
        }, {
          "type": "section",
          "text": {
            "type": "plain_text",
            "text": "POC(t/f)",
            "emoji": true,
    
          }
        },
        {
          "type": "actions",
          "elements": [
            {
              "type": "checkboxes",
              "options": [
                {
                  "text": {
                    "type": "plain_text",
                    "text": "POC",
                    "emoji": true
                  },
    
                  "value": "poc"
                },
    
              ],
              "action_id": "poc_checkbox",
              "initial_options": ini_poc,
    
            },
    
          ]
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
        },{
          "type": "section",
          "text": {
            "type": "plain_text",
            "text": "Entitlements",
            "emoji": true,

          }
        },
        {
          "type": "section",
          "text": {
            "type": "plain_text",
            "text": "Entitlements: SVCs",
            "emoji": true,
          }
        },  {
          type: "input",
          block_id: 'it_cloud_foundations',
          label: {
            type: 'plain_text',
            text: 'IT Cloud Foundations'
          },
          element: {
            type: 'plain_text_input',
            action_id: 'it_cloud_foundations_input',
            initial_value: '10'
          }
        }, {
          type: "input",
          block_id: 'security_cloud_foundations',
          label: {
            type: 'plain_text',
            text: 'Security Cloud Foundations'
          },
          element: {
            type: 'plain_text_input',
            action_id: 'security_cloud_foundations_input',
            initial_value: '0'
          }
        }, {
          type: "input",
          block_id: 'splunk_cloud_platform',
          label: {
            type: 'plain_text',
            text: 'Splunk Cloud Platform'
          },
          element: {
            type: 'plain_text_input',
            action_id: 'splunk_cloud_platform_input',
            initial_value: '0'
          }
        }, {
          "type": "section",
          "text": {
            "type": "plain_text",
            "text": "Apps",
            "emoji": true,
  
          }
        }, {
          "type": "actions",
          "elements": [
            {
              "type": "checkboxes",
              "options": [
                {
                  "text": {
                    "type": "plain_text",
                    "text": "ES",
                    "emoji": true
                  },
  
                  "value": "es"
                },
                {
                  "text": {
                    "type": "plain_text",
                    "text": "ITSI",
                    "emoji": true
                  },
  
                  "value": "itsi"
                },
                {
                  "text": {
                    "type": "plain_text",
                    "text": "PCI",
                    "emoji": true
                  },
  
                  "value": "pci"
                },{
                  "text": {
                    "type": "plain_text",
                    "text": "VMWare",
                    "emoji": true
                  },
  
                  "value": "vmware"
                },{
                  "text": {
                    "type": "plain_text",
                    "text": "Exchange",
                    "emoji": true
                  },
  
                  "value": "exchange"
                },
              ],
              "action_id": "apps_checkbox",
              //"initial_options" :(userInputData.get('details')).map((value) => ({ text: { type: 'plain_text', text: value }, value })),
              //   "initial_options": [
              //     {
              //         "text": {
              //             "type": "plain_text",
              //             "text": "Net New*",
              //             "emoji": true
              //         },
              //         "value": "net_new"
              //     },
              //     {
              //         "text": {
              //             "type": "plain_text",
              //             "text": "Requesting IDM",
              //             "emoji": true
              //         },
              //         "value": "idm"
              //     },{
              //       text: { type: 'plain_text', text: 'DDAA', emoji: true },
              //       value: 'ddaa'
              //     }
  
              // ],
  
              
            },
  
          ]
        }, 
          // Add other blocks as needed
        ], submit: {
          type: 'plain_text',
          text: 'Submit',
        }
      };
    }else{
     updatedView = {
        type: 'modal',
        callback_id: 'p2splunk-submit',
        title: {
          type: 'plain_text',
          text: 'Product Packaging Splunk',
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
          "type": "section",
          "text": {
            "type": "plain_text",
            "text": "Choose a Cloud Provider: " + cloud_provider,
            "emoji": true,
          }
        }, {
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
                type: "plain_text",
                text: "us-east-1 (N. Virginia)",
                emoji: true
              },
              value: "us-east-1"
            },
          },
          label: {
            type: "plain_text",
            text: "Region",
            emoji: true
          }
        }, {
          "type": "section",
          "text": {
            "type": "plain_text",
            "text": "Details",
            "emoji": true,
    
          }
        }, {
          "type": "actions",
          "elements": [
            {
              "type": "checkboxes",
              "options": [
                {
                  "text": {
                    "type": "plain_text",
                    "text": "Net New*",
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
                    "text": "HIPAA/PIC",
                    "emoji": true
                  },
    
                  "value": "hipaa"
                },
                {
                  "text": {
                    "type": "plain_text",
                    "text": "DDAA",
                    "emoji": true
                  },
    
                  "value": "ddaa"
                }, {
                  "text": {
                    "type": "plain_text",
                    "text": "Encryption",
                    "emoji": true
                  },
    
                  "value": "encryption"
                },
              ],
              "action_id": "details_aws_checkbox",
              "initial_options": ini_v,
            },
    
          ]
        },{
          "type": "section",
          "text": {
            "type": "plain_text",
            "text": "POC(t/f)",
            "emoji": true,
    
          }
        },{
          "type": "actions",
          "elements": [
            {
              "type": "checkboxes",
              "options": [
                {
                  "text": {
                    "type": "plain_text",
                    "text": "POC",
                    "emoji": true
                  },
    
                  "value": "poc"
                },
    
              ],
              "action_id": "poc_checkbox",
              "initial_options": ini_poc,
    
            },
    
          ]
        },{
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
                value: "N/A"
              },
              {
                text: {
                  type: "plain_text",
                  text: "Autobahn",
                  emoji: true
                },
                value: "Autobahn"
              },
              {
                text: {
                  type: "plain_text",
                  text: "Custom",
                  emoji: true
                },
                value: "Custom"
              }
            ],
            action_id: "poc_type_input",
            initial_option :{
              text:{
                type: "plain_text",
                text: "N/A",
                emoji: true
              },
              value: "N/A"
            }
          },
          label: {
            type: "plain_text",
            text: "POC Type",
            emoji: true
          }
        },{
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
            action_id: "autobahn_lane_input",
            
          },
          label: {
            type: "plain_text",
            text: "Autobaun Line",
            emoji: true
          }
        }, {
          "type": "section",
          "text": {
            "type": "plain_text",
            "text": "Existing",
            "emoji": true,
    
          }
        }, {
          "type": "actions",
          "elements": [
            {
              "type": "checkboxes",
              "options": [
                {
                  "text": {
                    "type": "plain_text",
                    "text": "Noah",
                    "emoji": true
                  },
    
                  "value": "noah"
                },
                {
                  "text": {
                    "type": "plain_text",
                    "text": "IDM",
                    "emoji": true
                  },
    
                  "value": "idm"
                },
                {
                  "text": {
                    "type": "plain_text",
                    "text": "Im4gn Indexer",
                    "emoji": true
                  },
    
                  "value": "im4gn"
                },
                {
                  "text": {
                    "type": "plain_text",
                    "text": "I3en Indexers",
                    "emoji": true
                  },
    
                  "value": "i3en"
                }, {
                  "text": {
                    "type": "plain_text",
                    "text": "X6i Instances",
                    "emoji": true
                  },
    
                  "value": "x6i"
                },
              ],
              "action_id": "existing_checkbox",
              "initial_options": ini_existing,

            },
    
          ]
        },{
          "type": "section",
          "text": {
            "type": "plain_text",
            "text": "Entitlements",
            "emoji": true,

          }
        },
        {
          "type": "actions",
          "elements": [
            {
              "type": "radio_buttons",
              "options": [
                {
                  "text": {
                    "type": "plain_text",
                    "text": "Ingest",
                    "emoji": true
                  },
                  "value": "Ingest"
                },
                {
                  "text": {
                    "type": "plain_text",
                    "text": "SVCs",
                    "emoji": true
                  },
                  "value": "svcs"
                },
                
              ],
              action_id: "entitlements_input",
            
         
        },
          ]
        },{
          type: "input",
          block_id: 'it_cloud_foundations',
          label: {
            type: 'plain_text',
            text: 'IT Cloud Foundations'
          },
          element: {
            type: 'plain_text_input',
            action_id: 'it_cloud_foundations_input',
            initial_value: '10'
          }
        }, {
          type: "input",
          block_id: 'security_cloud_foundations',
          label: {
            type: 'plain_text',
            text: 'Security Cloud Foundations'
          },
          element: {
            type: 'plain_text_input',
            action_id: 'security_cloud_foundations_input',
            initial_value: '0'
          }
        }, {
          type: "input",
          block_id: 'splunk_cloud_platform',
          label: {
            type: 'plain_text',
            text: 'Splunk Cloud Platform'
          },
          element: {
            type: 'plain_text_input',
            action_id: 'splunk_cloud_platform_input',
            initial_value: '0'
          }
        }, {
          "type": "section",
          "text": {
            "type": "plain_text",
            "text": "Apps",
            "emoji": true,
  
          }
        }, {
          "type": "actions",
          "elements": [
            {
              "type": "checkboxes",
              "options": [
                {
                  "text": {
                    "type": "plain_text",
                    "text": "ES",
                    "emoji": true
                  },
  
                  "value": "es"
                },
                {
                  "text": {
                    "type": "plain_text",
                    "text": "ITSI",
                    "emoji": true
                  },
  
                  "value": "itsi"
                },
                {
                  "text": {
                    "type": "plain_text",
                    "text": "PCI",
                    "emoji": true
                  },
  
                  "value": "pci"
                },{
                  "text": {
                    "type": "plain_text",
                    "text": "VMWare",
                    "emoji": true
                  },
  
                  "value": "vmware"
                },{
                  "text": {
                    "type": "plain_text",
                    "text": "Exchange",
                    "emoji": true
                  },
  
                  "value": "exchange"
                },
              ],
              "action_id": "apps_checkbox",
              //"initial_options" :(userInputData.get('details')).map((value) => ({ text: { type: 'plain_text', text: value }, value })),
              //   "initial_options": [
              //     {
              //         "text": {
              //             "type": "plain_text",
              //             "text": "Net New*",
              //             "emoji": true
              //         },
              //         "value": "net_new"
              //     },
              //     {
              //         "text": {
              //             "type": "plain_text",
              //             "text": "Requesting IDM",
              //             "emoji": true
              //         },
              //         "value": "idm"
              //     },{
              //       text: { type: 'plain_text', text: 'DDAA', emoji: true },
              //       value: 'ddaa'
              //     }
  
              // ],
  
              
            },
  
          ]
        }, 
        
    
    
    
    
    
    
          // Add other blocks as needed
        ], submit: {
          type: 'plain_text',
          text: 'Submit',
        }
      };
    }
  }else if (cloud_provider == "gcp"){
    if(netnew == true){
      updatedView = {
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
          "type": "section",
          "text": {
            "type": "plain_text",
            "text": "Choose a Cloud Provider",
            "emoji": true,
          }
        }, {
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
            action_id: "region_input",
            initial_option: {
              text: {
                type: "plain_text",
                text: "us-central-1 (lowa)",
                emoji: true
              },
              value: "us-central1"
            },
          },
          label: {
            type: "plain_text",
            text: "Region",
            emoji: true
          }
        }, {
          "type": "section",
          "text": {
            "type": "plain_text",
            "text": "Details",
            "emoji": true,
  
          }
        }, {
          "type": "actions",
          "elements": [
            {
              "type": "checkboxes",
              "options": [
                {
                  "text": {
                    "type": "plain_text",
                    "text": "Net New*",
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
                },
              ],
              "action_id": "details_aws_checkbox",
              //"initial_options" :(userInputData.get('details')).map((value) => ({ text: { type: 'plain_text', text: value }, value })),
              //   "initial_options": [
              //     {
              //         "text": {
              //             "type": "plain_text",
              //             "text": "Net New*",
              //             "emoji": true
              //         },
              //         "value": "net_new"
              //     },
              //     {
              //         "text": {
              //             "type": "plain_text",
              //             "text": "Requesting IDM",
              //             "emoji": true
              //         },
              //         "value": "idm"
              //     },{
              //       text: { type: 'plain_text', text: 'DDAA', emoji: true },
              //       value: 'ddaa'
              //     }
  
              // ],
  
              "initial_options": ini_v,
            },
  
          ]
        }, {
          "type": "section",
          "text": {
            "type": "plain_text",
            "text": "POC(t/f)",
            "emoji": true,
  
          }
        },
        {
          "type": "actions",
          "elements": [
            {
              "type": "checkboxes",
              "options": [
                {
                  "text": {
                    "type": "plain_text",
                    "text": "POC",
                    "emoji": true
                  },
  
                  "value": "poc"
                },
  
              ],
              "action_id": "poc_checkbox",
  
            },
  
          ]
        },
        {
          "type": "section",
          "text": {
            "type": "plain_text",
            "text": "Entitlements",
            "emoji": true,

          }
        },{
          "type": "actions",
          "elements": [
            {
              "type": "radio_buttons",
              "options": [
                {
                  "text": {
                    "type": "plain_text",
                    "text": "Ingest",
                    "emoji": true
                  },
                  "value": "Ingest"
                },
                {
                  "text": {
                    "type": "plain_text",
                    "text": "SVCs",
                    "emoji": true
                  },
                  "value": "svcs"
                },
                
              ],
              action_id: "entitlements_input",
            
         
        },
          ]
        }, {
          type: "input",
          block_id: 'it_cloud_foundations',
          label: {
            type: 'plain_text',
            text: 'IT Cloud Foundations'
          },
          element: {
            type: 'plain_text_input',
            action_id: 'it_cloud_foundations_input',
            initial_value: '10'
          }
        }, {
          type: "input",
          block_id: 'security_cloud_foundations',
          label: {
            type: 'plain_text',
            text: 'Security Cloud Foundations'
          },
          element: {
            type: 'plain_text_input',
            action_id: 'security_cloud_foundations_input',
            initial_value: '0'
          }
        }, {
          type: "input",
          block_id: 'splunk_cloud_platform',
          label: {
            type: 'plain_text',
            text: 'Splunk Cloud Platform'
          },
          element: {
            type: 'plain_text_input',
            action_id: 'splunk_cloud_platform_input',
            initial_value: '0'
          }
        },{
          "type": "section",
          "text": {
            "type": "plain_text",
            "text": "Apps",
            "emoji": true,
  
          }
        }, {
          "type": "actions",
          "elements": [
            {
              "type": "checkboxes",
              "options": [
                {
                  "text": {
                    "type": "plain_text",
                    "text": "ES",
                    "emoji": true
                  },
  
                  "value": "es"
                },
                {
                  "text": {
                    "type": "plain_text",
                    "text": "ITSI",
                    "emoji": true
                  },
  
                  "value": "itsi"
                },
                {
                  "text": {
                    "type": "plain_text",
                    "text": "PCI",
                    "emoji": true
                  },
  
                  "value": "pci"
                },{
                  "text": {
                    "type": "plain_text",
                    "text": "VMWare",
                    "emoji": true
                  },
  
                  "value": "vmware"
                },{
                  "text": {
                    "type": "plain_text",
                    "text": "Exchange",
                    "emoji": true
                  },
  
                  "value": "exchange"
                },
              ],
              "action_id": "apps_checkbox",
              //"initial_options" :(userInputData.get('details')).map((value) => ({ text: { type: 'plain_text', text: value }, value })),
              //   "initial_options": [
              //     {
              //         "text": {
              //             "type": "plain_text",
              //             "text": "Net New*",
              //             "emoji": true
              //         },
              //         "value": "net_new"
              //     },
              //     {
              //         "text": {
              //             "type": "plain_text",
              //             "text": "Requesting IDM",
              //             "emoji": true
              //         },
              //         "value": "idm"
              //     },{
              //       text: { type: 'plain_text', text: 'DDAA', emoji: true },
              //       value: 'ddaa'
              //     }
  
              // ],
  
              
            },
  
          ]
        }, 
    
          // Add other blocks as needed
        ], submit: {
          type: 'plain_text',
          text: 'Submit',
        }
      };
    }else{
      updatedView = {
        type: 'modal',
        callback_id: 'p2splunk-submit',
        title: {
          type: 'plain_text',
          text: 'Product Packaging Splunk',
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
          "type": "section",
          "text": {
            "type": "plain_text",
            "text": "Choose a Cloud Provider: " + cloud_provider,
            "emoji": true,
          }
        }, {
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
            action_id: "region_input",
            initial_option: {
              text: {
                type: "plain_text",
                text: "us-central-1 (lowa)",
                emoji: true
              },
              value: "us-central1"
            },
          },
          label: {
            type: "plain_text",
            text: "Region",
            emoji: true
          }
        }, {
          "type": "actions",
          "elements": [
            {
              "type": "checkboxes",
              "options": [
                {
                  "text": {
                    "type": "plain_text",
                    "text": "Net New*",
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
                },
              ],
              "action_id": "details_aws_checkbox",
              "initial_options": ini_v,
            },
          ]
        }, {
          "type": "section",
          "text": {
            "type": "plain_text",
            "text": "POC(t/f)",
            "emoji": true,
    
          }
        },
        {
          "type": "actions",
          "elements": [
            {
              "type": "checkboxes",
              "options": [
                {
                  "text": {
                    "type": "plain_text",
                    "text": "POC",
                    "emoji": true
                  },
    
                  "value": "poc"
                },
    
              ],
              "action_id": "poc_checkbox",
              "initial_options": ini_poc,
    
            },
          ]
        }, {
          "type": "section",
          "text": {
            "type": "plain_text",
            "text": "Existing",
            "emoji": true,
    
          }
        }, {
          "type": "actions",
          "elements": [
            {
              "type": "checkboxes",
              "options": [
    
                {
                  "text": {
                    "type": "plain_text",
                    "text": "IDM",
                    "emoji": true
                  },
    
                  "value": "idm"
                },
    
              ],
              "action_id": "existing_checkbox",
              "initial_options": ini_existing,
            },
    
          ]
        }, {
          "type": "section",
          "text": {
            "type": "plain_text",
            "text": "Entitlements",
            "emoji": true,

          }
        },
        {
          "type": "actions",
          "elements": [
            {
              "type": "radio_buttons",
              "options": [
                {
                  "text": {
                    "type": "plain_text",
                    "text": "Ingest",
                    "emoji": true
                  },
                  "value": "Ingest"
                },
                {
                  "text": {
                    "type": "plain_text",
                    "text": "SVCs",
                    "emoji": true
                  },
                  "value": "svcs"
                },
                
              ],
              action_id: "entitlements_input",
            
         
        },
          ]
        },{
          type: "input",
          block_id: 'it_cloud_foundations',
          label: {
            type: 'plain_text',
            text: 'IT Cloud Foundations'
          },
          element: {
            type: 'plain_text_input',
            action_id: 'it_cloud_foundations_input',
            initial_value: '10'
          }
        }, {
          type: "input",
          block_id: 'security_cloud_foundations',
          label: {
            type: 'plain_text',
            text: 'Security Cloud Foundations'
          },
          element: {
            type: 'plain_text_input',
            action_id: 'security_cloud_foundations_input',
            initial_value: '0'
          }
        }, {
          type: "input",
          block_id: 'splunk_cloud_platform',
          label: {
            type: 'plain_text',
            text: 'Splunk Cloud Platform'
          },
          element: {
            type: 'plain_text_input',
            action_id: 'splunk_cloud_platform_input',
            initial_value: '0'
          }
        }, {
          "type": "section",
          "text": {
            "type": "plain_text",
            "text": "Apps",
            "emoji": true,
  
          }
        }, {
          "type": "actions",
          "elements": [
            {
              "type": "checkboxes",
              "options": [
                {
                  "text": {
                    "type": "plain_text",
                    "text": "ES",
                    "emoji": true
                  },
  
                  "value": "es"
                },
                {
                  "text": {
                    "type": "plain_text",
                    "text": "ITSI",
                    "emoji": true
                  },
  
                  "value": "itsi"
                },
                {
                  "text": {
                    "type": "plain_text",
                    "text": "PCI",
                    "emoji": true
                  },
  
                  "value": "pci"
                },{
                  "text": {
                    "type": "plain_text",
                    "text": "VMWare",
                    "emoji": true
                  },
  
                  "value": "vmware"
                },{
                  "text": {
                    "type": "plain_text",
                    "text": "Exchange",
                    "emoji": true
                  },
  
                  "value": "exchange"
                },
              ],
              "action_id": "apps_checkbox",
              //"initial_options" :(userInputData.get('details')).map((value) => ({ text: { type: 'plain_text', text: value }, value })),
              //   "initial_options": [
              //     {
              //         "text": {
              //             "type": "plain_text",
              //             "text": "Net New*",
              //             "emoji": true
              //         },
              //         "value": "net_new"
              //     },
              //     {
              //         "text": {
              //             "type": "plain_text",
              //             "text": "Requesting IDM",
              //             "emoji": true
              //         },
              //         "value": "idm"
              //     },{
              //       text: { type: 'plain_text', text: 'DDAA', emoji: true },
              //       value: 'ddaa'
              //     }
  
              // ],
  
              
            },
  
          ]
        }, 
        
    
    
    
    
    
          // Add other blocks as needed
        ], submit: {
          type: 'plain_text',
          text: 'Submit',
        }
      };
    }
  }else{
    if(netnew == true){
      updatedView = {
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
          "type": "section",
          "text": {
            "type": "plain_text",
            "text": "Choose a Cloud Provider",
            "emoji": true,
          }
        }, {
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
        }, {
          "type": "section",
          "text": {
            "type": "plain_text",
            "text": "Details",
            "emoji": true,
  
          }
        }, {
          "type": "actions",
          "elements": [
            {
              "type": "checkboxes",
              "options": [
                {
                  "text": {
                    "type": "plain_text",
                    "text": "Net New*",
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
                },
              ],
              "action_id": "details_aws_checkbox",
              //"initial_options" :(userInputData.get('details')).map((value) => ({ text: { type: 'plain_text', text: value }, value })),
              //   "initial_options": [
              //     {
              //         "text": {
              //             "type": "plain_text",
              //             "text": "Net New*",
              //             "emoji": true
              //         },
              //         "value": "net_new"
              //     },
              //     {
              //         "text": {
              //             "type": "plain_text",
              //             "text": "Requesting IDM",
              //             "emoji": true
              //         },
              //         "value": "idm"
              //     },{
              //       text: { type: 'plain_text', text: 'DDAA', emoji: true },
              //       value: 'ddaa'
              //     }
  
              // ],
  
              "initial_options": ini_v,
            },
  
          ]
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
                  text: "us-gov-west-1(US West)",
                  emoji: true
                },
                value: "us-gov-west-1"
              },
              {
                text: {
                  type: "plain_text",
                  text: "us-gov-east-1(US East)",
                  emoji: true
                },
                value: "us-gov-east-1"
              },
              
    
    
            ],
            action_id: "region_input",
            initial_option: {
              text: {
                type: "plain_text",
                text: "us-gov-west-1(US West)",
                emoji: true
              },
              value: "us-gov-west-1"
            },
          },
          label: {
            type: "plain_text",
            text: "Region",
            emoji: true
          }
        }, 
        {
          type: "input",
          block_id: 'fedramp_type',
          element: {
            type: "static_select",
            placeholder: {
              type: "plain_text",
              text: "Select a Fedramp Type",
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
              },
              {
                text: {
                  type: "plain_text",
                  text: "IL5",
                  emoji: true
                },
                value: "IL5"
              },
    
    
            ],
            action_id: "fedramp_type_input",
            initial_option: {
              text: {
                type: "plain_text",
                text: "High",
                emoji: true
              },
              value: "high"
            },
          },
          label: {
            type: "plain_text",
            text: "Fedramp Type",
            emoji: true
          }
        },{
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
                  text: "U.S. Gov: DoD / IC",
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
                value: "State and Local Govv"
              },
              {
                text: {
                  type: "plain_text",
                  text: "Non-Government",
                  emoji: true
                },
                value: "Non-Government"
              },
    
    
            ],
            action_id: "customer_classification_input",
            initial_option: {
              text: {
                type: "plain_text",
                text: "U.S. Gov: DoD / IC",
                emoji: true
              },
              value: "U.S. Gov: DoD / IC"
            },
          },
          label: {
            type: "plain_text",
            text: "Customer Classification",
            emoji: true
          }
        }, {
          "type": "section",
          "text": {
            "type": "plain_text",
            "text": "Entitlements",
            "emoji": true,

          }
        },{
          "type": "actions",
          "elements": [
            {
              "type": "radio_buttons",
              "options": [
                {
                  "text": {
                    "type": "plain_text",
                    "text": "Ingest",
                    "emoji": true
                  },
                  "value": "Ingest"
                },
                {
                  "text": {
                    "type": "plain_text",
                    "text": "SVCs",
                    "emoji": true
                  },
                  "value": "svcs"
                },
                
              ],
              action_id: "entitlements_input",
            
         
        },
          ]
        },
        {
          type: "input",
          block_id: 'it_cloud_foundations',
          label: {
            type: 'plain_text',
            text: 'IT Cloud Foundations'
          },
          element: {
            type: 'plain_text_input',
            action_id: 'it_cloud_foundations_input',
            initial_value: '10'
          }
        }, {
          type: "input",
          block_id: 'security_cloud_foundations',
          label: {
            type: 'plain_text',
            text: 'Security Cloud Foundations'
          },
          element: {
            type: 'plain_text_input',
            action_id: 'security_cloud_foundations_input',
            initial_value: '0'
          }
        }, {
          type: "input",
          block_id: 'splunk_cloud_platform',
          label: {
            type: 'plain_text',
            text: 'Splunk Cloud Platform'
          },
          element: {
            type: 'plain_text_input',
            action_id: 'splunk_cloud_platform_input',
            initial_value: '0'
          }
        }, {
          "type": "section",
          "text": {
            "type": "plain_text",
            "text": "Apps",
            "emoji": true,
  
          }
        }, {
          "type": "actions",
          "elements": [
            {
              "type": "checkboxes",
              "options": [
                {
                  "text": {
                    "type": "plain_text",
                    "text": "ES",
                    "emoji": true
                  },
  
                  "value": "es"
                },
                {
                  "text": {
                    "type": "plain_text",
                    "text": "ITSI",
                    "emoji": true
                  },
  
                  "value": "itsi"
                },
                {
                  "text": {
                    "type": "plain_text",
                    "text": "PCI",
                    "emoji": true
                  },
  
                  "value": "pci"
                },{
                  "text": {
                    "type": "plain_text",
                    "text": "VMWare",
                    "emoji": true
                  },
  
                  "value": "vmware"
                },{
                  "text": {
                    "type": "plain_text",
                    "text": "Exchange",
                    "emoji": true
                  },
  
                  "value": "exchange"
                },
              ],
              "action_id": "apps_checkbox",
              //"initial_options" :(userInputData.get('details')).map((value) => ({ text: { type: 'plain_text', text: value }, value })),
              //   "initial_options": [
              //     {
              //         "text": {
              //             "type": "plain_text",
              //             "text": "Net New*",
              //             "emoji": true
              //         },
              //         "value": "net_new"
              //     },
              //     {
              //         "text": {
              //             "type": "plain_text",
              //             "text": "Requesting IDM",
              //             "emoji": true
              //         },
              //         "value": "idm"
              //     },{
              //       text: { type: 'plain_text', text: 'DDAA', emoji: true },
              //       value: 'ddaa'
              //     }
  
              // ],
  
              
            },
  
          ]
        }, 
          // Add other blocks as needed
        ], submit: {
          type: 'plain_text',
          text: 'Submit',
        }
      };
    }else{
      updatedView = {
        type: 'modal',
        callback_id: 'p2splunk-submit',
        title: {
          type: 'plain_text',
          text: 'Product Packaging Splunk',
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
          "type": "section",
          "text": {
            "type": "plain_text",
            "text": "Choose a Cloud Provider: "+cloud_provider,
            "emoji": true,
          }
        }, {
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
                  text: "us-gov-west-1(US West)",
                  emoji: true
                },
                value: "us-gov-west-1"
              },
              {
                text: {
                  type: "plain_text",
                  text: "us-gov-east-1(US East)",
                  emoji: true
                },
                value: "us-gov-east-1"
              },
              
    
    
            ],
            action_id: "region_input",
            initial_option: {
              text: {
                type: "plain_text",
                text: "us-gov-west-1(US West)",
                emoji: true
              },
              value: "us-gov-west-1"
            },
          },
          label: {
            type: "plain_text",
            text: "Region",
            emoji: true
          }
        }, 
        {
          type: "input",
          block_id: 'fedramp_type',
          element: {
            type: "static_select",
            placeholder: {
              type: "plain_text",
              text: "Select a FedRamp Type",
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
              },
              {
                text: {
                  type: "plain_text",
                  text: "IL5",
                  emoji: true
                },
                value: "IL5"
              },
    
    
            ],
            action_id: "fedramp_type_input",
            initial_option: {
              text: {
                type: "plain_text",
                text: "High",
                emoji: true
              },
              value: "high"
            },
          },
          label: {
            type: "plain_text",
            text: "Fedramp Type",
            emoji: true
          }
        },{
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
                  text: "U.S. Gov: DoD / IC",
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
              },
              {
                text: {
                  type: "plain_text",
                  text: "Non-Government",
                  emoji: true
                },
                value: "Non-Government"
              },
    
    
            ],
            action_id: "customer_classification_input",
            initial_option: {
              text: {
                type: "plain_text",
                text: "U.S. Gov: DoD / IC",
                emoji: true
              },
              value: "U.S. Gov: DoD / IC"
            },
          },
          label: {
            type: "plain_text",
            text: "Customer Classification",
            emoji: true
          }
        }, {
          "type": "actions",
          "elements": [
            {
              "type": "checkboxes",
              "options": [
                {
                  "text": {
                    "type": "plain_text",
                    "text": "Net New*",
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
                },
              ],
              "action_id": "details_aws_checkbox",
              "initial_options": ini_v,
            },
          ]
        },  {
          "type": "section",
          "text": {
            "type": "plain_text",
            "text": "Existing",
            "emoji": true,
    
          }
        }, {
          "type": "actions",
          "elements": [
            {
              "type": "checkboxes",
              "options": [
    
                {
                  "text": {
                    "type": "plain_text",
                    "text": "IDM",
                    "emoji": true
                  },
    
                  "value": "idm"
                },
                {
                  "text": {
                    "type": "plain_text",
                    "text": "X6i Instances",
                    "emoji": true
                  },
    
                  "value": "x6i"
                },
    
              ],
              "action_id": "existing_checkbox",
             
            },
            
    
          ]
        }, 
        {
          "type": "section",
          "text": {
            "type": "plain_text",
            "text": "Entitlements",
            "emoji": true,

          }
        },{
          "type": "actions",
          "elements": [
            {
              "type": "radio_buttons",
              "options": [
                {
                  "text": {
                    "type": "plain_text",
                    "text": "Ingest",
                    "emoji": true
                  },
                  "value": "Ingest"
                },
                {
                  "text": {
                    "type": "plain_text",
                    "text": "SVCs",
                    "emoji": true
                  },
                  "value": "svcs"
                },
                
              ],
              action_id: "entitlements_input",
            
         
        },
          ]
        },{
          type: "input",
          block_id: 'it_cloud_foundations',
          label: {
            type: 'plain_text',
            text: 'IT Cloud Foundations'
          },
          element: {
            type: 'plain_text_input',
            action_id: 'it_cloud_foundations_input',
            initial_value: '10'
          }
        }, {
          type: "input",
          block_id: 'security_cloud_foundations',
          label: {
            type: 'plain_text',
            text: 'Security Cloud Foundations'
          },
          element: {
            type: 'plain_text_input',
            action_id: 'security_cloud_foundations_input',
            initial_value: '0'
          }
        }, {
          type: "input",
          block_id: 'splunk_cloud_platform',
          label: {
            type: 'plain_text',
            text: 'Splunk Cloud Platform'
          },
          element: {
            type: 'plain_text_input',
            action_id: 'splunk_cloud_platform_input',
            initial_value: '0'
          }
        }, {
          "type": "section",
          "text": {
            "type": "plain_text",
            "text": "Apps",
            "emoji": true,
  
          }
        }, {
          "type": "actions",
          "elements": [
            {
              "type": "checkboxes",
              "options": [
                {
                  "text": {
                    "type": "plain_text",
                    "text": "ES",
                    "emoji": true
                  },
  
                  "value": "es"
                },
                {
                  "text": {
                    "type": "plain_text",
                    "text": "ITSI",
                    "emoji": true
                  },
  
                  "value": "itsi"
                },
                {
                  "text": {
                    "type": "plain_text",
                    "text": "PCI",
                    "emoji": true
                  },
  
                  "value": "pci"
                },{
                  "text": {
                    "type": "plain_text",
                    "text": "VMWare",
                    "emoji": true
                  },
  
                  "value": "vmware"
                },{
                  "text": {
                    "type": "plain_text",
                    "text": "Exchange",
                    "emoji": true
                  },
  
                  "value": "exchange"
                },
              ],
              "action_id": "apps_checkbox",
              //"initial_options" :(userInputData.get('details')).map((value) => ({ text: { type: 'plain_text', text: value }, value })),
              //   "initial_options": [
              //     {
              //         "text": {
              //             "type": "plain_text",
              //             "text": "Net New*",
              //             "emoji": true
              //         },
              //         "value": "net_new"
              //     },
              //     {
              //         "text": {
              //             "type": "plain_text",
              //             "text": "Requesting IDM",
              //             "emoji": true
              //         },
              //         "value": "idm"
              //     },{
              //       text: { type: 'plain_text', text: 'DDAA', emoji: true },
              //       value: 'ddaa'
              //     }
  
              // ],
  
              
            },
  
          ]
        }, 
        
    
    
    
    
    
          // Add other blocks as needed
        ], submit: {
          type: 'plain_text',
          text: 'Submit',
        }
      };
    }
  }

  //view.blocks = oldblock


  //view.block = view.blocks.slice(14)



  //return view;
  // // Create a new view object or modify the existing one based on the selected option
 
  return updatedView;
}

function updateModalView_aws(body, selectedOption) {
  let cloud_provider = userInputData.get("cloud_provider")
  // Create a new view object or modify the existing one based on the selected option
  const updatedView = {
    type: 'modal',
    callback_id: 'p2splunk-submit',
    title: {
      type: 'plain_text',
      text: 'Product Packaging Splunk',
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
      "type": "section",
      "text": {
        "type": "plain_text",
        "text": "Choose a Cloud Provider: " + cloud_provider,
        "emoji": true,
      }
    }, {
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
            type: "plain_text",
            text: "us-east-1 (N. Virginia)",
            emoji: true
          },
          value: "us-east-1"
        },
      },
      label: {
        type: "plain_text",
        text: "Region",
        emoji: true
      }
    }, {
      "type": "section",
      "text": {
        "type": "plain_text",
        "text": "Details",
        "emoji": true,

      }
    }, {
      "type": "actions",
      "elements": [
        {
          "type": "checkboxes",
          "options": [
            {
              "text": {
                "type": "plain_text",
                "text": "Net New*",
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
                "text": "HIPAA/PIC",
                "emoji": true
              },

              "value": "hipaa"
            },
            {
              "text": {
                "type": "plain_text",
                "text": "DDAA",
                "emoji": true
              },

              "value": "ddaa"
            }, {
              "text": {
                "type": "plain_text",
                "text": "Encryption",
                "emoji": true
              },

              "value": "encryption"
            },
          ],
          "action_id": "details_aws_checkbox",

        },

      ]
    },{
      "type": "section",
      "text": {
        "type": "plain_text",
        "text": "POC(t/f)",
        "emoji": true,

      }
    },{
      "type": "actions",
      "elements": [
        {
          "type": "checkboxes",
          "options": [
            {
              "text": {
                "type": "plain_text",
                "text": "POC",
                "emoji": true
              },

              "value": "poc"
            },

          ],
          "action_id": "poc_checkbox",

        },

      ]
    },{
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
            value: "N/A"
          },
          {
            text: {
              type: "plain_text",
              text: "Autobahn",
              emoji: true
            },
            value: "Autobahn"
          },
          {
            text: {
              type: "plain_text",
              text: "Custom",
              emoji: true
            },
            value: "Custom"
          }
        ],
        action_id: "poc_type_input",
        initial_option :{
          text:{
            type: "plain_text",
            text: "N/A",
            emoji: true
          },
          value: "N/A"
        }
      },
      label: {
        type: "plain_text",
        text: "POC Type",
        emoji: true
      }
    },{
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
        action_id: "autobahn_lane_input",
        initial_option :{
          text:{
            type: "plain_text",
            text: "AWS Monitoring POV",
            emoji: true
          },
          value: "AWS Monitoring POV"
        }
      },
      label: {
        type: "plain_text",
        text: "Autobaun Line",
        emoji: true
      }
    }, {
      "type": "section",
      "text": {
        "type": "plain_text",
        "text": "Existing",
        "emoji": true,

      }
    }, {
      "type": "actions",
      "elements": [
        {
          "type": "checkboxes",
          "options": [
            {
              "text": {
                "type": "plain_text",
                "text": "Noah",
                "emoji": true
              },

              "value": "noah"
            },
            {
              "text": {
                "type": "plain_text",
                "text": "IDM",
                "emoji": true
              },

              "value": "idm"
            },
            {
              "text": {
                "type": "plain_text",
                "text": "Im4gn Indexer",
                "emoji": true
              },

              "value": "im4gn"
            },
            {
              "text": {
                "type": "plain_text",
                "text": "I3en Indexers",
                "emoji": true
              },

              "value": "i3en"
            }, {
              "text": {
                "type": "plain_text",
                "text": "X6i Instances",
                "emoji": true
              },

              "value": "x6i"
            },
          ],
          "action_id": "existing_checkbox",

        },

      ]
    },{
      "type": "section",
      "text": {
        "type": "plain_text",
        "text": "Entitlements",
        "emoji": true,

      }
    },
    {
      "type": "actions",
      "elements": [
        {
          "type": "radio_buttons",
          "options": [
            {
              "text": {
                "type": "plain_text",
                "text": "Ingest",
                "emoji": true
              },
              "value": "Ingest"
            },
            {
              "text": {
                "type": "plain_text",
                "text": "SVCs",
                "emoji": true
              },
              "value": "svcs"
            },
            
          ],
          action_id: "entitlements_input",
        
     
    },
      ]
    },
    {
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






      // Add other blocks as needed
    ], submit: {
      type: 'plain_text',
      text: 'Submit',
    }
  };

  return updatedView;
}
function updateModalView_gcp(body, selectedOption) {
  let cloud_provider = userInputData.get("cloud_provider")
  // Create a new view object or modify the existing one based on the selected option
  const updatedView = {
    type: 'modal',
    callback_id: 'p2splunk-submit',
    title: {
      type: 'plain_text',
      text: 'Product Packaging Splunk',
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
      "type": "section",
      "text": {
        "type": "plain_text",
        "text": "Choose a Cloud Provider: " + cloud_provider,
        "emoji": true,
      }
    }, {
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
        action_id: "region_input",
        initial_option: {
          text: {
            type: "plain_text",
            text: "us-central-1 (lowa)",
            emoji: true
          },
          value: "us-central1"
        },
      },
      label: {
        type: "plain_text",
        text: "Region",
        emoji: true
      }
    }, {
      "type": "actions",
      "elements": [
        {
          "type": "checkboxes",
          "options": [
            {
              "text": {
                "type": "plain_text",
                "text": "Net New*",
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
            },
          ],
          "action_id": "details_aws_checkbox",
        },
      ]
    }, {
      "type": "section",
      "text": {
        "type": "plain_text",
        "text": "POC(t/f)",
        "emoji": true,

      }
    },
    {
      "type": "actions",
      "elements": [
        {
          "type": "checkboxes",
          "options": [
            {
              "text": {
                "type": "plain_text",
                "text": "POC",
                "emoji": true
              },

              "value": "poc"
            },

          ],
          "action_id": "poc_checkbox",

        },
      ]
    }, {
      "type": "section",
      "text": {
        "type": "plain_text",
        "text": "Existing",
        "emoji": true,

      }
    }, {
      "type": "actions",
      "elements": [
        {
          "type": "checkboxes",
          "options": [

            {
              "text": {
                "type": "plain_text",
                "text": "IDM",
                "emoji": true
              },

              "value": "idm"
            },

          ],
          "action_id": "existing_checkbox",

        },

      ]
    }, {
      "type": "section",
      "text": {
        "type": "plain_text",
        "text": "Entitlements",
        "emoji": true,

      }
    },
    {
      "type": "actions",
      "elements": [
        {
          "type": "radio_buttons",
          "options": [
            {
              "text": {
                "type": "plain_text",
                "text": "Ingest",
                "emoji": true
              },
              "value": "Ingest"
            },
            {
              "text": {
                "type": "plain_text",
                "text": "SVCs",
                "emoji": true
              },
              "value": "svcs"
            },
            
          ],
          action_id: "entitlements_input",
        
     
    },
      ]
    },
    {
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





      // Add other blocks as needed
    ], submit: {
      type: 'plain_text',
      text: 'Submit',
    }
  };

  return updatedView;
}
function updateModalView_fedramp(body, selectedOption) {
  let cloud_provider = userInputData.get("cloud_provider")
  // Create a new view object or modify the existing one based on the selected option
  const updatedView = {
    type: 'modal',
    callback_id: 'p2splunk-submit',
    title: {
      type: 'plain_text',
      text: 'Product Packaging Splunk',
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
      "type": "section",
      "text": {
        "type": "plain_text",
        "text": "Choose a Cloud Provider: "+cloud_provider,
        "emoji": true,
      }
    }, {
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
              text: "us-gov-west-1(US West)",
              emoji: true
            },
            value: "us-gov-west-1"
          },
          {
            text: {
              type: "plain_text",
              text: "us-gov-east-1(US East)",
              emoji: true
            },
            value: "us-gov-east-1"
          },
          


        ],
        action_id: "region_input",
        initial_option: {
          text: {
            type: "plain_text",
            text: "us-gov-west-1(US West)",
            emoji: true
          },
          value: "us-gov-west-1"
        },
      },
      label: {
        type: "plain_text",
        text: "Region",
        emoji: true
      }
    }, 
    {
      type: "input",
      block_id: 'fedramp_type',
      element: {
        type: "static_select",
        placeholder: {
          type: "plain_text",
          text: "Select a FedRamp Type",
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
          },
          {
            text: {
              type: "plain_text",
              text: "IL5",
              emoji: true
            },
            value: "IL5"
          },


        ],
        action_id: "fedramp_type_input",
        initial_option: {
          text: {
            type: "plain_text",
            text: "High",
            emoji: true
          },
          value: "high"
        },
      },
      label: {
        type: "plain_text",
        text: "Fedramp Type",
        emoji: true
      }
    },{
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
              text: "U.S. Gov: DoD / IC",
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
          },
          {
            text: {
              type: "plain_text",
              text: "Non-Government",
              emoji: true
            },
            value: "Non-Government"
          },


        ],
        action_id: "customer_classification_input",
        initial_option: {
          text: {
            type: "plain_text",
            text: "U.S. Gov: DoD / IC",
            emoji: true
          },
          value: "U.S. Gov: DoD / IC"
        },
      },
      label: {
        type: "plain_text",
        text: "Customer Classification",
        emoji: true
      }
    }, {
      "type": "actions",
      "elements": [
        {
          "type": "checkboxes",
          "options": [
            {
              "text": {
                "type": "plain_text",
                "text": "Net New*",
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
            },
          ],
          "action_id": "details_aws_checkbox",
        },
      ]
    },  {
      "type": "section",
      "text": {
        "type": "plain_text",
        "text": "Existing",
        "emoji": true,

      }
    }, {
      "type": "actions",
      "elements": [
        {
          "type": "checkboxes",
          "options": [

            {
              "text": {
                "type": "plain_text",
                "text": "IDM",
                "emoji": true
              },

              "value": "idm"
            },
            {
              "text": {
                "type": "plain_text",
                "text": "X6i Instances",
                "emoji": true
              },

              "value": "x6i"
            },

          ],
          "action_id": "existing_checkbox",
         
        },
        

      ]
    }, {
      "type": "section",
      "text": {
        "type": "plain_text",
        "text": "Entitlements",
        "emoji": true,

      }
    },{
      "type": "actions",
      "elements": [
        {
          "type": "radio_buttons",
          "options": [
            {
              "text": {
                "type": "plain_text",
                "text": "Ingest",
                "emoji": true
              },
              "value": "Ingest"
            },
            {
              "text": {
                "type": "plain_text",
                "text": "SVCs",
                "emoji": true
              },
              "value": "svcs"
            },
            
          ],
          action_id: "entitlements_input",
        
     
    },
      ]
    },
    {
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






      // Add other blocks as needed
    ], submit: {
      type: 'plain_text',
      text: 'Submit',
    }
  };

  return updatedView;
}


//write a function to print a json string in json format not just a string
  
function generate_details_map(input) {
  const myMap = new Map();
  myMap.set("net_new", "Net New*");
  myMap.set("idm", "Requesting IDM");
  myMap.set("hipaa", "HIPAA/PIC");
  myMap.set("ddaa", "DDAA")
  myMap.set("encryption", "Encryption")

  const output = [];
  if (input == undefined){
    return output
  }
  for (const item of input) {
    const value = myMap.get(item) || '';
    output.push({
      text: {
        type: "plain_text",
        text: value,
        emoji: true
      },
      value: item
    });
  }
  console.log(output)
  return output;
}

function generate_poc_map(input) {
  const myMap = new Map();
  myMap.set("poc", "POC");
  const output = [];
  console.log("input in generate_poc_map is:", input)
  if (input == undefined){
    return output
  }
  for (const item of input) {
    const value = myMap.get(item) ||'';
    output.push({
      text: {
        type: "plain_text",
        text: value,

        emoji: true
      },
      value: item
    });


  }
  console.log(output)
  return output;

}

function generate_exisiting_map(input) {
  const myMap = new Map();
  myMap.set("noah", "Noah");
  myMap.set("idm", "IDM");
  myMap.set("im4gn", "Im4gn Indexer");
  myMap.set("i3en", "I3en Indexers");
  myMap.set("x6i", "X6i Instances");

  const output = [];
  console.log("input is:", input)
  if (input == undefined){
    return output
  }
  for (const item of input) {
    const value = myMap.get(item) ||'';
    output.push({
      text: {
        type: "plain_text",
        text: value,

        emoji: true
      },
      value: item
    });


  }
  console.log(output)
  return output;

}

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
  inputinfo += "Stack Name: " + stack_name + "\n";

  //let cloud_provider = values.cloud_provider.cloud_provider_input.selected_option.value;
  let cloud_provider = userInputData.get("cloud_provider")
  inputinfo += "Cloud Provider: " + cloud_provider + "\n";

  let region = values.region.region_input.selected_option.value;
  inputinfo += "Region: " + region + "\n";

  let all_details = userInputData.get("details");

  inputinfo += "Details: " + all_details + "\n";
  let details_netnew = false;
  let details_ridm = false;
  let details_hipaa = false;
  let details_encrption = false;
  let details_ddaa = false;
  let details_poc = userInputData.get("poc_checkbox") || '';
  console.log("+++++++++++++++=")
  console.log(details_poc)
  console.log(details_poc + "------------" + details_poc=='')
  if (all_details.includes("net_new")) {

    details_netnew = true
  }
  if (all_details.includes("idm")) {

    details_ridm = true
  }
  if (all_details.includes("hipaa")) {
    details_hipaa = true
  }
  if (all_details.includes("ddaa")) {
    details_ddaa = true
  }
  if (all_details.includes("encryption")) {
    details_encrption = true
  }
  if (details_poc != '' && details_poc.length != 0) {
    
    details_poc = true
  } else {
    detail_poc = false
  }
  // let details_netnew = values.details_netnew_tf.netnew_input.selected_option.value;
  // details_netnew = (details_netnew === 'true');
  // let details_ridm = values.details_ridm_tf.irdm_input.selected_option.value;
  // details_ridm = (details_ridm === 'true');
  // let details_hipaa = values.details_hipaa_tf.hipaa_input.selected_option.value;
  // details_hipaa = (details_hipaa === 'true');
  // let details_ddaa = values.details_ddaa_tf.ddaa_input.selected_option.value;
  // details_ddaa = (details_ddaa === 'true');
  // let details_encrption = values.details_encryption_tf.encryption_input.selected_option.value;
  // details_encrption = (details_encrption === 'true');
  // let details_poc = values.poc_tf.poc_tf_input.selected_option.value;
  // details_poc = (details_poc === 'true');
  // let existing_idm = (values.existing_idm_tf.existing_idm_input.selected_option.value === 'true');
  // let existing_noah = (values.existing_noah_tf.existing_noah_input.selected_option.value === 'true');
  // let existing_im4gn = (values.existing_im4gn_tf.existing_im4gn_input.selected_option.value === 'true');
  // let existing_i3en = (values.existing_i3en_tf.existing_i3en_input.selected_option.value === 'true');
  // let existing_x6i = (values.existing_x6i_tf.existing_x6i_input.selected_option.value === 'true');
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

  body3["input"]["templates"][0]["inputs"]["order"]["existing"]["noah"] = false
  body3["input"]["templates"][0]["inputs"]["order"]["existing"]["idm"] = false
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



  const body2 = {}
  body2["input"] = {}
  body2["input"]["name"] = 'sampleco'
  body2["input"]["inputs"] = {}
  body2["input"]["inputs"]["customerType"] = 'Dev'
  body2["input"]["inputs"]["region"] = 'us-east-1'


  inputinfo = body3


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
  let cloud_provider = userInputData.get("cloud_provider")
  let region = values.region.region_input.selected_option.value;
  // let details_netnew = values.details_netnew_tf.netnew_input.selected_option.value;
  // details_netnew = (details_netnew === 'true');
  // let details_ridm = values.details_ridm_tf.irdm_input.selected_option.value;
  // details_ridm = (details_ridm === 'true');
  // let details_encrption = values.details_encryption_tf.encryption_input.selected_option.value;
  // details_encrption = (details_encrption === 'true');
  // let details_poc = values.poc_tf.poc_tf_input.selected_option.value;
  // details_poc = (details_poc === 'true');
  let all_details = userInputData.get("details");
  let details_netnew = false;
  let details_ridm = false;
  let details_hipaa = false;
  let details_encrption = false;
  let details_ddaa = false;
  let existing_idm = userInputData.get("existing_idm") || '';
  let details_poc = userInputData.get("poc_checkbox") || '';
  if (all_details.includes("net_new")) {

    details_netnew = true
  }
  if (all_details.includes("idm")) {

    details_ridm = true
  }
  if (all_details.includes("hipaa")) {
    details_hipaa = true
  }
  if (all_details.includes("ddaa")) {
    details_ddaa = true
  }
  if (all_details.includes("encryption")) {
    details_encrption = true
  }
  if (details_poc != '') {
    details_poc = true
  } else {
    detail_poc = false
  }
  if (existing_idm != '') {
    existing_idm = true
  } else {
    existing_idm = false
  }

  // let existing_idm = (values.existing_idm_tf.existing_idm_input.selected_option.value === 'true');
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


  inputinfo = body3

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

async function sendRequest_fedramp(body) {
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
  let cloud_provider = userInputData.get("cloud_provider")
  let region = values.region.region_input.selected_option.value;
  // let details_netnew = values.details_netnew_tf.netnew_input.selected_option.value;
  // details_netnew = (details_netnew === 'true');
  // let details_ridm = values.details_ridm_tf.irdm_input.selected_option.value;
  // details_ridm = (details_ridm === 'true');
  // let details_encrption = values.details_encryption_tf.encryption_input.selected_option.value;
  // details_encrption = (details_encrption === 'true');
  // let details_poc = values.poc_tf.poc_tf_input.selected_option.value;
  // details_poc = (details_poc === 'true');
  let all_details = userInputData.get("details");
  let details_netnew = false;
  let details_ridm = false;
  let details_hipaa = false;
  let details_encrption = false;
  let details_ddaa = false;
  let existing_idm = userInputData.get("existing_idm") || '';
  let existing_x6i = userInputData.get("existing_x6i") || '';
  let details_poc = userInputData.get("poc_checkbox") || '';
  if (all_details.includes("net_new")) {

    details_netnew = true
  }
  if (all_details.includes("idm")) {

    details_ridm = true
  }
  if (all_details.includes("hipaa")) {
    details_hipaa = true
  }
  if (all_details.includes("ddaa")) {
    details_ddaa = true
  }
  if (all_details.includes("encryption")) {
    details_encrption = true
  }
  if (details_poc != '') {
    details_poc = true
  } else {
    detail_poc = false
  }
  if (existing_idm != '') {
    existing_idm = true
  } else {
    existing_idm = false
  }
  if (existing_x6i != '') {
    existing_x6i = true
  } else {
    existing_x6i = false
  }
  let fedramp_type = values.fedramp_type.fedramp_type_input.selected_option.value;
  let customer_classification = values.customer_classification.customer_classification_input.selected_option.value;
  // let existing_idm = (values.existing_idm_tf.existing_idm_input.selected_option.value === 'true');
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
  let body3 = {}
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
  body3["input"]["templates"][0]["inputs"]["order"]["poc"] = false
  body3["input"]["templates"][0]["inputs"]["order"]["poc_type"] = ""
  body3["input"]["templates"][0]["inputs"]["order"]["fedramp_type"] = fedramp_type
  body3["input"]["templates"][0]["inputs"]["order"]["customer_classification"] = customer_classification

  body3["input"]["templates"][0]["inputs"]["order"]["autobahn_lane"] = ""
  console.log(JSON.stringify(body3))
  console.log(fedramp_type)
  body3["input"]["templates"][0]["inputs"]["order"]["existing"] = {}

  body3["input"]["templates"][0]["inputs"]["order"]["existing"]["noah"] = false
  body3["input"]["templates"][0]["inputs"]["order"]["existing"]["idm"] = existing_idm
  body3["input"]["templates"][0]["inputs"]["order"]["existing"]["im4gn_indexers"] = false
  body3["input"]["templates"][0]["inputs"]["order"]["existing"]["i3en_indexers"] = false
  body3["input"]["templates"][0]["inputs"]["order"]["existing"]["x6i_instances"] = existing_x6i
  body3["input"]["templates"][0]["inputs"]["order"]["ingest"] = {}
  body3["input"]["templates"][0]["inputs"]["order"]["ingest"]["cloud"] = cloud_num
  body3["input"]["templates"][0]["inputs"]["order"]["ingest"]["es"] = es_num
  body3["input"]["templates"][0]["inputs"]["order"]["ingest"]["itsi"] = itsi_num
  body3["input"]["templates"][0]["inputs"]["order"]["ingest"]["pci"] = pci_num
  body3["input"]["templates"][0]["inputs"]["order"]["ingest"]["vmware"] = vmware_num
  body3["input"]["templates"][0]["inputs"]["order"]["ingest"]["exchange"] = exchange_num
  body3["input"]["mixins"] = []

  inputinfo = body3


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
app.action('poc_checkbox', async ({ ack, body, client }) => {
  try {
    await ack();
    const selectedValues = body.actions[0].selected_options.map((option) => option.value);
    userInputData.set('poc_checkbox', selectedValues);
    const updatedView = updateModalView_netnew(body);
    console.log('Selected values of checkboxes:', selectedValues);

  } catch (error) {
    console.error('Error handling checkbox selection:', error);
  }
});

app.action('existing_checkbox', async ({ ack, body, client }) => {
  try {
    await ack();
    const selectedValues = body.actions[0].selected_options.map((option) => option.value);
    userInputData.set('existing_checkbox', selectedValues);    console.log('Selected values of checkboxes:', selectedValues);

  } catch (error) {
    console.error('Error handling checkbox selection:', error);
  }
});
app.action('details_aws_checkbox', async ({ ack, body, client }) => {
  try {
    // Acknowledge the checkbox selection
    await ack();
    const selectedValues = body.actions[0].selected_options.map((option) => option.value);
    userInputData.set('details', selectedValues);
  // let updatedView = updateModalView_netnew2(body);
    let updatedBlocks = updateModalView_netnew(body);
   // console.log("123========"+updatedBlocks)
    console.log('Selected values of checkboxes:', selectedValues);
    const ar = ['1', '2']
    console.log(typeof Array.isArray(ar))
    console.log('Selected values of checkboxesddd:', userInputData.get('details'));
    if (selectedValues.includes('net_new')) {
      const updatedView = {
        type: 'modal',
        callback_id: 'p2splunk-submit',
        title: {
          type: 'plain_text',
          text: 'Product Packaging Splunk'
        },
        blocks: updatedBlocks,
        submit: {
          type: 'plain_text',//standard stuff and required for modals
          text: 'Submit',
        }
      }; 
      await ack({
        "response_action": "update",
      "view": updatedView
      
      });

      // await client.views.update({
      //   // token: process.env.SLACK_BOT_TOKEN,
      //   trigger_id: body.trigger_id,
      //   response_action: "update",
      //   view_id: body.view.id,
      //   view: updatedView,
      //   // hash:"156772938.1827394"
      // });

      
      await app.client.views.update({
        trigger_id: body.trigger_id,
        response_action: "update",
        view_id: body.view.id,
        // view: {
        //   ...body.view,
        //   blocks: updatedBlocks,
        // },
        view: updatedView,
      });
    }


    // Get the selected values of the checkboxes


  } catch (error) {
    console.error('Error handling checkbox selection:', error);
  }
});

function updateModalView_netnew(body) {
  try {
    const view = body.view;
    const block21Index = body.view.blocks.findIndex((block) => block.block_id === "block_21");
    const updatedBlocks = view.blocks.map((block) => {
      if (block.block_id === "three_buttons") {
        return {
          "type": "actions",
          "block_id": "three_buttons",
          
          "elements": [
            {
              "type": "button",
              "text": {
                "type": "plain_text",
                "text": "AWSsssss",
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
        }
      }
    return block
    });
    console.log("my updated blocks is:")
    
    console.log(updatedBlocks[21])
    return updatedBlocks
    
      

  }catch (error) {
    console.error('Error handling checkbox selection:', error);
  }
}
function updateModalView_netnew2(body) {
  // Create a new view object or modify the existing one based on the selected option
  console.log(Array.isArray(userInputData.get('details')))
  console.log((userInputData.get('details')).map((value) => ({ value })))
  //cloud_provider = userInputData.get("cloud_provider")

  ini_v = generate_details_map(userInputData.get('details'))
  let updatedView = {
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
      "type": "section",
      "text": {
        "type": "plain_text",
        "text": "Choose a Cloud Provider: " +cloudProvider,
        "emoji": true,
      }
    }, {
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
            type: "plain_text",
            text: "us-east-1 (N. Virginia)",
            emoji: true
          },
          value: "us-east-1"
        },
      },
      label: {
        type: "plain_text",
        text: "Region",
        emoji: true
      }
    }, {
      "type": "section",
      "text": {
        "type": "plain_text",
        "text": "Details",
        "emoji": true,

      }
    }, {
      "type": "actions",
      "elements": [
        {
          "type": "checkboxes",
          "options": [
            {
              "text": {
                "type": "plain_text",
                "text": "Net New*",
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
                "text": "HIPAA/PIC",
                "emoji": true
              },

              "value": "hipaa"
            },
            {
              "text": {
                "type": "plain_text",
                "text": "DDAA",
                "emoji": true
              },

              "value": "ddaa"
            }, {
              "text": {
                "type": "plain_text",
                "text": "Encryption",
                "emoji": true
              },

              "value": "encryption"
            },
          ],
          "action_id": "details_aws_checkbox",
          //"initial_options" :(userInputData.get('details')).map((value) => ({ text: { type: 'plain_text', text: value }, value })),
          //   "initial_options": [
          //     {
          //         "text": {
          //             "type": "plain_text",
          //             "text": "Net New*",
          //             "emoji": true
          //         },
          //         "value": "net_new"
          //     },
          //     {
          //         "text": {
          //             "type": "plain_text",
          //             "text": "Requesting IDM",
          //             "emoji": true
          //         },
          //         "value": "idm"
          //     },{
          //       text: { type: 'plain_text', text: 'DDAA', emoji: true },
          //       value: 'ddaa'
          //     }

          // ],

          "initial_options": ini_v,
        },

      ]
    }, {
      "type": "section",
      "text": {
        "type": "plain_text",
        "text": "POC(t/f)",
        "emoji": true,

      }
    },
    {
      "type": "actions",
      "elements": [
        {
          "type": "checkboxes",
          "options": [
            {
              "text": {
                "type": "plain_text",
                "text": "POC",
                "emoji": true
              },

              "value": "poc"
            },

          ],
          "action_id": "poc_checkbox",

        },

      ]
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
    },{
      "type": "section",
      "text": {
        "type": "plain_text",
        "text": "Entitlements",
        "emoji": true,

      }
    },{
      "type": "actions",
      "elements": [
        {
          "type": "radio_buttons",
          "options": [
            {
              "text": {
                "type": "plain_text",
                "text": "Ingest",
                "emoji": true
              },
              "value": "Ingest"
            },
            {
              "text": {
                "type": "plain_text",
                "text": "SVCs",
                "emoji": true
              },
              "value": "svcs"
            },
            
          ],
          action_id: "entitlements_input",
        
     
    },
      ]
    },{
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
      // Add other blocks as needed
    ], submit: {
      type: 'plain_text',
      text: 'Submit',
    }
  };
  let cloud_provider = userInputData.get("cloud_provider");
  if (cloud_provider == "gcp") {
    updatedView = {
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
        "type": "section",
        "text": {
          "type": "plain_text",
          "text": "Choose a Cloud Provider",
          "emoji": true,
        }
      }, {
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
          action_id: "region_input",
          initial_option: {
            text: {
              type: "plain_text",
              text: "us-central-1 (lowa)",
              emoji: true
            },
            value: "us-central1"
          },
        },
        label: {
          type: "plain_text",
          text: "Region",
          emoji: true
        }
      }, {
        "type": "section",
        "text": {
          "type": "plain_text",
          "text": "Details",
          "emoji": true,

        }
      }, {
        "type": "actions",
        "elements": [
          {
            "type": "checkboxes",
            "options": [
              {
                "text": {
                  "type": "plain_text",
                  "text": "Net New*",
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
              },
            ],
            "action_id": "details_aws_checkbox",
            //"initial_options" :(userInputData.get('details')).map((value) => ({ text: { type: 'plain_text', text: value }, value })),
            //   "initial_options": [
            //     {
            //         "text": {
            //             "type": "plain_text",
            //             "text": "Net New*",
            //             "emoji": true
            //         },
            //         "value": "net_new"
            //     },
            //     {
            //         "text": {
            //             "type": "plain_text",
            //             "text": "Requesting IDM",
            //             "emoji": true
            //         },
            //         "value": "idm"
            //     },{
            //       text: { type: 'plain_text', text: 'DDAA', emoji: true },
            //       value: 'ddaa'
            //     }

            // ],

            "initial_options": ini_v,
          },

        ]
      }, {
        "type": "section",
        "text": {
          "type": "plain_text",
          "text": "POC(t/f)",
          "emoji": true,

        }
      },
      {
        "type": "actions",
        "elements": [
          {
            "type": "checkboxes",
            "options": [
              {
                "text": {
                  "type": "plain_text",
                  "text": "POC",
                  "emoji": true
                },

                "value": "poc"
              },

            ],
            "action_id": "poc_checkbox",
            "initial_options": ini_poc,

          },

        ]
      },{
        "type": "section",
        "text": {
          "type": "plain_text",
          "text": "Entitlements",
          "emoji": true,

        }
      },{
        "type": "actions",
        "elements": [
          {
            "type": "radio_buttons",
            "options": [
              {
                "text": {
                  "type": "plain_text",
                  "text": "Ingest",
                  "emoji": true
                },
                "value": "Ingest"
              },
              {
                "text": {
                  "type": "plain_text",
                  "text": "SVCs",
                  "emoji": true
                },
                "value": "svcs"
              },
              
            ],
            action_id: "entitlements_input",
          
       
      },
        ]
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
        // Add other blocks as needed
      ], submit: {
        type: 'plain_text',
        text: 'Submit',
      }
    };
  }else if(cloud_provider == "fedramp"){
    updatedView = {
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
        "type": "section",
        "text": {
          "type": "plain_text",
          "text": "Choose a Cloud Provider",
          "emoji": true,
        }
      }, {
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
      }, {
        "type": "section",
        "text": {
          "type": "plain_text",
          "text": "Details",
          "emoji": true,

        }
      }, {
        "type": "actions",
        "elements": [
          {
            "type": "checkboxes",
            "options": [
              {
                "text": {
                  "type": "plain_text",
                  "text": "Net New*",
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
              },
            ],
            "action_id": "details_aws_checkbox",
            //"initial_options" :(userInputData.get('details')).map((value) => ({ text: { type: 'plain_text', text: value }, value })),
            //   "initial_options": [
            //     {
            //         "text": {
            //             "type": "plain_text",
            //             "text": "Net New*",
            //             "emoji": true
            //         },
            //         "value": "net_new"
            //     },
            //     {
            //         "text": {
            //             "type": "plain_text",
            //             "text": "Requesting IDM",
            //             "emoji": true
            //         },
            //         "value": "idm"
            //     },{
            //       text: { type: 'plain_text', text: 'DDAA', emoji: true },
            //       value: 'ddaa'
            //     }

            // ],

            "initial_options": ini_v,
          },

        ]
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
                text: "us-gov-west-1(US West)",
                emoji: true
              },
              value: "us-gov-west-1"
            },
            {
              text: {
                type: "plain_text",
                text: "us-gov-east-1(US East)",
                emoji: true
              },
              value: "us-gov-east-1"
            },
            
  
  
          ],
          action_id: "region_input",
          initial_option: {
            text: {
              type: "plain_text",
              text: "us-gov-west-1(US West)",
              emoji: true
            },
            value: "us-gov-west-1"
          },
        },
        label: {
          type: "plain_text",
          text: "Region",
          emoji: true
        }
      }, 
      {
        type: "input",
        block_id: 'fedramp_type',
        element: {
          type: "static_select",
          placeholder: {
            type: "plain_text",
            text: "Select a Fedramp Type",
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
            },
            {
              text: {
                type: "plain_text",
                text: "IL5",
                emoji: true
              },
              value: "IL5"
            },
  
  
          ],
          action_id: "fedramp_type_input",
          initial_option: {
            text: {
              type: "plain_text",
              text: "High",
              emoji: true
            },
            value: "high"
          },
        },
        label: {
          type: "plain_text",
          text: "Fedramp Type",
          emoji: true
        }
      },{
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
                text: "U.S. Gov: DoD / IC",
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
              value: "State and Local Govv"
            },
            {
              text: {
                type: "plain_text",
                text: "Non-Government",
                emoji: true
              },
              value: "Non-Government"
            },
  
  
          ],
          action_id: "customer_classification_input",
          initial_option: {
            text: {
              type: "plain_text",
              text: "U.S. Gov: DoD / IC",
              emoji: true
            },
            value: "U.S. Gov: DoD / IC"
          },
        },
        label: {
          type: "plain_text",
          text: "Customer Classification",
          emoji: true
        }
      }, {
        "type": "section",
        "text": {
          "type": "plain_text",
          "text": "Entitlements",
          "emoji": true,

        }
      },{
        "type": "actions",
        "elements": [
          {
            "type": "radio_buttons",
            "options": [
              {
                "text": {
                  "type": "plain_text",
                  "text": "Ingest",
                  "emoji": true
                },
                "value": "Ingest"
              },
              {
                "text": {
                  "type": "plain_text",
                  "text": "SVCs",
                  "emoji": true
                },
                "value": "svcs"
              },
              
            ],
            action_id: "entitlements_input",
          
       
      },
        ]
      },
       {
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
        // Add other blocks as needed
      ], submit: {
        type: 'plain_text',
        text: 'Submit',
      }
    };
  }
  return updatedView;
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

  //let cloud_provider = values.cloud_provider.cloud_provider_input.selected_option.value;
  let cloud_provider = userInputData.get("cloud_provider")
  let response = ""
  if (cloud_provider == "aws") {
    response = await sendRequest_aws(body);
  } else if (cloud_provider == "gcp") {
    response = await sendRequest_gcp(body);
  }else if (cloud_provider == "fedramp"){
    console.log("========")
    response = await sendRequest_fedramp(body);
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

  console.log(typeof response)
  let data = JSON.parse(JSON.stringify(response));
  console.log(data["resource"])
  console.log(userInputData)
  let inputIntro= "******* The input info you provided is: *******\n" 
  
  try {
   
    
      await client.chat.postMessage({
      channel: user,
      text: inputIntro + JSON.stringify(inputinfo, undefined,4) +"\n" + "**********Your output is: **********\n" + JSON.stringify(response, undefined,4) + "\n"
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
    text: `Hey there <@${message.user}>!`
  });
});

app.action('button_click', async ({ body, ack, say }) => {
  // Acknowledge the action
  await ack();
  await say(`<@${body.user.id}> clicked the button`);
});

(async () => {
  // Start your app
  //await app.start(process.env.PORT || 3000);
  await app.start(3000);

  console.log('⚡️ Bolt app is running!');
})();







// (async () => {
//   // Start your app
//   await app.start(process.env.PORT || 3000);

//   console.log('⚡️ Bolt app is running!');
// })();



//get the input value from 'users_select-action' action

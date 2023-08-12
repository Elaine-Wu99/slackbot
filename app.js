const { App } = require('@slack/bolt');
const axios = require('axios');
const fs = require('fs');
const helper = require('./helper');

// Initializes your app with your bot token and app token
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN
});

// Initialize some input data variables
const userInputData = helper.userInputData
let inputinfo = "Based on the inputinfo  you provided: \n"

// Check the argument after command /p2splunk is stack or soar
app.command('/p2bot', async ({ command, ack, body, client }) => {
  await ack();
  let cmd = command.text;
  userInputData.set("cmd", cmd)
  if (cmd == "stack") {
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
              initial_value: helper.userInputData['stack_name'] || ''
            }
          },
          {
            type: "section",
            text: {
              type: "plain_text",
              text: "Choose a Cloud Provider",
              emoji: true,

            }
          }, {
            type: "actions",
            block_id: "cloud_provider",
            elements: [
              {
                type: "radio_buttons",
                options: [
                  {
                    text: {
                      type: "plain_text",
                      text: "AWS",
                      emoji: true
                    },
                    value: "aws",

                  },
                  {
                    text: {
                      type: "plain_text",
                      text: "GCP",
                      emoji: true
                    },
                    value: "gcp",

                  }, {
                    "text": {
                      "type": "plain_text",
                      "text": "FedRamp",
                      "emoji": true
                    },
                    "value": "fedramp",

                  },

                ],

                action_id: "cloud_provider_input",

              },
            ]
          },
          {
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
              // initial_option: {
              //   text: {
              //     type: 'plain_text',
              //     text: 'us-east-1 (N. Virginia)',
              //     emoji: true,
              //   },
              //   value: 'us-east-1',
              // },
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
            "block_id": "details",
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
              initial_option: {
                text: {
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
              initial_option: {
                text: {
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
            "block_id": "exisiting",
            "text": {
              "type": "plain_text",
              "text": "Existing",
              "emoji": true,

            }
          }, {
            "type": "actions",
            "block_id": "exisiting_checkboxes",
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
  } else if (cmd == "soar") {
    try {
      const result = await client.views.open({
        trigger_id: body.trigger_id,
        view_id: "bcdef",
        view: {
          type: 'modal',
          callback_id: 'p2splunk-submit',
          title: {
            type: 'plain_text',
            text: 'Product Packaging Soar'
          },
          blocks: [
            {
              type: "input",
              block_id: 'stack_name',
              label: {
                type: 'plain_text',
                text: 'Name'
              },
              element: {
                type: 'plain_text_input',
                action_id: 'stackname_input',
                initial_value: helper.userInputData['stack_name'] || ''
              }
            },
            {
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
            },
            {
              type: "input",
              block_id: 'users_number',
              label: {
                type: 'plain_text',
                text: 'Users'
              },
              element: {
                type: 'plain_text_input',
                action_id: 'users_num_input',
                initial_value: '0'
              }
            },
            {
              type: "input",
              block_id: 'devices_number',
              label: {
                type: 'plain_text',
                text: 'Devices'
              },
              element: {
                type: 'plain_text_input',
                action_id: 'devices_num_input',
                initial_value: '0'
              }
            },

            {
              "type": "section",
              "text": {
                "type": "plain_text",
                "text": "Gen 6 Instances",
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
                        "text": "Existing Gen 6 Instance Types",
                        "emoji": true
                      },

                      "value": "gen"
                    },

                  ],
                  "action_id": "gen_checkbox",

                },

              ]
            },

          ],
          submit: {
            type: 'plain_text',
            text: 'Submit',
          }
        }
      })
    } catch (error) {
      console.error('Error handling action:', error);
    }
  }
});

app.action('entitlements_input', async ({ ack, body, client }) => {
  try {

    await ack();
    const selectedOption = body.actions[0].selected_option.value;    //const updatedView = updateModalView_scvs(body, "aws");
    userInputData.set("entitlements", selectedOption)
    let updatedBlocks = helper.updateModalView_scvs(body, "scvs");
    if (selectedOption == "Ingest") {
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
        type: 'plain_text',
        text: 'Submit',
      }
    };

    await ack({
      "response_action": "update",
      "view": updatedView
    });
    await client.views.update({
      trigger_id: body.trigger_id,
      response_action: "update",
      view_id: body.view.id,
      view: updatedView,
    });
  } catch (error) {
    console.error('Error handling action:', error);
  }
});

app.action('cloud_provider_input', async ({ ack, body, client }) => {
  try {
    await ack();
    const selectedOption = body.actions[0].selected_option.value;
    userInputData.set("cloud_provider", selectedOption)
    console.log("we set the cloud_provider to be: "+selectedOption)
    let updatedBlocks = ""
    if (selectedOption == "aws"){
      updatedBlocks =helper.updateModalView_aws(body, selectedOption);
    }
    if (selectedOption == "gcp") {
      updatedBlocks = helper.updateModalView_gcp(body, selectedOption);
    } else if (selectedOption == "fedramp") {
      updatedBlocks = helper.updateModalView_fedramp(body, selectedOption);
    }
    userInputData["cloud_provider"] = selectedOption
    const updatedView = {
      type: 'modal',
      callback_id: 'p2splunk-submit',
      title: {
        type: 'plain_text',
        text: 'Product Packaging Splunk'
      },
      blocks: updatedBlocks,
      submit: {
        type: 'plain_text',
        text: 'Submit',
      }
    };
    await ack({
      "response_action": "update",
      "view": updatedView
    });
    await client.views.update({
      trigger_id: body.trigger_id,
      response_action: "update",
      view_id: body.view.id,
      view: updatedView,
    });
  } catch (error) {
    console.error(error);
  }
});





async function sendRequest_aws(body) {
  console.log("now is aws")
  const url = 'https://api.co2.lve.splunkcloud.systems/v3/translation/translate-order/stack'
  // Read from local fs to grab the token
  const token = () => fs.readFileSync(require.resolve("~/.cloudctl/token_prod"), { encoding: "utf8" });
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token

    }
  }
  const values = body.view.state.values;
  let stack_name = values.stack_name.stackname_input.value;
  inputinfo += "Stack Name: " + stack_name + "\n";

  let cloud_provider = userInputData.get("cloud_provider")
  inputinfo += "Cloud Provider: " + cloud_provider + "\n";

  let region = values.region.region_input.selected_option.value;
  inputinfo += "Region: " + region + "\n";

  let all_details = userInputData.get("details") || [];
  let all_existings = userInputData.get("existing_checkbox") || [];
  inputinfo += "Details: " + all_details + "\n";
  let details_netnew = all_details.includes("net_new")
  let details_ridm = all_details.includes("idm")
  let details_hipaa = all_details.includes("hipaa")
  let details_encrption = all_details.includes("encryption")

  let details_ddaa = all_details.includes("ddaa")
  let details_poc = userInputData.get("poc_checkbox") || [];
  if (details_poc != undefined && details_poc.length != 0) {
    details_poc = true
  } else {
    details_poc = false
  }
  let entitlements = userInputData.get("entitlements")


  let details_poc_type = values.poc_type.poc_type_input.value;

  let details_autobahn_lane = values.autobahn_lane.autobahn_lane_input.value;
  let existing_noah = all_existings.includes("noah")
  let existing_idm = all_existings.includes("idm")
  let exisitng_im4gn = all_existings.includes("im4gn")
  let existing_i3en = all_existings.includes("i3en")
  let existing_x6i = all_existings.includes("x6i")


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
  body3["input"]["templates"][0]["inputs"]["order"]["existing"]["im4gn_indexers"] = exisitng_im4gn
  body3["input"]["templates"][0]["inputs"]["order"]["existing"]["i3en_indexers"] = existing_i3en
  body3["input"]["templates"][0]["inputs"]["order"]["existing"]["x6i_instances"] = existing_x6i
  if (entitlements == "Ingest") {
    let cloud_num = Number(values.cloud_number.cloud_num_input.value);
    let es_num = Number(values.es_number.es_num_input.value);
    let itsi_num = Number(values.itsi_number.itsi_num_input.value);
    let pci_num = Number(values.pci_number.pci_num_input.value);
    let vmware_num = Number(values.vmware_number.vmware_num_input.value);
    let exchange_num = Number(values.exchange_number.exchange_num_input.value);

    body3["input"]["templates"][0]["inputs"]["order"]["ingest"] = {}
    body3["input"]["templates"][0]["inputs"]["order"]["ingest"]["cloud"] = cloud_num
    body3["input"]["templates"][0]["inputs"]["order"]["ingest"]["es"] = es_num
    body3["input"]["templates"][0]["inputs"]["order"]["ingest"]["itsi"] = itsi_num
    body3["input"]["templates"][0]["inputs"]["order"]["ingest"]["pci"] = pci_num
    body3["input"]["templates"][0]["inputs"]["order"]["ingest"]["vmware"] = vmware_num
    body3["input"]["templates"][0]["inputs"]["order"]["ingest"]["exchange"] = exchange_num

  } else if (entitlements == "svcs") {
    let it_cloud_num = Number(values.it_cloud_foundations.it_cloud_foundations_input.value);
    let security_cloud_num = Number(values.security_cloud_foundations.security_cloud_foundations_input.value);
    let splunk_cloud_platform_num = Number(values.splunk_cloud_platform.splunk_cloud_platform_input.value)
    let all_apps = userInputData.get("apps_checkbox") || []
    let apps_es = all_apps.includes("es")
    let apps_itsi = all_apps.includes("itsi")
    let apps_pci = all_apps.includes("pci")
    let apps_vmware = all_apps.includes("vmware")
    let apps_exchange = all_apps.includes("exchange")
    body3["input"]["templates"][0]["inputs"]["order"]["svcs"] = {}
    body3["input"]["templates"][0]["inputs"]["order"]["svcs"]["it_cloud_foundations"] = it_cloud_num
    body3["input"]["templates"][0]["inputs"]["order"]["svcs"]["security_cloud_foundations"] = security_cloud_num
    body3["input"]["templates"][0]["inputs"]["order"]["svcs"]["splunk_cloud_platform"] = splunk_cloud_platform_num
    body3["input"]["templates"][0]["inputs"]["order"]["svcs"]["products"] = {}
    body3["input"]["templates"][0]["inputs"]["order"]["svcs"]["products"]["es"] = apps_es
    body3["input"]["templates"][0]["inputs"]["order"]["svcs"]["products"]["itsi"] = apps_itsi
    body3["input"]["templates"][0]["inputs"]["order"]["svcs"]["products"]["pci"] = apps_pci
    body3["input"]["templates"][0]["inputs"]["order"]["svcs"]["products"]["vmware"] = apps_vmware
    body3["input"]["templates"][0]["inputs"]["order"]["svcs"]["products"]["exchange"] = apps_exchange
  }
  body3["input"]["mixins"] = []




  inputinfo = body3

  console.log(body3)
  const response = await axios.post(url, body3, config)
  console.log(response.data)
  return response.data
}

async function sendRequest_soar(body) {
  const url = 'https://api.co2.lve.splunkcloud.systems/v3/translation/translate-order/phantomstack'
  const token = () => fs.readFileSync(require.resolve("~/.cloudctl/token_prod1"), { encoding: "utf8" });
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token

    }
  }
  const values = body.view.state.values;
  let stack_name = values.stack_name.stackname_input.value;
  inputinfo += "Stack Name: " + stack_name + "\n";

  let cloud_provider = userInputData.get("cloud_provider")
  inputinfo += "Cloud Provider: " + cloud_provider + "\n";

  let region = values.region.region_input.selected_option.value;
  inputinfo += "Region: " + region + "\n";


  let user_num = Number(values.users_number.users_num_input.value)
  let devices_num = Number(values.devices_number.devices_num_input.value)

  let details_gen = userInputData.get("gen_checkbox") || [];
  if (details_gen != undefined && details_gen.length != 0) {

    details_gen = true
  } else {
    details_gen = false
  }
  let body3 = {}
  body3["input"] = {}
  body3["input"]["name"] = stack_name
  body3["input"]["kind"] = 'PhantomStack'
  body3["input"]["inputs"] = {}
  body3["input"]["inputs"]["type"] = 'Clustered'
  body3["input"]["inputs"]["customerType"] = 'Internal'

  body3["input"]["inputs"]["account"] = "std-lve-4"
  body3["input"]["inputs"]["region"] = region

  body3["input"]["inputs"]["templates"] = []
  body3["input"]["inputs"]["templates"][0] = {}
  body3["input"]["inputs"]["templates"][0]["name"] = 'phantomstack/cloud_delivery/cda'
  body3["input"]["inputs"]["templates"][0]["inputs"] = {}
  body3["input"]["inputs"]["templates"][0]["inputs"]["order"] = {}
  body3["input"]["inputs"]["templates"][0]["inputs"]["order"]["users"] = user_num
  body3["input"]["inputs"]["templates"][0]["inputs"]["order"]["devices"] = devices_num
  body3["input"]["inputs"]["templates"][0]["inputs"]["order"]["existing"] = {}

  body3["input"]["inputs"]["templates"][0]["inputs"]["order"]["existing"]["x6i_instadddnces"] = true
  body3["input"]["inputs"]["templates"][0]["inputs"]["order"]["existing"]["x6i_instances"] = true


  body3["input"]["mixins"] = []

  inputinfo = body3

  const response = await axios.post(url, body3, config)
  console.log(response.data)
  return response.data
}

async function sendRequest_gcp(body) {
  const url = 'https://api.co2.lve.splunkcloud.systems/v3/translation/translate-order/stack'
  const token = () => fs.readFileSync(require.resolve("~/.cloudctl/token_prod"), { encoding: "utf8" });
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    }
  }
  const values = body.view.state.values;
  let stack_name = values.stack_name.stackname_input.value;
  inputinfo += "Stack Name: " + stack_name + "\n";
  let cloud_provider = userInputData.get("cloud_provider")
  inputinfo += "Cloud Provider: " + cloud_provider + "\n";

  let region = values.region.region_input.selected_option.value;
  inputinfo += "Region: " + region + "\n";

  let all_existings = userInputData.get("existing_checkbox") || [];

  let all_details = userInputData.get("details") || [];
  inputinfo += "Details: " + all_details + "\n";
  let details_netnew = all_details.includes("net_new")
  let details_ridm = all_details.includes("idm")
  let details_encrption = all_details.includes("encryption")

  let details_poc = userInputData.get("poc_checkbox") || [];
  let existing_idm = all_existings.includes("idm")
  console.log("0000000" + details_poc.length)
  if (details_poc != undefined && details_poc.length != 0) {

    details_poc = true
  } else {
    details_poc = false
  }

  let entitlements = userInputData.get("entitlements")
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
  if (entitlements == "Ingest") {
    let cloud_num = Number(values.cloud_number.cloud_num_input.value);
    let es_num = Number(values.es_number.es_num_input.value);
    let itsi_num = Number(values.itsi_number.itsi_num_input.value);
    let pci_num = Number(values.pci_number.pci_num_input.value);
    let vmware_num = Number(values.vmware_number.vmware_num_input.value);
    let exchange_num = Number(values.exchange_number.exchange_num_input.value);
    body3["input"]["templates"][0]["inputs"]["order"]["ingest"] = {}
    body3["input"]["templates"][0]["inputs"]["order"]["ingest"]["cloud"] = cloud_num
    body3["input"]["templates"][0]["inputs"]["order"]["ingest"]["es"] = es_num
    body3["input"]["templates"][0]["inputs"]["order"]["ingest"]["itsi"] = itsi_num
    body3["input"]["templates"][0]["inputs"]["order"]["ingest"]["pci"] = pci_num
    body3["input"]["templates"][0]["inputs"]["order"]["ingest"]["vmware"] = vmware_num
    body3["input"]["templates"][0]["inputs"]["order"]["ingest"]["exchange"] = exchange_num


  } else {
    let it_cloud_num = Number(values.it_cloud_foundations.it_cloud_foundations_input.value);
    let security_cloud_num = Number(values.security_cloud_foundations.security_cloud_foundations_input.value);
    let splunk_cloud_platform_num = Number(values.splunk_cloud_platform.splunk_cloud_platform_input.value)
    let all_apps = userInputData.get("apps_checkbox") || []
    let apps_es = all_apps.includes("es")
    let apps_itsi = all_apps.includes("itsi")
    let apps_pci = all_apps.includes("pci")
    let apps_vmware = all_apps.includes("vmware")
    let apps_exchange = all_apps.includes("exchange")
    body3["input"]["templates"][0]["inputs"]["order"]["svcs"] = {}
    body3["input"]["templates"][0]["inputs"]["order"]["svcs"]["it_cloud_foundations"] = it_cloud_num
    body3["input"]["templates"][0]["inputs"]["order"]["svcs"]["security_cloud_foundations"] = security_cloud_num
    body3["input"]["templates"][0]["inputs"]["order"]["svcs"]["splunk_cloud_platform"] = splunk_cloud_platform_num
    body3["input"]["templates"][0]["inputs"]["order"]["svcs"]["products"] = {}
    body3["input"]["templates"][0]["inputs"]["order"]["svcs"]["products"]["es"] = apps_es
    body3["input"]["templates"][0]["inputs"]["order"]["svcs"]["products"]["itsi"] = apps_itsi
    body3["input"]["templates"][0]["inputs"]["order"]["svcs"]["products"]["pci"] = apps_pci
    body3["input"]["templates"][0]["inputs"]["order"]["svcs"]["products"]["vmware"] = apps_vmware
    body3["input"]["templates"][0]["inputs"]["order"]["svcs"]["products"]["exchange"] = apps_exchange

  }
  body3["input"]["mixins"] = []


  inputinfo = body3

  console.log(JSON.stringify(body3))
  console.log(body3["input"]["templates"])
  console.log(body3["input"]["templates"][0]["inputs"]["order"])

  const response = await axios.post(url, body3, config)
  console.log(response.data)
  return response.data
}

async function sendRequest_fedramp(body) {
  const url = 'https://api.co2.lve.splunkcloud.systems/v3/translation/translate-order/stack'

  const token = () => fs.readFileSync(require.resolve("~/.cloudctl/token_prod"), { encoding: "utf8" });
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token

    }
  }
  const values = body.view.state.values;
  let stack_name = values.stack_name.stackname_input.value;
  inputinfo += "Stack Name: " + stack_name + "\n";
  let cloud_provider = userInputData.get("cloud_provider")
  inputinfo += "Cloud Provider: " + cloud_provider + "\n";
  let region = values.region.region_input.selected_option.value;
  inputinfo += "Region: " + region + "\n";

  let all_details = userInputData.get("details") || [];
  let all_existings = userInputData.get("existing_checkbox") || [];
  inputinfo += "Details: " + all_details + "\n";
  let details_netnew = all_details.includes("net_new")
  let details_ridm = all_details.includes("idm")
  let details_encrption = all_details.includes("encryption")
  let existing_idm = all_existings.includes("idm")
  let existing_x6i = all_existings.includes("x6i")
  let details_poc = userInputData.get("poc_checkbox") || '';

  if (details_poc != '') {
    details_poc = true
  } else {
    details_poc = false
  }
  let entitlements = userInputData.get("entitlements")
  let fedramp_type = values.fedramp_type.fedramp_type_input.selected_option.value;
  let customer_classification = values.customer_classification.customer_classification_input.selected_option.value;


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
  body3["input"]["templates"][0]["inputs"]["order"]["autobahn_lane"] = ""
  body3["input"]["templates"][0]["inputs"]["order"]["fedramp_type"] = fedramp_type
  body3["input"]["templates"][0]["inputs"]["order"]["customer_classification"] = customer_classification

  body3["input"]["templates"][0]["inputs"]["order"]["existing"] = {}

  body3["input"]["templates"][0]["inputs"]["order"]["existing"]["noah"] = false
  body3["input"]["templates"][0]["inputs"]["order"]["existing"]["idm"] = existing_idm
  body3["input"]["templates"][0]["inputs"]["order"]["existing"]["im4gn_indexers"] = false
  body3["input"]["templates"][0]["inputs"]["order"]["existing"]["i3en_indexers"] = false
  body3["input"]["templates"][0]["inputs"]["order"]["existing"]["x6i_instances"] = existing_x6i
  if (entitlements == "Ingest") {
    let cloud_num = Number(values.cloud_number.cloud_num_input.value);
    let es_num = Number(values.es_number.es_num_input.value);
    let itsi_num = Number(values.itsi_number.itsi_num_input.value);
    let pci_num = Number(values.pci_number.pci_num_input.value);
    let vmware_num = Number(values.vmware_number.vmware_num_input.value);
    let exchange_num = Number(values.exchange_number.exchange_num_input.value);

    body3["input"]["templates"][0]["inputs"]["order"]["ingest"] = {}
    body3["input"]["templates"][0]["inputs"]["order"]["ingest"]["cloud"] = cloud_num
    body3["input"]["templates"][0]["inputs"]["order"]["ingest"]["es"] = es_num
    body3["input"]["templates"][0]["inputs"]["order"]["ingest"]["itsi"] = itsi_num
    body3["input"]["templates"][0]["inputs"]["order"]["ingest"]["pci"] = pci_num
    body3["input"]["templates"][0]["inputs"]["order"]["ingest"]["vmware"] = vmware_num
    body3["input"]["templates"][0]["inputs"]["order"]["ingest"]["exchange"] = exchange_num

  } else {
    let it_cloud_num = Number(values.it_cloud_foundations.it_cloud_foundations_input.value);
    let security_cloud_num = Number(values.security_cloud_foundations.security_cloud_foundations_input.value);
    let splunk_cloud_platform_num = Number(values.splunk_cloud_platform.splunk_cloud_platform_input.value)
    let all_apps = userInputData.get("apps_checkbox") || []
    let apps_es = all_apps.includes("es")
    let apps_itsi = all_apps.includes("itsi")
    let apps_pci = all_apps.includes("pci")
    let apps_vmware = all_apps.includes("vmware")
    let apps_exchange = all_apps.includes("exchange")
    body3["input"]["templates"][0]["inputs"]["order"]["svcs"] = {}
    body3["input"]["templates"][0]["inputs"]["order"]["svcs"]["it_cloud_foundations"] = it_cloud_num
    body3["input"]["templates"][0]["inputs"]["order"]["svcs"]["security_cloud_foundations"] = security_cloud_num
    body3["input"]["templates"][0]["inputs"]["order"]["svcs"]["splunk_cloud_platform"] = splunk_cloud_platform_num
    body3["input"]["templates"][0]["inputs"]["order"]["svcs"]["products"] = {}
    body3["input"]["templates"][0]["inputs"]["order"]["svcs"]["products"]["es"] = apps_es
    body3["input"]["templates"][0]["inputs"]["order"]["svcs"]["products"]["itsi"] = apps_itsi
    body3["input"]["templates"][0]["inputs"]["order"]["svcs"]["products"]["pci"] = apps_pci
    body3["input"]["templates"][0]["inputs"]["order"]["svcs"]["products"]["vmware"] = apps_vmware
    body3["input"]["templates"][0]["inputs"]["order"]["svcs"]["products"]["exchange"] = apps_exchange

  }
  body3["input"]["mixins"] = []

  inputinfo = body3


  console.log(JSON.stringify(body3))
  console.log(body3["input"]["templates"])
  console.log(body3["input"]["templates"][0]["inputs"]["order"])





  const response = await axios.post(url, body3, config)
  console.log(response.data)
  return response.data
}
app.action('poc_checkbox', async ({ ack, body, client }) => {
  try {
    await ack();
    const selectedValues = body.actions[0].selected_options.map((option) => option.value);
    userInputData.set('poc_checkbox', selectedValues);
    console.log('Selected values of checkboxes:', selectedValues);

  } catch (error) {
    console.error('Error handling checkbox selection:', error);
  }
});

app.action('gen_checkbox', async ({ ack, body, client }) => {
  try {
    await ack();
    const selectedValues = body.actions[0].selected_options.map((option) => option.value);
    userInputData.set('gen_checkbox', selectedValues);
    console.log('Selected values of checkboxes:', selectedValues);

  } catch (error) {
    console.error('Error handling checkbox selection:', error);
  }
});
app.action('existing_checkbox', async ({ ack, body, client }) => {
  try {
    await ack();
    const selectedValues = body.actions[0].selected_options.map((option) => option.value);
    userInputData.set('existing_checkbox', selectedValues);
    console.log('Selected values of existing checkboxes:', selectedValues);

  } catch (error) {
    console.error('Error handling checkbox selection:', error);
  }
});

app.action('apps_checkbox', async ({ ack, body, client }) => {
  try {
    await ack();
    const selectedValues = body.actions[0].selected_options.map((option) => option.value);
    userInputData.set('apps_checkbox', selectedValues);
    console.log('Selected values of app checkboxes:', selectedValues);

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
    let updatedBlocks = helper.updateModalView_netnew(body);
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

      await app.client.views.update({
        trigger_id: body.trigger_id,
        response_action: "update",
        view_id: body.view.id,

        view: updatedView,
      });
    }




  } catch (error) {
    console.error('Error handling checkbox selection:', error);
  }
});





//update modal
app.view('p2splunk-submit', async ({ ack, body, view, client }) => {
  // Acknowledge the action
  await ack();
  const user = body['user']['id'];

  let cloud_provider = userInputData.get("cloud_provider")
  let response = ""
  let cmd = userInputData.get("cmd")
  if (cmd == "stack") {
    console.log("cloud provider is : " + cloud_provider)
    if (cloud_provider == "aws") {
      response = await sendRequest_aws(body);
    } else if (cloud_provider == "gcp") {
      response = await sendRequest_gcp(body);
    } else if (cloud_provider == "fedramp") {
      response = await sendRequest_fedramp(body);
    }
  } else if (cmd == "soar") {
    response = await sendRequest_soar(body);
  }

  console.log("======"+JSON.stringify(response));


  console.log(typeof response)
  let data = JSON.parse(JSON.stringify(response));

  const spec = data.resource.spec;

  // Create the output object with "name" property added to "spec"
  let filtered_res = { spec: { ...spec }, name: data.resource.name };
  console.log(userInputData)
  let inputIntro = "******* The input info you provided at time: " + helper.getCurrentTime() + " is: *******\n"
  if (cmd == "soar") {
    filtered_res = response
  }
  try {
    await client.chat.postMessage({
      channel: user,
      text: inputIntro + "```" + JSON.stringify(inputinfo, undefined, 4) + "```" + "\n" + "**********Your output is: **********\n" + "```" + JSON.stringify(filtered_res, undefined, 4) + "```" + "\n",

    });
  }
  catch (error) {
    console.error(error);
  }

});




(async () => {
  // Start your app
  //await app.start(process.env.PORT || 3000);
  await app.start(3000);

  console.log('⚡️ Bolt app is running!');
})();





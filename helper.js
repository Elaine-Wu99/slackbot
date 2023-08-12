const axios = require('axios');
const fs = require('fs')
const userInputData = new Map();
function updateModalView_gcp(body, selectedOption) {
    let cloud_provider = userInputData.get("cloud_provider")
    const view = body.view;
    const blockIndex = body.view.blocks.findIndex((block) => block.block_id === "cloud_provider");
    if (blockIndex !== -1) {
      view.blocks.splice(blockIndex+1);
    }
    let updatedBlocks = view.blocks
    updatedBlocks.push(
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
        //   initial_option: {
        //     text: {
        //       type: "plain_text",
        //       text: "us-central-1 (lowa)",
        //       emoji: true
        //     },
        //     value: "us-central1"
        //   },
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
      },{
        "type": "actions",
        "block_id":"details",
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
        "block_id":"exisiting",
        "text": {
          "type": "plain_text",
          "text": "Existing",
          "emoji": true,
  
        }
      }, {
        "type": "actions",
        "block_id":"exisiting_checkboxes",
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
      }
    );
    return updatedBlocks
    // Create a new view object or modify the existing one based on the selected option
  
  }

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


  function updateModalView_aws(body, selectedOption) {
    let cloud_provider = userInputData.get("cloud_provider")
    // Create a new view object or modify the existing one based on the selected option
    const view = body.view;
    const blockIndex = body.view.blocks.findIndex((block) => block.block_id === "cloud_provider");
    if (blockIndex !== -1) {
      view.blocks.splice(blockIndex+1); // +1 to keep the "block_21" as well
      console.log("block Index is: " + blockIndex)
    }
    console.log("-------"+view.blocks)
    let updatedBlocks = view.blocks
    console.log("updatedBlocks are: "+updatedBlocks)
    updatedBlocks.push(
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
        //   initial_option: {
        //     text: {
        //       type: "plain_text",
        //       text: "us-east-1 (N. Virginia)",
        //       emoji: true
        //     },
        //     value: "us-east-1"
        //   },
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
        "block_id": "exisiting",
        "text": {
          "type": "plain_text",
          "text": "Existing",
          "emoji": true,
  
        }
      },
      {
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
      }
    )
    return updatedBlocks
  }


  function updateModalView_fedramp(body, selectedOption) {
    let cloud_provider = userInputData.get("cloud_provider")
    const view = body.view;
    const blockIndex = body.view.blocks.findIndex((block) => block.block_id === "cloud_provider");
    if (blockIndex !== -1) {
      view.blocks.splice(blockIndex+1); // +1 to keep the "block_21" as well
    }
    console.log(blockIndex)
    console.log(view.blocks[2])
    //blocks.slice(0, startIndex + 1);
    let updatedBlocks = view.blocks.slice(0,blockIndex+1)
    updatedBlocks.push(
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
        //   initial_option: {
        //     text: {
        //       type: "plain_text",
        //       text: "us-gov-west-1(US West)",
        //       emoji: true
        //     },
        //     value: "us-gov-west-1"
        //   },
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
              value: "High"
            },
            {
              text: {
                type: "plain_text",
                text: "Moderate",
                emoji: true
              },
              value: "Moderate"
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
            value: "High"
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
        "type": "section",
        "text": {
          "type": "plain_text",
          "text": "Details",
          "emoji": true,
  
        }
      },{
        "type": "actions",
        "block_id":"details",
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
        "block_id":"exisiting",
        "text": {
          "type": "plain_text",
          "text": "Existing",
          "emoji": true,
  
        }
      }, {
        "type": "actions",
        "block_id":"exisiting_checkboxes",
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
      }
    );
    return updatedBlocks
    // Create a new view object or modify the existing one based on the selected option
    
  }


  function getCurrentTime() {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }


  function updateModalView_netnew(body) {
    try {
      const view = body.view;
      const blocksToRemoveIds = ["exisiting", "exisiting_checkboxes"];
      const filteredBlocks = body.view.blocks.filter((block) => !blocksToRemoveIds.includes(block.block_id));
      return filteredBlocks
    }catch (error) {
      console.error('Error handling checkbox selection:', error);
    }
  }
  
  module.exports ={ updateModalView_gcp, userInputData,updateModalView_scvs,updateModalView_aws,
    updateModalView_fedramp, getCurrentTime, updateModalView_netnew}
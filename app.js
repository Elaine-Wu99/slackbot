const { App } = require('@slack/bolt');

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


app.message('submit', async ({ message, say }) => {
  // say() sends a message to the channel where the event was triggered
  await say({
   "blocks" : [
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
app.action('submit_click', async({body, ack, say}) => {
  await ack();
  let submit = body.actions[0].value;
  await say(`<@${body.user.id}> selected ${submit}`);
})


//get the input value from "submit_input" in text
app.action('submit_input', async({body, ack, say}) => {
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

app.message('P2Bot', async({message, say}) => {
  await say ({
    "blocks":[
      {
        "type": "input",
        "element": {
          "type": "plain_text_input",
          "action_id": "plain_text_input-action"
        },
        "label": {
          "type": "plain_text",
          "text": "Stack Name",
          "emoji": true
        }
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "Region"
        },
        "accessory": {
          "type": "static_select",
          "placeholder": {
            "type": "plain_text",
            "text": "Select a region",
            "emoji": true
          },
          "options": [
            {
              "text": {
                "type": "plain_text",
                "text": "us-east1",
                "emoji": true
              },
              "value": "value-0"
            },
            {
              "text": {
                "type": "plain_text",
                "text": "us-west2",
                "emoji": true
              },
              "value": "value-1"
            },
            {
              "text": {
                "type": "plain_text",
                "text": "ca-central-1",
                "emoji": true
              },
              "value": "value-2"
            }
          ],
          "action_id": "select_region-action"
        }
      },
      
      {
        "type": "section",
			  "text": {
				  "type": "mrkdwn",
				  "text": "Cloud Provider"
			  },
        "accessory": {
          "type": "radio_buttons",
          "options": [
            {
              "text": {
                "type": "plain_text",
                "text": "AWS",
                "emoji": true
              },
              "value": "value-0"
            },
            {
              "text": {
                "type": "plain_text",
                "text": "GCP",
                "emoji": true
              },
              "value": "value-1"
            },
            {
              "text": {
                "type": "plain_text",
                "text": "FedRamp",
                "emoji": true
              },
              "value": "value-2"
            }
          ],
          "action_id": "cloudprovider-action"
        }
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "Details"
        },
        "accessory": {
          "type": "checkboxes",
          "options": [
            {
              "text": {
                "type": "mrkdwn",
                "text": "New New *" 


              },
    

              "value": "value-0"
            },
            {
              "text": {
                "type": "mrkdwn",
                "text": "Requesting IDM"
              },
             
              "value": "value-1"
            },
            {
              "text": {
                "type": "mrkdwn",
                "text": "HIPAA/PCI"
              },
              
              "value": "value-2"
            },
            {
              "text": {
                "type": "mrkdwn",
                "text": "DDAA"
              },
             
              "value": "value-3"
            },
            {
              "text": {
                "type": "mrkdwn",
                "text": "Encryption"
              },
              
              "value": "value-4"
            }
          ],
          "action_id": "details-action"
        }
      },
      {
        "type": "section",
        "text": {
				  "type": "mrkdwn",
				  "text": "POC"
			  },
        "accessory": {
          "type": "checkboxes",
          "options": [
            {
              "text": {
                "type": "mrkdwn",
                "text": "POC" 


              },
  
              "value": "value-0"
            },
          ]
        }
      }
    ]
  })
})

//get the input value from "details-action" checkboxes action, only in text, split all selections by space
app.action('details-action', async({body, ack, say}) => {
  await ack();
  let details = body.actions[0].selected_options.map((option) => option.value).join(' ');
  await say(`<@${body.user.id}> selected ${details}`);
})


app.message('Menu', async({message, say}) => {
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
app.action('users_select-action', async({body, ack, say}) => {
  await ack();
  await say(`<@${body.user.id}> selected <@${body.actions[0].selected_user}>`);
  //await say(`<@${body.user.id}> selected <@${body.actions[0].selected_user}>`);
  
})


//get the input value from "cloudprovider-action" action, only in text
app.action('cloudprovider-action', async({body, ack, say}) => {
  await ack();
  await say(`<@${body.user.id}> selected ${body.actions[0].selected_option.text.text}`);
})

app.message('精神小妹', async ({ message, say }) => {
  // say() sends a message to the channel where the event was triggered
  await say({
    text: `:pleading_face::pleading_face::pleading_face::pleading_face::pleading_face::pleading_face:`
  });
});
app.action('button_click', async ({ body, ack, say }) => {
  // Acknowledge the action
  await ack();
  await say(`<@${body.user.id}> clicked the button`);
  
});



app.command('/courseupdate', async ({ command, ack, body, client }) => {
  // Acknowledge the command request
  await ack();

  try {
    // Call views.open with the built-in client
    const result = await client.views.open({
      // Pass a valid trigger_id within 3 seconds of receiving it
      trigger_id: body.trigger_id,
      // View payload
      view: {
        type: 'modal',
        // View identifier
        callback_id: 'course-submit',
        title: {
          type: 'plain_text',
          text: 'Course Update'
        },
        blocks: [{
            type: "input",
            block_id: 'course_selection',
            element: {
              type: "static_select",
              placeholder: {
                type: "plain_text",
                text: "Select your course",
                emoji: true
              },
              options: [
                {
                  text: {
                    type: "plain_text",
                    text: "ICC Global Leadership",
                    emoji: true
                  },
                  value: "icc-global-leadership"//9
                },
                {
                  text: {
                    type: "plain_text",
                    text: "Japanese Ethnography",
                    emoji: true
                  },
                  value: "japanese-ethnography-as-a-window-to-japanese-language-and-society"//10
                },
                 {
                  text: {
                    type: "plain_text",
                    text: "Japanese Introduction to Japanese Pedagogy",
                    emoji: true
                  },
                  value: "japanese-introduction-to-japanese-pedagogy"//11
                },
                {
                  text: {
                    type: "plain_text",
                    text: "Program Management",
                    emoji: true
                  },
                  value: "program-management"//12
                },
                {
                  text: {
                    type: "plain_text",
                    text: "Software Internationalization and Localization",
                    emoji: true
                  },
                  value: "software-internationalization-and-localization"//13
                }
              ],
              action_id: "course_input"
            },
            label: {
              type: "plain_text",
              text: "Course selection",
              emoji: true
            }
          },
          {
            type: 'input',
            block_id: 'good_stuff',
            optional: true,
            label: {
              type: 'plain_text',
              text: 'What is going well this week?'
            },
            element: {
              type: 'plain_text_input',
              action_id: 'good_input',
              multiline: true,
            }
          },{
            type: 'input',
            block_id: 'flag_stuff',
            optional: true,
            label: {
              type: 'plain_text',
              text: 'Yellow or red flags this week?'
            },
            element: {
              type: 'plain_text_input',
              action_id: 'flag_input',
              multiline: true
            }
          },{
            type: 'input',
            block_id: 'other_stuff',
            optional: true,
            label: {
              type: 'plain_text',
              text: 'Anything else to share?'
            },
            element: {
              type: 'plain_text_input',
              action_id: 'other_input',
              multiline: true
            }
          }
        ],
        submit: {
          type: 'plain_text',
          text: 'Submit',
        }
      }
    });
    //console.log(JSON.stringify(result));
  }
  catch (error) {
    console.error(error);
  }
});
//update modal
app.view('course-submit', async ({ ack, body, view, client }) => {
  // Acknowledge the action
    await ack();
    console.log(JSON.stringify(body));//see the data getting passed
    let msg = '';

    const user = body['user']['id'];
    const results = await createWpUpdate(body['user']['username'],body);

    if (results){
      msg = 'Your update was successful.'
    } else {
      msg = 'I am a failure but I do not know why.'
    }

    //message the user 

    try {
      await client.chat.postMessage({
        channel: user,
        text: msg
      });
    }
    catch (error){
      console.error(error);
    }
 
});

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  console.log('⚡️ Bolt app is running!');
})();


function createWpUpdate(slackuser, body){

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
      tags: [ courseId ],
      // Post will be created as a draft by default if a specific "status"
      // is not specified
      status: 'publish'
  }).then(function( response ) {
      // "response" will hold all properties of your newly-created post,
      // including the unique `id` the post was assigned on creation
      //console.log( response.id );
  })
  return true;
}


function courseTagToID(course){
  let courses = {
    'icc-global-leadership': 9,
    'japanese-ethnography-as-a-window-to-japanese-language-and-society': 10,
    'japanese-introduction-to-japanese-pedagogy': 11,
    'program-management': 12,
    'software-internationalization-and-localization': 13,
  };
  if (courses[course]){
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


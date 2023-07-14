const axios = require('axios');
//const fs = require('fs')



//generete this as body: {"input": {"name": "sampleco", "inputs": {"customerType": "Dev", "region": "us-east-1"}}}, after generate the body, send js request to  http://localhost:8443/v3/translation/translate-order/stack using axios

async function sendRequest() {
    const url = 'http://localhost:8443/v3/translation/translate-order/stack'
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const body2 = {}
    body2["input"] = {}
    body2["input"]["name"] = sampleco
    body2["input"]["inputs"] = {}
    body2["input"]["inputs"]["customerType"] = Dev
    body2["input"]["inputs"]["region"] = us-east-1

    //how to fix the issue:Identifier 'body' has already been declared
    //https://stackoverflow.com/questions/40858942/identifier-has-already-been-declared
    const response = await axios.post(url, body2, config)
    console.log(response.data)
    return response.data
}
//why i got the response:  An unhandled error occurred while Bolt processed (type: view_submission, error: Error: helper.sendRequest is not a function)
//https://stackoverflow.com/questions/40858942/identifier-has-already-been-declared
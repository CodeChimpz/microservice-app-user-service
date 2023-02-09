import {app} from "./app.js";
import {config} from "dotenv";
import {ApiObjectT, GatewayCommunicator} from "service-to-server";

config()
const {
    GATEWAY_URL,
    SERVICE_NAME,
    API_KEY,
    PORT,
    ORIGIN
} = process.env

//define endpoints in Gateway-service accessible form
const endpointObject = {
    '/user/get': 'user.get',
    '/user/post': 'user.post'
}
const gateway = new GatewayCommunicator({
    url: <string>GATEWAY_URL,
    refer: <string>SERVICE_NAME,
    api_key: <string>API_KEY,
    endpoints: endpointObject,
    origin: ORIGIN
})
await gateway.sync()

app.listen(PORT, () => {
    console.log("Listening on " + PORT)
})
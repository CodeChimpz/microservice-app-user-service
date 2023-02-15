import {app} from "./app.js";
import {config} from "dotenv";
import {ServiceRegistry} from "mein-etcd-service-registry";

config()
const {
    GATEWAY_URL,
    SERVICE_NAME,
    SERVICE_URL,
    PORT,
    ETCD_HOST
} = process.env

//define endpoints in Gateway-service accessible form
const endpointObject = {
    'user.get': 'user/get',
    'user.post': 'user/post'
}
//Put data to ServiceRegistry
const registry = new ServiceRegistry({
    // auth: {
    //     username: '',
    //     password: ''
    // },
    hosts: String(ETCD_HOST)
})

await registry.startService({
    serviceUrl: String(SERVICE_URL),
    refer: String(SERVICE_NAME),
    endpoints: endpointObject
})

app.listen(PORT, () => {
    console.log("Listening on " + PORT)
})
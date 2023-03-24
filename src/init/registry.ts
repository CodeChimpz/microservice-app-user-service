import {EtcdRegistry, HttpCommunication} from "mein-etcd-service-registry";
import {config} from "dotenv";

config()
const {
    ETCD_HOST,
    SERVICE_NAME,
    SERVICE_URL,
    SELF_KEY
} = process.env

//define endpoints in Gateway-service accessible form
const endpointObject = {
    public: {
        'auth.register.start': '/auth/start',
        'auth.register.proceed': '/auth/proceed',
        'auth.register.finish': '/auth/finish',
        'auth.login':'/auth/login'
    }
}

export const registry = new EtcdRegistry.ServiceRegistry({
    // auth: {
    //     username: '',
    //     password: ''
    // },
    hosts: String(ETCD_HOST)
}, {
    serviceUrl: String(SERVICE_URL),
    refer: String(SERVICE_NAME),
    endpoints: endpointObject
})
export const sidecar = new HttpCommunication.Sidecar(registry, String(SELF_KEY))
export const committer = new HttpCommunication.TransactionSync(sidecar)

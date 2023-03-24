import {app} from "./app.js";
import {config} from "dotenv";
import {registry} from "./init/registry.js";
import {registerJobs} from "./jobs/scheduler.js";
import {jobs} from "./jobs/jobs.js";

config()
const {
    SERVICE_NAME,
    SERVICE_URL,
    PORT,
} = process.env

await registry.init()
//schedule regular jobs
registerJobs(jobs)
app.listen(PORT, () => {
    console.log("Listening on " + PORT)
})
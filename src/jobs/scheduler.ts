import {schedule} from "node-cron";
import {logger} from "../init/logger.js";

type TPeriod = {
    sec?: number,
    min?: number,
    hour?: number,
    day_month?: number,
    day_week?: string,
    month?: number,
    year?: number
}
export type TJob = {
    name: string,
    period: TPeriod,
    action: any
}

export function registerJobs(jobs: TJob[]) {
    jobs.forEach(job => {
        const period = job.period
        const expression = `${period.sec || '*'} ${period.min || '*'} ${period.hour || '*'} ${period.day_month || '*'} ${period.month || '*'} ${period.year || '*'}`
        schedule(expression, () => {
            logger.app.info('Running job', job.name)
            job.action
        })
    })
}
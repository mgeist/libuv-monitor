const crypto = require("node:crypto")

const libuv_monitor = require('./index')

if (!libuv_monitor.isActive()) {
    throw new Error("Unexpected unsupported platform")
}

libuv_monitor.hi();

const JOBS = 100
const CHECKPOINT = JOBS / 4
var next_checkpoint = JOBS - CHECKPOINT

console.log("Starting..")
const start = process.hrtime.bigint()

for (let i = 0; i < JOBS; i++) {
    crypto.scrypt('the quick brown fox jumps over the lazy dog', 'salt', 64, (err, ) => {
        if (err) throw err;
    })
}

if (libuv_monitor.getActiveReqs() !== JOBS)  {
    throw new Error('Incorrect number of active reqs')
}

console.log("Kicked off all jobs. #:", libuv_monitor.getActiveReqs())

const check = () => {
    const activeReqs = libuv_monitor.getActiveReqs()

    if (activeReqs <= next_checkpoint) {
        console.log("Queue size:", activeReqs)
        next_checkpoint -= CHECKPOINT
    }

    if (activeReqs == 0) {
        console.log("Done. Took:", (process.hrtime.bigint() - start) / BigInt(1e6), "milliseconds")
    } else {
        setTimeout(() => check())
    }
}

check()


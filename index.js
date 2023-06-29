const fs = require("node:fs")
const path = require("node:path")

const supportedPlatforms = [
    'darwin-arm64',
    'darwin-x64',
    'linux-arm64',
    'linux-x64'
]

function platformSupported() {
    return supportedPlatforms.includes(getTargetString())
}

function getTargetString() {
    return `${process.platform}-${process.arch}`
}

function getPackageName(target) {
    return `libuv-monitor-${target}`
}

function devBinary() {
    return path.join(__dirname, 'libuv-monitor.node')
}

function localBinary(target) {
    return path.join(__dirname, `npm/${target}/libuv-monitor.${target}.node`)
}

function hasDevBinary() {
    return fs.existsSync(devBinary())
}

function hasLocalBinary(target) {
    return fs.existsSync(localBinary(target))
}

let target = getTargetString()

// Export the native functions if the platform is supported, otherwise, export stub
// functions to allow usage within applications that run on a wider variety of platforms
// than this library supports without crashing.
if (platformSupported()) {
    let nativeBinding = null

    if (hasDevBinary()) {
        nativeBinding = require(devBinary())
    } else if (hasLocalBinary(target)) {
        nativeBinding = require(localBinary(target))
    } else {
        nativeBinding = require(`@mgeist/${getPackageName(target)}`)
    }

    if (!nativeBinding) {
        throw new Error("Failed to load binary")
    }

    module.exports.hi = nativeBinding.hi
    module.exports.getActiveReqs = nativeBinding.getActiveReqs
} else {
    module.exports.hi = () => {}
    module.exports.getActiveReqs = () => 0
}

module.exports.isActive = platformSupported

const fs = require("node:fs")
const path = require("node:path")


const unsupportedError = new Error("Unsupported system")

function getTargetString() {
    let os = null
    let arch = null

    switch (process.platform) {
        case 'darwin':
            os = 'darwin'
            break
        case 'linux':
            os = 'linux'
            break
    }

    switch (process.arch) {
        case 'x64':
            arch = 'x64'
            break
        case 'arm64':
            arch = 'arm64'
            break
    }

    if (os == null || arch == null) {
        throw unsupportedError
    }

    return `${os}-${arch}`

}

function getPackage(target) {
    return `libuv-monitor-${target}`
}

function getBinary(target) {
    return `libuv-monitor.${target}.node`
}

function devBinary() {
    return path.join(__dirname, 'libuv-monitor.node')
}

function localPath(target) {
    return path.join(__dirname, `npm/${target}/${getBinary(target)}`)
}

function hasDevBinary() {
    return fs.existsSync(devBinary())
}
function hasLocalBinary(target) {
    return fs.existsSync(localPath(target))
}

let target = getTargetString()

let nativeBinding = null

if (hasDevBinary()) {
    nativeBinding = require(devBinary())
} else if (hasLocalBinary(target)) {
    nativeBinding = require(localPath(target))
} else {
    nativeBinding = require(`@mgeist/${getPackage(package)}`)
}

if (!nativeBinding) {
    throw new Error("Failed to load binary")
}

module.exports.hi = nativeBinding.hi
module.exports.getActiveReqs = nativeBinding.getActiveReqs

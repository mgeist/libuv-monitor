# libuv-monitor

A simple utility to allow NodeJS applications to get some better insight into their usage of the internal libuv thread pool.

Because this is a pre-compiled Node-API binary, there are platforms that this will not work on. Right now, the supported platforms are:

- darwin-arm64
- darwin-x64
- linux-arm64
- linux-x64

If this package is used on an unsupported platforms, the functions are stubbed out so it doesn't crash. You can check the `isActive()` function to verify if the package is working correctly.

Example usage:

```javascript
const libuv_monitor = require('libuv-monitor')

libuv_monitor.isActive()

libuv_monitor.activeReqs()
```

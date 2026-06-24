import { http, HttpResponse } from 'msw'
import { setupWorker } from 'msw/browser'

export const handlers = [
    http.get('/api/v1/system-info', () => {
        return HttpResponse.json({
            kernelVersion: "6.18.34+rpt-rpi-2712",
            uptime: "40h18m57.45s",
            cpuByteOrder: "little",
            boardModel: "Raspberry Pi 5 Model B Rev 1.1",
            boardSerial: "9dc98f6d8a85114f",
            osRelease: "Debian GNU/Linux 13 (trixie)"
        })
    }),
]

export const worker = setupWorker(...handlers)
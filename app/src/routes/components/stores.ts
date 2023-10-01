import { writable } from 'svelte/store'

export const log = writable([''])
export const terminalLines = writable(["Terminal <c> NanguRepo 2023"])
export const config = writable({
    fontsize: "20px",
    textcolor: "#FFFFFF"
})
export default (input: string[]) => {
    let style: string = ''
    if (input.includes("(CSS)")) {
        style = input.join(" ").split("(CSS)")[1]
        input = input.join(" ").split("(CSS)")[0].split(" ")
    }
    return [{text: input.join(" "), style: style}];
}
export const description = "print a string to the terminal."
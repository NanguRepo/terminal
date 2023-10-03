export default (input: string[]) => {
    let style: string = ''
    if ("(CSS)" in input) {
        return [{text: 'CSS detected', style: ''}]
        style = input.join(" ").split("(CSS)")[1]
    }
    return [{text: input.join(" "), style: style}];
}
export const description = "print a string to the terminal."
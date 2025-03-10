export default function Enum(...args) {
    let obj = {}

    for(let arg of args) {
        if (Array.isArray(arg)){
            if (arg.length > 2)
                throw new Error("Args must not have more than two elements")
            let [key,value] = arg
            value = value ? value:key
            obj[key] = value
        }
        else {
            obj[arg] = arg       
        }
    }
    return Object.freeze(obj)
}
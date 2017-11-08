
export function grabValue(item) {

    let value = null;
    if(item.value != null) return item.value;
    
    if (item.valueDouble) {
        value = item.valueDouble
    }
    else if (item.valueInteger) {
        value = item.valueInteger
    }
    else if (item.valueLong) {
        value = item.valueLong
    }
    else if (item.valueDateTime) {
        value = item.valueDateTime
    }
    else if (item.valueDate) {
        value = item.valueDate
    }
    else if (item.valueString) {
        value = item.valueString
    }

    return value;
}

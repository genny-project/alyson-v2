
export function grabValue(item) {

    let value = null;
    if(item.value != null) return item.value;

    if (item.valueDouble) {
        value = item.valueDouble;
    }
    else if (item.valueInteger != null) {
        value = item.valueInteger;
    }
    else if (item.valueLong != null) {
        value = item.valueLong;
    }
    else if (item.valueDateTime) {
        value = item.valueDateTime;
    }
    else if (item.valueDate) {
        value = item.valueDate;
    }
    else if (item.valueString) {
        value = item.valueString;
    }
    else if(item.valueBoolean != null) {
        value = item.valueBoolean;
    }

    return value;
}


export function grabValue(item) {

    let value = null;
    if(item.value != null) return item.value;

    if (item.valueDouble != null) {
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
    else if(item.valueBoolean != null) {
        value = item.valueBoolean;
    }
    else if(item.valueMoney != null) {

        var formatter = new Intl.NumberFormat('en-AU', {
          style: 'currency',
          currency: item.valueMoney.currency,
          minimumFractionDigits: 2,
        });

        value = formatter.format(Number(item.valueMoney.amount));
    }
    else if (item.valueString != null) {
        value = item.valueString;
    }

    return value;
}

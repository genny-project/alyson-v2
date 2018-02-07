
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
    else if(item.valueBoolean) {
        value = item.valueBoolean;
    }
    else if(item.valueMoney != null) {

        var formatter = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: item.valueMoney.currency,
          minimumFractionDigits: 2,
        });

        value = formatter.format(item.valueMoney.amount);
    }

    return value;
}

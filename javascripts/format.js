function format(p1, p2, p3) {
    if (p1.exponent !== undefined) {
        let power = p1.exponent;
        let mantissa = p1.mantissa;
        if (Math.abs(p1) < 1000) {
            return p1.toFixed(p2);
        }
        else if (p1.exponent >= 3) {
            if ((mantissa > 9.99) && (mantissa !== 10)) {
                return (mantissa / 10).toFixed(2) + "e" + (power + 1);
            }
            else {
                return mantissa.toFixed(2) + "e" + power;
            }
        }
        else {
            /*let power = Math.floor(Math.log10(Math.abs(p1)));
            let mantissa = Math.abs(p1) / Math.pow(10, power);*/
            if ((mantissa > 9.99) && (mantissa !== 10)) {
                return "-" + (mantissa / 10).toFixed(2) + "e" + (power + 1);
            }
            else {
                return "-" + mantissa.toFixed(2) + "e" + power;
            }
        }
    }

    else if (p1.exponent === undefined) {
        if (Math.abs(p1) < 1000) {
            decimalPlace = p2 ?? 2;
            return p1.toFixed(decimalPlace);
        }
        else if (p1 >= 1000) {
            let power = Math.floor(Math.log10(p1));
            let mantissa = p1 / Math.pow(10, power);
            if ((mantissa > 9.99) && (mantissa !== 10)) {
                return (mantissa / 10).toFixed(2) + "e" + (power + 1);
            }
            else {
                return mantissa.toFixed(2) + "e" + power;
            }
        }
        else {
            let power = Math.floor(Math.log10(Math.abs(p1)));
            let mantissa = Math.abs(p1) / Math.pow(10, power);
            if ((mantissa > 9.99) && (mantissa !== 10)) {
                return "-" + (mantissa / 10).toFixed(2) + "e" + (power + 1);
            }
            else {
                return "-" + mantissa.toFixed(2) + "e" + power;
            }
        }
    }
}
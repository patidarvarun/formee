import { langs } from "../../../../config/localization";

/** Validation for minimum length */
export const minLength = min => value => {
    if (typeof value === "string") {
        value = value.trim()
    }
    return value && value.length < min ? `Min length must be ${min} digits.` : undefined;
}

/** Validation for minimum length */
export const globalMinLength = min => value => {
    if (typeof value === "string") {
        value = value.trim()
    }
    return value && value.length < min ? `Min length must be ${min} characters.` : undefined;
}

/** Validation for maximum length */
export const maxLength = max => value =>
    value && value.length > max ? `Max length must be ${max} digits.` : undefined;
/** Validation for maximum length */



export const maxLengthC = max => value =>
    value && value.length > max ? `Max length must be ${max} characters.` : undefined;

export const minLengthC = min => value => {
    if (typeof value === "string") {
        value = value.trim()
    }
    return value && value.length < min ? `Min length must be ${min} characters.` : undefined;
}

export const maxNumber = max => value =>
    value && value > max ? `Max value must be ${max} ` : undefined;

export const minNumber = min => value =>
    value === 0 && value < min ? `Min value must be ${min} ` : value && value < min ? `Min value must be ${min} ` : undefined;



/** All required length validation */
export const minLength1 = minLength(1);
export const minLength2 = minLength(2);
export const gminLength = globalMinLength(3)
export const minLength3 = minLength(3);
export const minLength4 = minLength(4);
export const minLength5 = minLength(5);
export const minLength6 = minLength(6);
export const minLength7 = minLength(7);
export const minLength10 = minLength(10);

export const maxLength5 = maxLength(5);
export const maxLength6 = maxLength(6);
export const maxLength7 = maxLength(7);
export const maxLength10 = maxLength(10);
export const maxLength11 = maxLength(11);
export const maxLength18 = maxLength(18);
export const maxLength15 = maxLength(15);
export const maxLength12 = maxLength(12);
export const maxLength25 = maxLength(25);
export const maxLength20 = maxLength(20);
export const maxLength26 = maxLength(25);
export const maxLength30 = maxLength(30);
export const maxLength45 = maxLength(45);
export const maxLength50 = maxLength(50);
export const maxLength70 = maxLength(71);
export const maxLength100 = maxLength(100);
export const maxLength200 = maxLength(200);
export const maxLength250 = maxLength(250);
export const maxLength500 = maxLength(500);
export const maxLength300 = maxLength(300);
export const maxLength1000 = maxLength(1000);
export const maxLength5000 = maxLength(5000);

export const maxLengthC100 = maxLengthC(100);
export const minLengthC3 = minLengthC(3);
export const minLengthC2 = minLengthC(2);

export const maxNumber100 = maxNumber(100);
export const minNumber1 = minNumber(1);


/** facebook link validation */
export const checkFacebooklink = value =>
    value && !/^(http|https):\/\/www.facebook.com\/.*/i.test(value)
        ? "Please enter valid url"
        : undefined;

/** twitter link validation */
export const checkTwitterlink = value =>
    value && !/^(http|https):\/\/www.twitter.com\/.*/i.test(value)
        ? "Please enter valid url"
        : undefined;

/** instagram link validation */
export const checkinstagramlink = value =>
    value && !/^(http|https):\/\/www.instagram.com\/.*/i.test(value)
        ? "Please enter valid url"
        : undefined;

/** youtube link validation */
export const checkYoutubelink = value =>
    value && !/^(http|https):\/\/www.youtube.com\/.*/i.test(value)
        ? "Please enter valid url"
        : undefined;

/** snapchat link validation */
export const checkSnapchatlink = value => {
    return value && !/^(http|https):\/\/www.snapchat.com\/.*/i.test(value);
};

/** IMBD link validation */
export const checkIMDBlink = value => {
    return value && !/^(http|https):\/\/www.imdb.com\/.*/i.test(value);
};

/** musically link validation */
export const checkMusicallylink = value =>
    value && !/^(http|https):\/\/www.musical.ly.com\/.*/i.test(value)
        ? "Please enter valid url"
        : undefined;

/** Email validation */
export const validateEmail = value => {
    return value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value);
};

/** Email validation */
// [a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}
export const email = value =>
    value &&

        !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,3}))$/i.test(
            value
        )

        // !/^[^.][a-z0-9.+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/i.test(
        //   value
        // )
        ? "Please enter the valid email address."
        : undefined;


export const validateEmails = value =>
    value &&

        !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i.test(
            value
        )

        // !/^[^.][a-z0-9.+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/i.test(
        //   value
        // )
        ? "Please enter the valid email address."
        : undefined;

/** Website validation */
export const website = value =>
    value &&
        !/^[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/i.test(
            value
        )
        ? "Please enter a valid website."
        : undefined;

/** Field required validation */
export const required = (value, name) => {
    if (typeof value === "string") {
        value = value.trim()
    }
    return typeof value !== "undefined" && value !== null && value !== ""
        ? undefined
        : langs.validation_messages.required;
};

/** select field required validation */
export const selectRequired = value =>
    typeof value !== "undefined" && value !== null && value !== ""
        ? undefined
        : langs.validation_messages.required;

/** Number validation */
export const number = value =>
    value && (
        String(parseInt(value)).length > 10 ||
        Number(value) <= 0 ||
        isNaN(Number(value))
        //!Number.isSafeInteger(Number(value))
    ) ? langs.validation_messages.invalid
        : undefined;

// /** Alphabetonly validation */
// export const alphabetsOnly = value =>
//   value && /[^a-zA-Z ]/i.test(value)
//     ? "Only alphabets are allowed."
//     : undefined;

/** Alphabetonly validation */
export const alphabetsOnly = value =>
    value && !/^[a-zA-Z\s\,]+$/i.test(value)
        ? "Only alphabets are allowed."
        : undefined;

export const alphabetsOnlyForName = value =>
    value && /[^a-zA-Z ]/i.test(value) ? "Please enter a valid name." : undefined;

/** Special name validation */
export const specialName = value =>
    value && /[^A-Za-z\'\s\.\,\@\_\-]+$/i.test(value)
        ? "Please enter a valid name."
        : undefined;

// /** Password validation */
// export const validatePassword = value => {
//   return (
//     value &&
//     /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*?[#?!@$%^&*-]).{5,}$/.test(value) ===
//       false
//   );
// };

/** Alphanumeric validation */
export const alphaNumeric = value =>
    value && /[^a-zA-Z0-9 ]/i.test(value)
        ? "Please enter a valid zip code"
        : undefined;

/** Alphanumeric validation */
export const validatePassword = value =>
    value && /^[a-zA-Z0-9!@#$%^&*]{6,18}$/i.test(value)
        ? "Password must accept the combination of special character"
        : undefined;


/** Alphanumeric title validation */
export const alphaNumericTitle = value =>
    value && /[^a-zA-Z0-9 ]/i.test(value)
        ? "Title can contain only alphabets and numbers."
        : undefined;

/** Phone number validation */
export const vlidatePhoneNumber = value => {
    return (
        value &&
        /(?:\+?61)?(?:\(0\)[23478]|\(?0?[23478]\)?)\d{8}/.test(value) === false
    );
};

// export const PhoneNumber = value => {
//   return (
//     value &&
//     /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(value) === false
//   );
// };

export const PhoneNumber = value =>
    value && !/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(value)
        ? 'Invalid phone number, must be 10 digits'
        : undefined

/** URL validation */
export const validateUrl = value =>
    value &&
        /^(http:|https:)\/\/(www\.)?[-a-zA-Z0-9@:%._~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_.~#?&//=]*)/.test(
            value
        ) === false
        ? "Please enter valid url"
        : undefined;

export const normalizePhone = value => {
    if (!value) {
        return value
    }

    return value.replace(/[^\d]/g, '')
}

/** Field required validation */
export const validatePhoneNumber = value =>
    value.match("\\d{10}") && value.match("\\d{3}[-\\.\\s]\\d{3}[-\\.\\s]\\d{4}")
        ? "Please enter valid number"
        : "";

export const greaterThanZeroWithTwoDecimalPlace = value => {
    return !value ? undefined : /^\s*(?=.*[1-9])\d*(?:\.\d{1,2})?\s*$/g.test(value) ? undefined : 'only up to 2 decimal place allowed'
}

export const greaterThanZeroWithOneDecimalPlace = value => {
    return !value ? undefined : /^\s*(?=.*[1-9])\d*(?:\.\d{1})?\s*$/g.test(value) ? undefined : 'only up to 1 decimal place allowed'
}

// combined validation check for percentage and fixed amount field conditionally 
export const percentageOrFixedAmountValidation = (value, allValues) => {
    let err = '';
    if (allValues.typeOfDiscount === "Percentage") {
        if (required(value)) {
            err = required(value)
        } else if (number(value)) {
            err = number(value)
        } else if (maxNumber100(value)) {
            err = maxNumber100(value)
        } else if (minNumber1(value)) {
            err = minNumber1(value)
        } else if (greaterThanZeroWithOneDecimalPlace(value)) {
            err = greaterThanZeroWithOneDecimalPlace(value)
        } else {
            return undefined
        }
        return [
            err
        ]
    } else {
        if (required(value)) {
            err = required(value)
        } else if (number(value)) {
            err = number(value)
        } else if (greaterThanZeroWithTwoDecimalPlace(value)) {
            err = greaterThanZeroWithTwoDecimalPlace(value)
        } else {
            return undefined
        }
        return [
            err
        ]
    }

}
import { langs } from './localization';
import validator from 'validator'

/** Field required validation */
export const required = (label) => {
    return { required: true, message: label ? `${label} is required.` : 'This field is required.' }
};

/** Field email validation */
export const email = () => {
    return { type: 'email', message: langs.validation_messages.invalid_email }
};

/** Field password validation */
export const password = () => {
    return { required: true, message: langs.validation_messages.password }
};

/** Field confirm password validation */
export const confirmPassword = () => {
    return { required: true, message: langs.validation_messages.cPassword }
};

/** Field new password validation */
export const newPassword = () => {
    return { required: true, message: langs.validation_messages.newPassword }
};

/** Field min length validation */
export const minLength = (number) => {
    return { min: number, message: `Min length must be ${number} digits.` }
};

/** Field max length validation */
export const maxLength = (number) => {
    return { max: number, message: `Max length must be ${number} digits.` }
};


/** Field max length character validation */
export const maxLengthC = (number) => {
    return { max: number, message: `Max length must be ${number} characters.` }
};
/** Field white validation */
export const whiteSpace = (label) => {
    return { whitespace: true, message: label && `${label} can not be empty.` }
};

/** Field validatePhoneNumber validation */
const phoneNumber = (number) => {
    const isValidPhoneNumber = validator.isMobilePhone(number)
    return (isValidPhoneNumber)
}
/** Field validatePhoneNumber validation */
export const validatePhoneNumber = (rule, phoneNumber, callback) => {
    

    // const isValid = /^[0-9]?[-.e]+$/.test(phoneNumber);
    const isValid = /[0-9]/.test(phoneNumber);

    
    const length = phoneNumber.length;
    // var IndNum =/^(?:\+?(61))? ?(?:\((?=.*\)))?(0?[2-57-8])\)? ?(\d\d(?:[- ](?=\d{3})|(?!\d\d[- ]?\d[- ]))\d\d[- ]?\d[- ]?\d{3})$/
    if (phoneNumber !== '' && phoneNumber && (phoneNumber.length >= 10 && phoneNumber.length <= 12)) {
        var IndNum = /^[0]?[0-9]+$/;
        

        if (!IndNum.test(phoneNumber)) {
            callback('Please enter valid mobile number.');
        } 
    }
    callback();
    // return;
}


export const validNumber = (rule, number, callback) => {
    const isSymbol = /[-!$%^&*()_+|~=`{}\[\]:';'<>?,.\/]/.test(number)
    const isValid = /^[+-]?(?:\d*\.)?\d+$/.test(number)
    // .test(number)
    const isNegative = /\-[0-9]*/.test(number)
    if (number !== '' && number) {
        const length = number.length;
        if (!isValid) {
            callback('Please enter valid number.');
        }
        else if (isNegative) {
            callback('Please enter valid number.');
        }

    } else {
        callback('This field is required.');
    }
    callback();
}


export const validMobile = (rule, number, callback) => {
    if (number !== '' && number) {
        // var IndNum = /^(?:\+?(61))? ?(?:\((?=.*\)))?(0?[2-57-8])\)? ?(\d\d(?:[- ](?=\d{3})|(?!\d\d[- ]?\d[- ]))\d\d[- ]?\d[- ]?\d{3})$/
        var IndNum = /^[0]?[0-9]+$/;
        if (!IndNum.test(number)) {
            callback('Please enter valid mobile number.');
        } else if (number.length > 12) {
            callback('Max length must be 12 digits.');
        } else if (number.length < 10) {
            callback('Min length must be 10 digits.');
        }
        
        // else if(number.length > 10){
        //     callback('Max length must be 10 digits.');
        // }else if(number.length < 10){
        //     callback('Min length must be 10 digits.');
        // }
    } else {
        callback('Mobile number is required.');
    }
    callback();
}

export const validMobile9 = (rule, number, callback) => {
    if (number !== '' && number) {
        // var IndNum = /^(?:\+?(61))? ?(?:\((?=.*\)))?(0?[2-57-8])\)? ?(\d\d(?:[- ](?=\d{3})|(?!\d\d[- ]?\d[- ]))\d\d[- ]?\d[- ]?\d{3})$/
        var IndNum = /^[0]?[0-9]+$/;
        if (!IndNum.test(number)) {
            callback('Please enter valid mobile number.');
        } else if (number.length > 11) {
            callback('Max length should be 11 digits.');
        } else if (number.length < 9) {
            callback('Min length should be 9 digits.');
        }
        
        // else if(number.length > 10){
        //     callback('Max length must be 10 digits.');
        // }else if(number.length < 10){
        //     callback('Min length must be 10 digits.');
        // }
    } else {
        callback('Mobile number is required.');
    }
    callback();
}
export const validPhone = (rule, number, callback) => {
    if (number !== '' && number) {
        // var IndNum = /^(?:\+?(61))? ?(?:\((?=.*\)))?(0?[2-57-8])\)? ?(\d\d(?:[- ](?=\d{3})|(?!\d\d[- ]?\d[- ]))\d\d[- ]?\d[- ]?\d{3})$/
        var IndNum = /^[0]?[0-9]+$/;
        if (!IndNum.test(number)) {
            callback('Please enter valid phone number.');
        } else if (number.length > 12) {
            callback('Max length must be 12 digits.');
        } else if (number.length < 10) {
            callback('Min length must be 10 digits.');
        }
        
        // else if(number.length > 10){
        //     callback('Max length must be 10 digits.');
        // }else if(number.length < 10){
        //     callback('Min length must be 10 digits.');
        // }
    } else {
        callback('Phone number is required.');
    }
    callback();
}


export const validSalary = (rule, number, callback) => {
    // const isValid = /^[+-]?(?:\d*\.)?\d+$/.test(number)
    const isValid = /^\d|\d,\d+(\.(\d{2}))?$/.test(number)
    
    // .test(number)
    const isNegative = /\-[0-9]*/.test(number)
    if (number !== '' && number) {
        const length = number.length;
        if (!isValid) {
            callback('Please enter valid number.');
        }
        // else if (isNegative) {
        //     callback('Please enter valid number.');
        // }

    } else {
        callback('This field is required.');
    }
    callback();
}

export const validNumberCheck = (rule, number, callback) => {
    const isSymbol = /[-!$%^&*()_+|~=`{}\[\]:';'<>?,.\/]/.test(number)
    const isValid = /^[+-]?(?:\d*\.)?\d+$/.test(number)
    // .test(number)
    const isNegative = /\-[0-9]*/.test(number)
    if (number !== '' && number) {
        const length = number.length;
        if (!isValid) {
            callback('Please enter valid number.');
        }
        else if (isNegative) {
            callback('Please enter valid number.');
        }
    }
    callback();
}







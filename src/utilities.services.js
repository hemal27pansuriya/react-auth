/* eslint-disable no-useless-escape */
export const validatePassword = (pass) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/
    return !!(pass.match(regex))
}

export const validateUsername = (sUsername) => /^\w{3,15}$/.test(sUsername)

export const validateMobile = (mobile) => {
    return !!mobile.match(/^\d{10}$/)
}

export const validateEmail = (email) => {
    const sRegexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    return !!(email.match(sRegexEmail))
}
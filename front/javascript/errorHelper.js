export function displayErrorInto(selector) {
    document.querySelector(selector).innerHTML = "<h1>Error</h1>";
}

export function logError(callSubject, err) {
    console.error(`erreur , sur ${callSubject} api: ${err}`);
}

export const ErrorContext = {
    constructor(callSubject, selector) {
        this.callSubject = callSubject
        this.selector = selector
    },
    
    displayThenLogError(err) {
        displayErrorInto(this.selector)
        logError(this.callSubject, err)
    }
}
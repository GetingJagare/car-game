/**
 * @param {string} cookieComponent 
 * @returns {string|null}
 */
export const getCookie = ( cookieComponent: string ): string|null => {
    const regexp = new RegExp( "^[;]?" + cookieComponent + "\\s?=\\s?([\\w]*)[;]?$" ),
        cookie = document.cookie;
    if ( !cookie ) {
        return null;
    }
    const result = cookie.match( regexp );
    return result ? result[1] : null;
}

/**
 * @param {string} login 
 * @returns void
 */
export const setCookie = ( login: string ): void => {
    //we will store cookie for 2 months
    if ( !document.cookie ) {
        return;
    }
    const d = new Date(),
        month = d.getUTCMonth() + 2, year = d.getUTCFullYear(), day = d.getUTCDay(),
        hours = d.getUTCHours(), minutes = d.getUTCMinutes(), secs = d.getUTCSeconds();
    document.cookie = `login=${login};expires=${( new Date( year, month, day, hours, minutes, secs ) ).toUTCString()};` +
        `domain=${location.hostname}`;
}
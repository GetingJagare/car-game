export const loginForm = () => {
    return `<form id="loginForm">
        <div style="margin-bottom: 10px;">
            <label for="userLogin" style="display: block; margin-bottom: 6px;">
                Please input your login:
            </label>
            <input id="userLogin" />
        </div>
        <input type="button" value="Submit" id="subBut"/>
        <div id="result"></div>
    </form>`;
}
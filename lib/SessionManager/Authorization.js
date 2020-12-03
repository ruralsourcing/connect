export default class Authorization {
    /**
     * 
     * @param {String} token 
     * @param {String} username 
     */
    constructor(token, username){
        this.token = token;
        this.username = username; 
    }
}
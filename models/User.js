let md5 = require('blueimp-md5');

class User {

  static fromJSON(userString) {
    let user = JSON.parse(userString);
    if(!user.hasOwnProperty("username")) return null;
    return new User(user.username);
  }


  constructor(username) {
    this.username = username;
    this.avatarUrl = `https://www.gravatar.com/avatar/${md5(this.username)}`
  }

}

export default User;

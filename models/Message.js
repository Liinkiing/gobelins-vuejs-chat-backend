class Message {

  constructor(body, author, isBot = false) {
    this.body = body;
    this.createdAt = Date.now();
    this.author = author;
    this.isBot = isBot;
  }

}

export default Message;

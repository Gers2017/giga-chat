// "0017": { username: "Sam", imagePath: "pepe.jpg", roomKey: "MyRoom" },
class User {
  /**
   * @param {string} username Nickname to display
   * @param {string} imagePath The path of the image to display in the client
   * @param {string} roomName The key of the room this user is currently chatting
   */
  constructor(username, imagePath, roomName) {
    this.username = username;
    this.imagePath = imagePath;
    this.roomName = roomName;
  }
}
module.exports = User;

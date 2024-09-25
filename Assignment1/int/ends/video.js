const dbConnection = require('../database');

const videoQueries = {
  addVideo: (videoData, callbackFn) => {
    const { title, filename, filepath, mimetype, size, duration, author, thumbnail, codec } = videoData;
    const insertStatement = `INSERT INTO Video (title, filename, filepath, mimetype, size, duration, author, thumbnail, codec) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    dbConnection.run(insertStatement, [title, filename, filepath, mimetype, size, duration, author, thumbnail, codec], function (err) {
      callbackFn(err, this.lastID);
    });
  },

  getVideosByAuthor: (authorIdentifier, callbackFn) => {
    const selectStatement = `SELECT * FROM Video WHERE author = ?`;
    dbConnection.all(selectStatement, [authorIdentifier], callbackFn);
  },

  getVideoById: (videoIdentifier, callbackFn) => {
    const selectStatement = 'SELECT * FROM Video WHERE id = ?';
    dbConnection.all(selectStatement, [videoIdentifier], callbackFn);
  },

  deleteVideo: (videoIdentifier, callbackFn) => {
    const deleteStatement = 'DELETE FROM Video WHERE id = ?';

    dbConnection.run(deleteStatement, [videoIdentifier], function (err) {
      if (err) {
        return callbackFn(err, null);
      }
      callbackFn(null, this.changes > 0);
    });
  }
};

module.exports = videoQueries;
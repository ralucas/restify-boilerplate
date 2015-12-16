
module.exports = function(table) {
  table.increments();
  table.string('firstname');
  table.string('lastname');
  table.string('username');
  table.string('password');
  table.timestamps();
};

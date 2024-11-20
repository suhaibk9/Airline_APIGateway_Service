const CrudRepository = require('./crud-repository');
const { User } = require('../models/index');
class UserRepository extends CrudRepository {
  constructor() {
    super(User);
  }
}

module.exports = UserRepository;

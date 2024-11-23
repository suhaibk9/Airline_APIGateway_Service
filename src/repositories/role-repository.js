const CrudRepository = require('./crud-repository');
const { Role } = require('../models');
class RoleRepository extends CrudRepository {
  constructor() {
    super(Role);
  }
  async getRoleByName(name) {
    return await Role.findOne({ where: { name } });
  }
}
module.exports = RoleRepository;

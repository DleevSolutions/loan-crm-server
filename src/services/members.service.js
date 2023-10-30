const createMembersDao = require('../dao/members.dao');
const membersDao = createMembersDao();

const findAllMembers = async (query) => {
  const results = await membersDao.findAllMembers(query);
  return results;
};

const createMember = async (payload) => {
  const results = await membersDao.createMember(payload);
  return results;
};

const updateMember = async (payload) => {
  const results = await membersDao.updateMember(payload);
  return results;
};

const deleteMember = async (query) => {
  const results = await membersDao.deleteMember(query);
  return results;
};

module.exports = {
  findAllMembers,
  createMember,
  updateMember,
  deleteMember,
};

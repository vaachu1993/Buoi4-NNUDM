var express = require('express');
var router = express.Router();
const { dataRole, dataUser } = require('../data');

// GET all roles - Read all
router.get('/', function(req, res, next) {
  res.json({
    data: dataRole
  });
});

// GET role by id - Read one
router.get('/:id', function(req, res, next) {
  const role = dataRole.find(r => r.id === req.params.id);
  
  if (!role) {
    return res.status(404).json({
      message: 'Không tìm thấy role với id: ' + req.params.id
    });
  }
  
  res.json({
    data: role
  });
});

// POST create new role - Create
router.post('/', function(req, res, next) {
  const { name, description } = req.body;
  
  if (!name || !description) {
    return res.status(400).json({
      success: false,
      message: 'Thiếu thông tin name hoặc description'
    });
  }
  
  // Generate new id
  const newId = 'r' + (dataRole.length + 1);
  const newRole = {
    id: newId,
    name: name,
    description: description,
    creationAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  dataRole.push(newRole);
  
  res.status(201).json({
    message: 'Tạo role thành công',
    data: newRole
  });
});

// PUT update role - Update
router.put('/:id', function(req, res, next) {
  const roleIndex = dataRole.findIndex(r => r.id === req.params.id);
  
  if (roleIndex === -1) {
    return res.status(404).json({
      message: 'Không tìm thấy role với id: ' + req.params.id
    });
  }
  
  const { name, description } = req.body;
  
  if (name) dataRole[roleIndex].name = name;
  if (description) dataRole[roleIndex].description = description;
  dataRole[roleIndex].updatedAt = new Date().toISOString();
  
  res.json({
    message: 'Cập nhật role thành công',
    data: dataRole[roleIndex]
  });
});

// DELETE role - Delete
router.delete('/:id', function(req, res, next) {
  const roleIndex = dataRole.findIndex(r => r.id === req.params.id);
  
  if (roleIndex === -1) {
    return res.status(404).json({
      message: 'Không tìm thấy role với id: ' + req.params.id
    });
  }
  
  const deletedRole = dataRole.splice(roleIndex, 1);
  
  res.json({
    message: 'Xóa role thành công',
    data: deletedRole[0]
  });
});

// GET all users in a role - Special endpoint
router.get('/:id/users', function(req, res, next) {
  const roleId = req.params.id;
  
  // Check if role exists
  const role = dataRole.find(r => r.id === roleId);
  
  if (!role) {
    return res.status(404).json({
      message: 'Không tìm thấy role với id: ' + roleId
    });
  }
  
  // Filter users by role id
  const usersInRole = dataUser.filter(u => u.role.id === roleId);
  
  res.json({
    role: role,
    totalUsers: usersInRole.length,
    data: usersInRole
  });
});

module.exports = router;

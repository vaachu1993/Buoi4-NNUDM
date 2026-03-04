var express = require('express');
var router = express.Router();
const { dataUser, dataRole } = require('../data');

// GET all users - Read all
router.get('/', function(req, res, next) {
  res.json({
    data: dataUser
  });
});

// GET user by username - Read one
router.get('/:username', function(req, res, next) {
  const user = dataUser.find(u => u.username === req.params.username);
  
  if (!user) {
    return res.status(404).json({
      message: 'Không tìm thấy user với username: ' + req.params.username
    });
  }
  
  res.json({
    data: user
  });
});

// POST create new user - Create
router.post('/', function(req, res, next) {
  const { username, password, email, fullName, avatarUrl, roleId } = req.body;
  
  if (!username || !password || !email || !fullName || !roleId) {
    return res.status(400).json({
      message: 'Thiếu thông tin bắt buộc (username, password, email, fullName, roleId)'
    });
  }
  
  // Check if username already exists
  const existingUser = dataUser.find(u => u.username === username);
  if (existingUser) {
    return res.status(400).json({
      message: 'Username đã tồn tại'
    });
  }
  
  // Find role
  const role = dataRole.find(r => r.id === roleId);
  if (!role) {
    return res.status(404).json({
      message: 'Không tìm thấy role với id: ' + roleId
    });
  }
  
  const newUser = {
    username: username,
    password: password,
    email: email,
    fullName: fullName,
    avatarUrl: avatarUrl || 'https://i.sstatic.net/l60Hf.png',
    status: true,
    loginCount: 0,
    role: {
      id: role.id,
      name: role.name,
      description: role.description
    },
    creationAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  dataUser.push(newUser);
  
  res.status(201).json({
    message: 'Tạo user thành công',
    data: newUser
  });
});

// PUT update user - Update
router.put('/:username', function(req, res, next) {
  const userIndex = dataUser.findIndex(u => u.username === req.params.username);
  
  if (userIndex === -1) {
    return res.status(404).json({
      message: 'Không tìm thấy user với username: ' + req.params.username
    });
  }
  
  const { password, email, fullName, avatarUrl, status, roleId } = req.body;
  
  if (password) dataUser[userIndex].password = password;
  if (email) dataUser[userIndex].email = email;
  if (fullName) dataUser[userIndex].fullName = fullName;
  if (avatarUrl) dataUser[userIndex].avatarUrl = avatarUrl;
  if (status !== undefined) dataUser[userIndex].status = status;
  
  if (roleId) {
    const role = dataRole.find(r => r.id === roleId);
    if (role) {
      dataUser[userIndex].role = {
        id: role.id,
        name: role.name,
        description: role.description
      };
    }
  }
  
  dataUser[userIndex].updatedAt = new Date().toISOString();
  
  res.json({
    message: 'Cập nhật user thành công',
    data: dataUser[userIndex]
  });
});

// DELETE user - Delete
router.delete('/:username', function(req, res, next) {
  const userIndex = dataUser.findIndex(u => u.username === req.params.username);
  
  if (userIndex === -1) {
    return res.status(404).json({
      message: 'Không tìm thấy user với username: ' + req.params.username
    });
  }
  
  const deletedUser = dataUser.splice(userIndex, 1);
  
  res.json({
    message: 'Xóa user thành công',
    data: deletedUser[0]
  });
});

module.exports = router;

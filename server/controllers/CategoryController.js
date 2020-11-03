const createError = require('http-errors');
const { Organization, Category, User, Task, UserOrganization } = require('../models');

class CategoryController {

  // static index(req, res, next) {
  //   const { OrganizationId } = req.params; 
  //   res.status(200).json({ message: 'index Conection OK' })
  // }

  static store(req, res, next) {
    const { name, OrganizationId } = req.body;
    const input = { name, UserId: req.logedInUser.id, OrganizationId };
    Category.create(input)
      .then((category) => {
        res.status(201).json({ status: 201, category })
      }).catch((err) => {
        next(err)
      });
  }

  static show(req, res, next) {
    const { OrganizationId } = req.params;
    Category.findAll({
      where: { OrganizationId },
      include: [{ model: Task, 
        include: [{ model: User, 
          attributes: { exclude: ['password', 'createdAt', 'updatedAt'] } }] }]
    })
      .then((categories) => {
        res.status(200).json(categories)
      }).catch((err) => {
        next(err)
      });
  }

  static update(req, res, next) {
    const { id } = req.params;
    const { OrganizationId, name } = req.body;
    const input = { name };
    Category.update(input, {
      where: { id },
      returning: true
    })
      .then((category) => {
        res.status(200).json({ status: 200, category: category[1][0] })
      }).catch((err) => {
        next(err)
      });
  }

  static destroy(req, res, next) {
    const { id } = req.params;
    Category.destroy({
      where: { id }
    })
      .then((result) => {
        if (result > 0) {
          res.status(200).json({ status: 200, message: 'Success deleted list category!' })
        }
      }).catch((err) => {
        next(err)
      });
  }

}

module.exports = CategoryController;
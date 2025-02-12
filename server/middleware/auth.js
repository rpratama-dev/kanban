const createError = require('http-errors');
const { User, Task, Category, Organization, UserOrganization } = require('../models');
const { verifyToken } = require("../helper/jwt");
const { static } = require('express');

function authentication(req, res, next) {
  const { access_token } = req.headers;
  try {
    if (!access_token) {
      throw (createError(401, 'Authentication failed!'));
    } else {
      const decoded = verifyToken(access_token);
      User.findOne({
        where: { id: decoded.id }
      })
        .then((user) => {
          if (!user) {
            throw (createError(401, 'Authentication failed!'));
          } else {
            req.logedInUser = decoded;
            next();
          }
        }).catch((err) => {
          throw (createError(500, err.message));
        });
    }
  } catch (err) {
    next(err);
  }
}

function authorizeOrganization(req, res, next) {
  const source = req.originalUrl.replace('/', '');
  const method = req.method.toLowerCase();
  const id = req.body.OrganizationId || req.query.organizationid || req.params.OrganizationId || req.params.id;

  Organization.findByPk(id, { include: [User] })
    .then((organization) => {
      if (!organization) {
        throw (createError(404, 'Organization ID Not Found'))
      } else {
        const isAdmin = organization.UserId == req.logedInUser.id;
        const arrTemp = organization.Users;
        const isMember = arrTemp.find(user => user.id == req.logedInUser.id);
        if (isAdmin || isMember) {
          console.log("ID", isAdmin, isMember);
          if (source == 'tasks' && (isMember || isAdmin) && method == 'post') {
            next();
          } else if (isAdmin && method != 'get') {
            next();
          } else if (isMember && method != 'get') {
            throw (createError(401, 'Not Authorize!'))
          } else {
            next();
          }
        } else {
          throw (createError(401, 'Not authorize, For members only!'));
        }
      }
    }).catch((err) => {
      next(err);
    });
}

function authorizeCategory(req, res, next) {
  const { id } = req.params;
  Category.findByPk(id)
    .then((category) => {
      if (!category) {
        throw (createError(404, 'Category id not found!'));
      } else {
        const { OrganizationId } = req.body;
        if (OrganizationId != category.OrganizationId) {
          throw (createError(401), 'Not authorize!');
        } else if (category.UserId != req.logedInUser.id) {
          throw (createError(401), 'Not authorize!');
        } else {
          next();
        }
      }
    }).catch((err) => {
      next(err)
    });
}

function authorizeTask(req, res, next) {
  const method = req.method.toLowerCase();
  const { id } = req.params;
  const UserId = req.logedInUser.id;
  const OrganizationId = req.body.OrganizationId || req.query.organizations;

  // const input = { method, id, UserId, OrganizationId }
  // res.status(200).json(input)

  Task.findByPk(id, {
    include: [{
      model: Organization,
      include: [{
        model: User,
        attributes: { exclude: ['password', 'createdAt', 'updatedAt'] }
      }]
    }]
  })
    .then((task) => {
      if (!task) {
        throw (createError(404, 'Task id not found!'));
      } else {
        const members = task.Organization.Users;
        const isMember = members.find(user => user.id == UserId);
        const isAdmin = task.Organization.UserId == UserId;
        if (task.OrganizationId == OrganizationId && (isMember || isAdmin)) {
          switch (method) {
            case 'delete':
            case 'put':
            case 'patch':
              if (task.UserId == UserId) {
                next();
              } else {
                throw (createError(401, 'Not authorize delete or update!'));
              }
              break;
            case 'get':
              next();
              break;
            default:
              throw (createError(401, 'Not authorize, For Members Only!')); 
          }
        } else {
          throw (createError(401, 'Not authorize, For Members Only! xssasa'));
        }
      }
    }).catch((err) => {
      next(err);
    });
}

module.exports = {
  authentication, authorizeTask, authorizeOrganization, authorizeCategory
}

'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Task.belongsTo(models.User, { foreignKey: 'UserId', onDelete: 'cascade' });
      Task.belongsTo(models.Category, { foreignKey: 'CategoryId', onDelete: 'cascade' });
      Task.belongsTo(models.Organization, { foreignKey: 'OrganizationId', onDelete: 'cascade' });
    }
  };
  Task.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Task name is required, can\'t be empty!'
        },
        notNull: {
          args: true,
          msg: 'Task name is required, can\'t be null!'
        }
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Description is required, can\'t be empty!'
        },
        notNull: {
          args: true,
          msg: 'Description is required, can\'t be null!'
        }
      }
    },
    UserId: DataTypes.INTEGER,
    CategoryId: DataTypes.INTEGER,
    OrganizationId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Task',
  });
  return Task;
};
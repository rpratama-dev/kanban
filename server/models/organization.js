'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Organization extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here 
      Organization.belongsToMany(models.User, { through: 'UserOrganizations', foreignKey: 'OrganizationId' });
      Organization.hasMany(models.Category, { foreignKey: 'OrganizationId' });
      // Organization.belongsTo(models.User, { foreignKey: 'UserId' }); 

    }
  };
  Organization.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Organization name is required, can\'t be empty!'
        },
        notNull: {
          args: true,
          msg: 'Organization name is required, can\'t be null!'
        }
      }
    },
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Organization',
  });
  return Organization;
};
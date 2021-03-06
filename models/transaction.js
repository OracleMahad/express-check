const Sequelize = require('sequelize');

module.exports = class Transaction extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        is_consumption: {
          type: Sequelize.INTEGER,
          allowNull: false,
          default: 0,
        },
        price: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        detail: {
          type: Sequelize.TEXT,
          validate: {
            len: [0, 500],
          },
          allowNull: true,
        },
        date: {
          type: Sequelize.DATEONLY,
          allowNull: false,
        },
        category: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        type: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
          comment: '0 거래,1 자동거래'
        }
      },
      {
        sequelize,
        timestamps: true,
        modelName: 'Transaction',
        tableName: 'transactions',
        paranoid: true,
        underscored: true,
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
      },
    );
  }

  static associate(db) {
    db.Transaction.belongsTo(db.Account, {
      foreignKey: 'account_id',
      targetKey: 'id',
      as: 'account',
    });
    // db.Transaction.belongsTo(db.User, {
    //   allowNull: true,
    //   foreignKey: 'user_id',
    //   targetKey: 'id',
    //   as: 'user',
    // });
  }
};

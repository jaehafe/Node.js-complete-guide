const Sequelize = require('sequelize');

// class <모델 이름>
class User extends Sequelize.Model {
  static initiate(sequelize) {
    User.init(
      // 첫 번째 매개변수: 모델의 옵션을 정의하는 객체
      {
        // sequelize는 id를 자동으로 넣어주기 때문에 생략 가능
        // id: {
        //   type: Sequelize.INTEGER,
        //   primaryKey: true,
        //   autoIncrement: true,
        // },
        name: {
          type: Sequelize.STRING(20), // VARCHAR
          allowNull: false, // not null
          unique: true, // 고유값
        },
        age: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: false,
        },
        married: {
          type: Sequelize.BOOLEAN, // TINYINT(1)
          allowNull: false,
        },
        comment: {
          type: Sequelize.TEXT, // TEXT
          allowNull: true,
        },
        created_at: {
          type: Sequelize.DATE, // DATETIME, MySQL: DATE = Sequelize: DateOnly
          allowNull: false,
          defaultValue: Sequelize.NOW, // now()
        },
        // createdAt, updatedAt, deletedAt: true(soft delete)
      },
      {
        // 두 번째 매개변수: 모델의 옵션을 정의하는 객체
        sequelize,
        timestamps: false, // true면 createdAt, updatedAt을 넣어줌
        underscored: false,
        modelName: 'User',
        tableName: 'users',
        paranoid: false, // true면 제거한 날짜도 만들어짐
        charset: 'utf8',
        collate: 'utf8_general_ci',
      }
    );
  }

  static associate(db) {
    // 다른 모델과의 관계를 정의하는 데 사용
    db.User.hasMany(db.Comment, { foreignKey: 'commenter', sourceKey: 'id' });
  }
}

module.exports = User;

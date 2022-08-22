'use strict';

module.exports = {
  async up(queryInterface, DataTypes) {
    try {
      await queryInterface.createTable('producto', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: DataTypes.INTEGER
        },
        nombre: {
          type: DataTypes.STRING
        },
        precio: {
          type: DataTypes.FLOAT
        },
        imagenId: {
          type: DataTypes.INTEGER
        },
        categoriaId: {
          type: DataTypes.INTEGER
        },
        subcategoriaId: {
          type: DataTypes.INTEGER
        },
        informationId: {
          type: DataTypes.INTEGER
        },
        marcaId: {
          type: DataTypes.INTEGER
        },
        lineaId: {
          type: DataTypes.INTEGER
        },
        descripcion: {
          type: DataTypes.TEXT
        }
      });

    } catch (error) {
      console.log(error)
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('producto');
  }
};
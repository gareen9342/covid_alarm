import {Column, CreatedAt, Model, PrimaryKey, Table, UpdatedAt} from "sequelize-typescript";

@Table({
  timestamps: true
})
export class Config extends Model {

  @PrimaryKey @Column
  key!: string;

  @Column
  value!: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;
}
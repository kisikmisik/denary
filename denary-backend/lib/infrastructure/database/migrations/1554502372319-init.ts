import {MigrationInterface, QueryRunner} from "typeorm";

export class init1554502372319 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}

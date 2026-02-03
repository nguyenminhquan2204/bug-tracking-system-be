import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUniqueRoleName1770113349517 implements MigrationInterface {
    name = 'AddUniqueRoleName1770113349517'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_17022daf3f885f7d35423e9971e"`);
        await queryRunner.query(`ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_178199805b901ccd220ab7740ec"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_178199805b901ccd220ab7740e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_17022daf3f885f7d35423e9971"`);
        await queryRunner.query(`ALTER TABLE "role_permissions" DROP CONSTRAINT "PK_25d24010f53bb80b78e412c9656"`);
        await queryRunner.query(`ALTER TABLE "role_permissions" ADD CONSTRAINT "PK_17022daf3f885f7d35423e9971e" PRIMARY KEY ("permission_id")`);
        await queryRunner.query(`ALTER TABLE "role_permissions" DROP COLUMN "role_id"`);
        await queryRunner.query(`ALTER TABLE "role_permissions" DROP CONSTRAINT "PK_17022daf3f885f7d35423e9971e"`);
        await queryRunner.query(`ALTER TABLE "role_permissions" DROP COLUMN "permission_id"`);
        await queryRunner.query(`ALTER TABLE "role_permissions" ADD "rolesId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "role_permissions" ADD CONSTRAINT "PK_0cb93c5877d37e954e2aa59e52c" PRIMARY KEY ("rolesId")`);
        await queryRunner.query(`ALTER TABLE "role_permissions" ADD "permissionsId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "role_permissions" DROP CONSTRAINT "PK_0cb93c5877d37e954e2aa59e52c"`);
        await queryRunner.query(`ALTER TABLE "role_permissions" ADD CONSTRAINT "PK_7931614007a93423204b4b73240" PRIMARY KEY ("rolesId", "permissionsId")`);
        await queryRunner.query(`ALTER TABLE "roles" ADD CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7" UNIQUE ("name")`);
        await queryRunner.query(`CREATE INDEX "IDX_0cb93c5877d37e954e2aa59e52" ON "role_permissions" ("rolesId") `);
        await queryRunner.query(`CREATE INDEX "IDX_d422dabc78ff74a8dab6583da0" ON "role_permissions" ("permissionsId") `);
        await queryRunner.query(`ALTER TABLE "role_permissions" ADD CONSTRAINT "FK_0cb93c5877d37e954e2aa59e52c" FOREIGN KEY ("rolesId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "role_permissions" ADD CONSTRAINT "FK_d422dabc78ff74a8dab6583da02" FOREIGN KEY ("permissionsId") REFERENCES "permissions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_d422dabc78ff74a8dab6583da02"`);
        await queryRunner.query(`ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_0cb93c5877d37e954e2aa59e52c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d422dabc78ff74a8dab6583da0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0cb93c5877d37e954e2aa59e52"`);
        await queryRunner.query(`ALTER TABLE "roles" DROP CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7"`);
        await queryRunner.query(`ALTER TABLE "role_permissions" DROP CONSTRAINT "PK_7931614007a93423204b4b73240"`);
        await queryRunner.query(`ALTER TABLE "role_permissions" ADD CONSTRAINT "PK_0cb93c5877d37e954e2aa59e52c" PRIMARY KEY ("rolesId")`);
        await queryRunner.query(`ALTER TABLE "role_permissions" DROP COLUMN "permissionsId"`);
        await queryRunner.query(`ALTER TABLE "role_permissions" DROP CONSTRAINT "PK_0cb93c5877d37e954e2aa59e52c"`);
        await queryRunner.query(`ALTER TABLE "role_permissions" DROP COLUMN "rolesId"`);
        await queryRunner.query(`ALTER TABLE "role_permissions" ADD "permission_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "role_permissions" ADD CONSTRAINT "PK_17022daf3f885f7d35423e9971e" PRIMARY KEY ("permission_id")`);
        await queryRunner.query(`ALTER TABLE "role_permissions" ADD "role_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "role_permissions" DROP CONSTRAINT "PK_17022daf3f885f7d35423e9971e"`);
        await queryRunner.query(`ALTER TABLE "role_permissions" ADD CONSTRAINT "PK_25d24010f53bb80b78e412c9656" PRIMARY KEY ("role_id", "permission_id")`);
        await queryRunner.query(`CREATE INDEX "IDX_17022daf3f885f7d35423e9971" ON "role_permissions" ("permission_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_178199805b901ccd220ab7740e" ON "role_permissions" ("role_id") `);
        await queryRunner.query(`ALTER TABLE "role_permissions" ADD CONSTRAINT "FK_178199805b901ccd220ab7740ec" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "role_permissions" ADD CONSTRAINT "FK_17022daf3f885f7d35423e9971e" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateProductImage1747745767269 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE products
            ADD COLUMN image jsonb DEFAULT NULL
        `);

        await queryRunner.query(`
            UPDATE products
            SET image = '{
                "url": "https://tech-challenge-fiap-pethraf.s3.sa-east-1.amazonaws.com/img/x-burger.jpg",
                "alt": "X-Burger"
            }'
            WHERE id = 'd79e7d79-c087-4597-8c02-304bbf83b407';
            UPDATE products
            SET image = '{
                "url": "https://tech-challenge-fiap-pethraf.s3.sa-east-1.amazonaws.com/img/x-bacon.jpg",
                "alt": "X-Bacon"
            }'
            WHERE id = '9d9419e1-aab3-4e70-bccb-9f92f7b89653';
            UPDATE products
            SET image = '{
                "url": "https://tech-challenge-fiap-pethraf.s3.sa-east-1.amazonaws.com/img/x-salada.jpeg",
                "alt": "X-Salada"
            }'
            WHERE id = '27f3ca24-b72f-4e9b-9404-f218a887c755';
            UPDATE products
            SET image = '{
                "url": "https://tech-challenge-fiap-pethraf.s3.sa-east-1.amazonaws.com/img/batata+frita.jpg",
                "alt": "Batata Frita"
            }'
            WHERE id = '5d93ee56-5cc8-4d86-b779-8eb6f29c186e';
            UPDATE products
            SET image = '{
                "url": "https://tech-challenge-fiap-pethraf.s3.sa-east-1.amazonaws.com/img/onion+rings.jpeg",
                "alt": "Onion Rings"
            }'
            WHERE id = '996576cc-45d6-4918-9a2f-29988536c198';
            UPDATE products
            SET image = '{
                "url": "https://tech-challenge-fiap-pethraf.s3.sa-east-1.amazonaws.com/img/Refrigerante+Lata.jpeg",
                "alt": "Refrigerante Lata"
            }'
            WHERE id = 'f79f4160-e6f0-4458-a287-bdf48b5b4b73';
            UPDATE products
            SET image = '{
                "url": "https://tech-challenge-fiap-pethraf.s3.sa-east-1.amazonaws.com/img/Suco+Natural.jpeg",
                "alt": "Suco Natural"
            }'
            WHERE id = 'bf317dc7-85ec-4d15-ab75-35c7be3437f8';
            UPDATE products
            SET image = '{
                "url": "https://tech-challenge-fiap-pethraf.s3.sa-east-1.amazonaws.com/img/milk+shake.jpg",
                "alt": "Milk Shake"
            }'
            WHERE id = '5834382b-997a-4470-8def-ef8d28321c42';
            UPDATE products
            SET image = '{
                "url": "https://tech-challenge-fiap-pethraf.s3.sa-east-1.amazonaws.com/img/sundae.jpg",
                "alt": "Sundae"
            }'
            WHERE id = 'f333ca27-bb0d-4b7a-8364-daab5944cbdf';
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE products
            DROP COLUMN image
        `);
    }

}

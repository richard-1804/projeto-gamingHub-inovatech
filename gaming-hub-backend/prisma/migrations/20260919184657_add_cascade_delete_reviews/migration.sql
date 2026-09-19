-- DropForeignKey
ALTER TABLE `reviews` DROP FOREIGN KEY `reviews_ibfk_2`;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`games_id_fk`) REFERENCES `games`(`id_games_pk`) ON DELETE CASCADE ON UPDATE RESTRICT;

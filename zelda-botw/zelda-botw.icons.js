/*
	The legend of Zelda: Breath of the wild Savegame Editor (Icons) v20171113

	by Marc Robledo 2017


	icons extracted from https://www.spriters-resource.com/wii_u/thelegendofzeldabreathofthewild/
*/

var BOTW_Icons=(function(){
	var ICON_SIZE=64;
	var ICON_COLS=16;
	var IMG_PATH='./assets/';

	var ICONS={
		Armor_Head:['001','001_Dye01','001_Dye02','001_Dye03','001_Dye04','001_Dye05','001_Dye06','001_Dye07','001_Dye08','001_Dye09','001_Dye10','001_Dye11','001_Dye12','001_Dye13','001_Dye14','001_Dye15','005','005_Dye01','005_Dye02','005_Dye03','005_Dye04','005_Dye05','005_Dye06','005_Dye07','005_Dye08','005_Dye09','005_Dye10','005_Dye11','005_Dye12','005_Dye13','005_Dye14','005_Dye15','006','006_Dye01','006_Dye02','006_Dye03','006_Dye04','006_Dye05','006_Dye06','006_Dye07','006_Dye08','006_Dye09','006_Dye10','006_Dye11','006_Dye12','006_Dye13','006_Dye14','006_Dye15','008','008_Dye01','008_Dye02','008_Dye03','008_Dye04','008_Dye05','008_Dye06','008_Dye07','008_Dye08','008_Dye09','008_Dye10','008_Dye11','008_Dye12','008_Dye13','008_Dye14','008_Dye15','009','009_Dye01','009_Dye02','009_Dye03','009_Dye04','009_Dye05','009_Dye06','009_Dye07','009_Dye08','009_Dye09','009_Dye10','009_Dye11','009_Dye12','009_Dye13','009_Dye14','009_Dye15','011','011_Dye01','011_Dye02','011_Dye03','011_Dye04','011_Dye05','011_Dye06','011_Dye07','011_Dye08','011_Dye09','011_Dye10','011_Dye11','011_Dye12','011_Dye13','011_Dye14','011_Dye15','012','012_Dye01','012_Dye02','012_Dye03','012_Dye04','012_Dye05','012_Dye06','012_Dye07','012_Dye08','012_Dye09','012_Dye10','012_Dye11','012_Dye12','012_Dye13','012_Dye14','012_Dye15','014','014_Dye01','014_Dye02','014_Dye03','014_Dye04','014_Dye05','014_Dye06','014_Dye07','014_Dye08','014_Dye09','014_Dye10','014_Dye11','014_Dye12','014_Dye13','014_Dye14','014_Dye15','017','017_Dye01','017_Dye02','017_Dye03','017_Dye04','017_Dye05','017_Dye06','017_Dye07','017_Dye08','017_Dye09','017_Dye10','017_Dye11','017_Dye12','017_Dye13','017_Dye14','017_Dye15','020','020_Dye01','020_Dye02','020_Dye03','020_Dye04','020_Dye05','020_Dye06','020_Dye07','020_Dye08','020_Dye09','020_Dye10','020_Dye11','020_Dye12','020_Dye13','020_Dye14','020_Dye15','021','021_Dye01','021_Dye02','021_Dye03','021_Dye04','021_Dye05','021_Dye06','021_Dye07','021_Dye08','021_Dye09','021_Dye10','021_Dye11','021_Dye12','021_Dye13','021_Dye14','021_Dye15','046','046_Dye01','046_Dye02','046_Dye03','046_Dye04','046_Dye05','046_Dye06','046_Dye07','046_Dye08','046_Dye09','046_Dye10','046_Dye11','046_Dye12','046_Dye13','046_Dye14','046_Dye15','048','048_Dye01','048_Dye02','048_Dye03','048_Dye04','048_Dye05','048_Dye06','048_Dye07','048_Dye08','048_Dye09','048_Dye10','048_Dye11','048_Dye12','048_Dye13','048_Dye14','048_Dye15','053','053_Dye01','053_Dye02','053_Dye03','053_Dye04','053_Dye05','053_Dye06','053_Dye07','053_Dye08','053_Dye09','053_Dye10','053_Dye11','053_Dye12','053_Dye13','053_Dye14','053_Dye15','181','181_Dye01','181_Dye02','181_Dye03','181_Dye04','181_Dye05','181_Dye06','181_Dye07','181_Dye08','181_Dye09','181_Dye10','181_Dye11','181_Dye12','181_Dye13','181_Dye14','181_Dye15','182','182_Dye01','182_Dye02','182_Dye03','182_Dye04','182_Dye05','182_Dye06','182_Dye07','182_Dye08','182_Dye09','182_Dye10','182_Dye11','182_Dye12','182_Dye13','182_Dye14','182_Dye15','183','183_Dye01','183_Dye02','183_Dye03','183_Dye04','183_Dye05','183_Dye06','183_Dye07','183_Dye08','183_Dye09','183_Dye10','183_Dye11','183_Dye12','183_Dye13','183_Dye14','183_Dye15','184','184_Dye01','184_Dye02','184_Dye03','184_Dye04','184_Dye05','184_Dye06','184_Dye07','184_Dye08','184_Dye09','184_Dye10','184_Dye11','184_Dye12','184_Dye13','184_Dye14','184_Dye15','024','025','026','027','028','029','022','045','055','056','115','160','200','205','210','215','220','225','230','171','172','173','174','176','185','177','178','179','180'],
		Armor_Upper:['001','001_Dye01','001_Dye02','001_Dye03','001_Dye04','001_Dye05','001_Dye06','001_Dye07','001_Dye08','001_Dye09','001_Dye10','001_Dye11','001_Dye12','001_Dye13','001_Dye14','001_Dye15','005','005_Dye01','005_Dye02','005_Dye03','005_Dye04','005_Dye05','005_Dye06','005_Dye07','005_Dye08','005_Dye09','005_Dye10','005_Dye11','005_Dye12','005_Dye13','005_Dye14','005_Dye15','006','006_Dye01','006_Dye02','006_Dye03','006_Dye04','006_Dye05','006_Dye06','006_Dye07','006_Dye08','006_Dye09','006_Dye10','006_Dye11','006_Dye12','006_Dye13','006_Dye14','006_Dye15','008','008_Dye01','008_Dye02','008_Dye03','008_Dye04','008_Dye05','008_Dye06','008_Dye07','008_Dye08','008_Dye09','008_Dye10','008_Dye11','008_Dye12','008_Dye13','008_Dye14','008_Dye15','009','009_Dye01','009_Dye02','009_Dye03','009_Dye04','009_Dye05','009_Dye06','009_Dye07','009_Dye08','009_Dye09','009_Dye10','009_Dye11','009_Dye12','009_Dye13','009_Dye14','009_Dye15','011','011_Dye01','011_Dye02','011_Dye03','011_Dye04','011_Dye05','011_Dye06','011_Dye07','011_Dye08','011_Dye09','011_Dye10','011_Dye11','011_Dye12','011_Dye13','011_Dye14','011_Dye15','012','012_Dye01','012_Dye02','012_Dye03','012_Dye04','012_Dye05','012_Dye06','012_Dye07','012_Dye08','012_Dye09','012_Dye10','012_Dye11','012_Dye12','012_Dye13','012_Dye14','012_Dye15','014','014_Dye01','014_Dye02','014_Dye03','014_Dye04','014_Dye05','014_Dye06','014_Dye07','014_Dye08','014_Dye09','014_Dye10','014_Dye11','014_Dye12','014_Dye13','014_Dye14','014_Dye15','017','017_Dye01','017_Dye02','017_Dye03','017_Dye04','017_Dye05','017_Dye06','017_Dye07','017_Dye08','017_Dye09','017_Dye10','017_Dye11','017_Dye12','017_Dye13','017_Dye14','017_Dye15','020','020_Dye01','020_Dye02','020_Dye03','020_Dye04','020_Dye05','020_Dye06','020_Dye07','020_Dye08','020_Dye09','020_Dye10','020_Dye11','020_Dye12','020_Dye13','020_Dye14','020_Dye15','021','021_Dye01','021_Dye02','021_Dye03','021_Dye04','021_Dye05','021_Dye06','021_Dye07','021_Dye08','021_Dye09','021_Dye10','021_Dye11','021_Dye12','021_Dye13','021_Dye14','021_Dye15','043','043_Dye01','043_Dye02','043_Dye03','043_Dye04','043_Dye05','043_Dye06','043_Dye07','043_Dye08','043_Dye09','043_Dye10','043_Dye11','043_Dye12','043_Dye13','043_Dye14','043_Dye15','044','044_Dye01','044_Dye02','044_Dye03','044_Dye04','044_Dye05','044_Dye06','044_Dye07','044_Dye08','044_Dye09','044_Dye10','044_Dye11','044_Dye12','044_Dye13','044_Dye14','044_Dye15','046','046_Dye01','046_Dye02','046_Dye03','046_Dye04','046_Dye05','046_Dye06','046_Dye07','046_Dye08','046_Dye09','046_Dye10','046_Dye11','046_Dye12','046_Dye13','046_Dye14','046_Dye15','048','048_Dye01','048_Dye02','048_Dye03','048_Dye04','048_Dye05','048_Dye06','048_Dye07','048_Dye08','048_Dye09','048_Dye10','048_Dye11','048_Dye12','048_Dye13','048_Dye14','048_Dye15','053','053_Dye01','053_Dye02','053_Dye03','053_Dye04','053_Dye05','053_Dye06','053_Dye07','053_Dye08','053_Dye09','053_Dye10','053_Dye11','053_Dye12','053_Dye13','053_Dye14','053_Dye15','116','160','170','200','205','210','215','225','230','171','174','185','175','179','180'],
		Armor_Lower:['001','001_Dye01','001_Dye02','001_Dye03','001_Dye04','001_Dye05','001_Dye06','001_Dye07','001_Dye08','001_Dye09','001_Dye10','001_Dye11','001_Dye12','001_Dye13','001_Dye14','001_Dye15','005','005_Dye01','005_Dye02','005_Dye03','005_Dye04','005_Dye05','005_Dye06','005_Dye07','005_Dye08','005_Dye09','005_Dye10','005_Dye11','005_Dye12','005_Dye13','005_Dye14','005_Dye15','006','006_Dye01','006_Dye02','006_Dye03','006_Dye04','006_Dye05','006_Dye06','006_Dye07','006_Dye08','006_Dye09','006_Dye10','006_Dye11','006_Dye12','006_Dye13','006_Dye14','006_Dye15','008','008_Dye01','008_Dye02','008_Dye03','008_Dye04','008_Dye05','008_Dye06','008_Dye07','008_Dye08','008_Dye09','008_Dye10','008_Dye11','008_Dye12','008_Dye13','008_Dye14','008_Dye15','009','009_Dye01','009_Dye02','009_Dye03','009_Dye04','009_Dye05','009_Dye06','009_Dye07','009_Dye08','009_Dye09','009_Dye10','009_Dye11','009_Dye12','009_Dye13','009_Dye14','009_Dye15','011','011_Dye01','011_Dye02','011_Dye03','011_Dye04','011_Dye05','011_Dye06','011_Dye07','011_Dye08','011_Dye09','011_Dye10','011_Dye11','011_Dye12','011_Dye13','011_Dye14','011_Dye15','012','012_Dye01','012_Dye02','012_Dye03','012_Dye04','012_Dye05','012_Dye06','012_Dye07','012_Dye08','012_Dye09','012_Dye10','012_Dye11','012_Dye12','012_Dye13','012_Dye14','012_Dye15','014','014_Dye01','014_Dye02','014_Dye03','014_Dye04','014_Dye05','014_Dye06','014_Dye07','014_Dye08','014_Dye09','014_Dye10','014_Dye11','014_Dye12','014_Dye13','014_Dye14','014_Dye15','017','017_Dye01','017_Dye02','017_Dye03','017_Dye04','017_Dye05','017_Dye06','017_Dye07','017_Dye08','017_Dye09','017_Dye10','017_Dye11','017_Dye12','017_Dye13','017_Dye14','017_Dye15','020','020_Dye01','020_Dye02','020_Dye03','020_Dye04','020_Dye05','020_Dye06','020_Dye07','020_Dye08','020_Dye09','020_Dye10','020_Dye11','020_Dye12','020_Dye13','020_Dye14','020_Dye15','021','021_Dye01','021_Dye02','021_Dye03','021_Dye04','021_Dye05','021_Dye06','021_Dye07','021_Dye08','021_Dye09','021_Dye10','021_Dye11','021_Dye12','021_Dye13','021_Dye14','021_Dye15','043','043_Dye01','043_Dye02','043_Dye03','043_Dye04','043_Dye05','043_Dye06','043_Dye07','043_Dye08','043_Dye09','043_Dye10','043_Dye11','043_Dye12','043_Dye13','043_Dye14','043_Dye15','046','046_Dye01','046_Dye02','046_Dye03','046_Dye04','046_Dye05','046_Dye06','046_Dye07','046_Dye08','046_Dye09','046_Dye10','046_Dye11','046_Dye12','046_Dye13','046_Dye14','046_Dye15','048','048_Dye01','048_Dye02','048_Dye03','048_Dye04','048_Dye05','048_Dye06','048_Dye07','048_Dye08','048_Dye09','048_Dye10','048_Dye11','048_Dye12','048_Dye13','048_Dye14','048_Dye15','049','049_Dye01','049_Dye02','049_Dye03','049_Dye04','049_Dye05','049_Dye06','049_Dye07','049_Dye08','049_Dye09','049_Dye10','049_Dye11','049_Dye12','049_Dye13','049_Dye14','049_Dye15','053','053_Dye01','053_Dye02','053_Dye03','053_Dye04','053_Dye05','053_Dye06','053_Dye07','053_Dye08','053_Dye09','053_Dye10','053_Dye11','053_Dye12','053_Dye13','053_Dye14','053_Dye15','141','141_Dye01','141_Dye02','141_Dye03','141_Dye04','141_Dye05','141_Dye06','141_Dye07','141_Dye08','141_Dye09','141_Dye10','141_Dye11','141_Dye12','141_Dye13','141_Dye14','141_Dye15','160','200','205','210','215','225','230','171','174','185','179','180'],

		Item_Chilled:['01','02','03','04','05','06'],
		Item_ChilledFish:['01','02','03','04','05','06','07','08','09'],
		Item_Enemy:['00','01','02','03','04','05','06','07','08','12','13','14','15','16','17','18','19','20','21','24','25','26','27','28','29','30','31','32','33','34','38','39','40','41','42','43','44','45','46','47','48','49','50','51','52','53','54','55','56','57','Put_57'],
		Item_Material:['01','02','03','04','05','06','07','08'],
		Item_Meat:['01','02','06','07','11','12'],
		Item_Roast:['01','02','03','04','05','06','07','08','09','10','11','12','13','15','16','18','19','24','27','28','31','32','33','36','37','38','39','40','41','45','46','48','49','50','51','52','53'],
		Item_RoastFish:['01','02','03','04','07','09','11','13','15'],

		Item_FishGet:['A','B','C','D','E','F','G','H','I','J','K','L','M','X','Z'],
		Item_Fruit:['A','B','C','D','E','F','G','H','I','J','K','L'],
		Item_InsectGet:['A','AA','AB','B','C','E','F','G','H','I','K','M','N','O','P','Q','R','S','T','X','Z','NormalK','NormalO','NormalZ'],
		Item_MushroomGet:['A','B','C','D','E','F','H','J','L','M','N','O'],
		Item_Ore:['A','B','C','D','E','F','G','H','I','J'],
		Item_PlantGet:['A','B','C','E','F','G','H','I','J','L','M','O','Q'],

		Item_Cook:['A_01','A_02','A_03','A_04','A_05','A_07','A_08','A_09','A_10','A_11','A_12','A_13','A_14','B_01','B_02','B_05','B_06','B_11','B_12','B_13','B_15','B_16','B_17','B_18','B_19','B_20','B_21','B_22','B_23','C_16','C_17','C_17_Mod01','C_17_Mod02','C_17_Mod03','C_17_Mod04','C_17_Mod05','C_17_Mod06','C_17_Mod07','C_17_Mod08','C_17_Mod09','C_17_Mod10','D_01','D_02','D_03','D_04','D_05','D_06','D_07','D_08','D_09','D_10','E_01','E_02','E_03','E_04','F_01','F_02','F_03','F_04','G_02','G_03','G_04','G_05','G_06','G_09','G_10','G_11','G_12','G_13','G_14','G_15','G_16','G_17','H_01','H_02','H_03','I_01','I_02','I_03','I_04','I_05','I_06','I_07','I_08','I_09','I_10','I_11','I_12','I_13','I_14','I_15','I_16','I_17','J_01','J_02','J_03','J_04','J_05','J_06','J_07','J_08','J_09','K_01','K_02','K_03','K_04','K_05','K_06','K_07','K_08','K_09','L_01','L_02','L_03','L_04','L_05','M_01','N_01','N_02','N_03','N_04','O_01','O_02','P_01','P_02','P_03','P_04','P_05'],

		Weapon_Sword:['001','002','003','004','005','006','007','008','009','013','014','015','016','017','018','019','020','021','022','023','024','025','027','029','030','031','033','034','035','040','041','043','044','047','048','049','050','051','052','053','056','057','058','059','060','061','062','070','071','072','073','500','501','502'],
		Weapon_Lsword:['001','002','003','004','005','006','010','011','012','013','014','015','016','017','018','019','020','023','024','027','029','030','031','032','033','034','035','036','037','038','041','045','047','051','054','055','056','057','059','060','074'],
		Weapon_Spear:['001','002','003','004','005','006','007','008','009','010','011','012','013','014','015','016','017','018','021','022','023','024','025','027','028','029','030','031','032','033','034','035','036','037','038','047','049','050'],
		Weapon_Bow:['001','002','003','004','006','009','011','013','014','015','016','017','023','026','027','028','029','030','032','033','035','036','038','040','071','072'],
		Weapon_Shield:['001','002','003','004','005','006','007','008','009','013','014','015','016','017','018','021','022','023','025','026','030','031','032','033','034','035','036','037','038','040','041','042','057'],

		Other:['_none','Dye01','Dye02','Dye03','Dye04','Dye05','Dye06','Dye07','Dye08','Dye09','Dye10','Dye11','Dye12','Dye13','Dye14','Dye15','NormalArrow','FireArrow','IceArrow','ElectricArrow','BombArrow_A','AncientArrow','arrow_light','arrow_unknown','PictureBook00','PictureBook01','PictureBook02','PictureBook03','PictureBook04','PictureBook05','Obj_HeartUtuwa_A_01','Obj_StaminaUtuwa_A_01','GameRomHorseReins_00','GameRomHorseReins_01','GameRomHorseReins_02','GameRomHorseReins_03','GameRomHorseReins_04','GameRomHorseReins_05','GameRomHorseSaddle_00','GameRomHorseSaddle_01','GameRomHorseSaddle_02','GameRomHorseSaddle_03','GameRomHorseSaddle_04','GameRomHorseSaddle_05','Horse_Link_Mane','Horse_Link_Mane_01','Horse_Link_Mane_02','Horse_Link_Mane_03','Horse_Link_Mane_04','Horse_Link_Mane_05','Horse_Link_Mane_06','Horse_Link_Mane_07','Horse_Link_Mane_08','Horse_Link_Mane_09','BeeHome','Item_Boiled_01','Obj_FireWoodBundle','KeySmall','PutRupee','PutRupee_Blue','PutRupee_Gold','PutRupee_Purple','PutRupee_Red','PutRupee_Silver','Obj_DRStone_Get','PlayerStole2','Obj_KorokNuts','Obj_ProofKorok','Obj_Maracas','Obj_ProofBook','Obj_ProofGiantKiller','Obj_ProofGolemKiller','Obj_ProofSandwormKiller','Obj_Armor_115_Head','Obj_HeroSoul_Zora','Obj_HeroSoul_Gerudo','Obj_HeroSoul_Goron','Obj_HeroSoul_Rito',
		'Obj_WarpDLC',
		'Get_TwnObj_DLC_MemorialPicture_A_01','GameRomHorseReins_10','GameRomHorseSaddle_10','Obj_DLC_HeroSoul_Zora','Obj_DLC_HeroSoul_Gerudo','Obj_DLC_HeroSoul_Goron','Obj_DLC_HeroSoul_Rito'
		]
	}
	var REPEAT_ARMOR_ICONS_1=['002','003','004','015','035','039','060','061','007','062','063','064','040','065','066','067','036','071','072','073','037','074','075','076','042','077','078','079','083','084','085','086','087','088','089','090','095','096','097','098','099','100','101','102','117','118','119','120','121','122','123','124','125','126','127','128','129','130','131','132','133','134','135','136','137','138','139','140','103','104','105','106','111','112','113','114','152','153','154','155','148','149','150','151','156','157','158','159','201','202','203','204','206','207','208','209','211','212','213','214','216','217','218','219','221','222','223','224','226','227','228','229','231','232','233','234','186','187','188','189','190','191','192','193','194','195','196','197','198','199','168','169'];
	var REPEAT_ARMOR_ICONS_2=['001','005','006','008','009','011','012','014','017','020','021','024','025','026','027','028','029','046','048','049','116','141','200','205','210','215','220','225','230','181','182','183','184'];

	var loadedImages={};
	var pendingImages=23;
	var isLoaded=false;


	var canvas=document.createElement('canvas');
	canvas.width=ICON_SIZE;
	canvas.height=ICON_SIZE;
	return{
		startLoadingIcons:function(){
			if(!isLoaded){
				for(fileName in ICONS){
					loadedImages[fileName]=new Image();
					loadedImages[fileName].addEventListener('load', function(){
						pendingImages--;
						if(pendingImages===0){
							isLoaded=true;
							BOTW_Icons.refreshAllIcons();
						}
					}, false);
					loadedImages[fileName].src=IMG_PATH+fileName+'.png';
				}
			}
		},

		setIcon:function(el,itemNameId, dyeColor){
			if(isLoaded){
				if(dyeColor)
					el.src=this._getItemIcon(itemNameId, dyeColor);
				else
					el.src=this._getItemIcon(itemNameId);
			}else{
				el.nextSrc={id:itemNameId};
			}
		},

		refreshIcon:function(el){
		},

		refreshAllIcons:function(){
			var iconId=0;
			while(document.getElementById('icon'+iconId)){
				document.getElementById('icon'+iconId).src=this._getItemIcon(document.getElementById('icon'+iconId).nextSrc.id);
				iconId++;
			}
		},

		_getItemIcon(itemNameId, clothesColor){
			var fileName,id,match;
			if(match=itemNameId.match(/^Armor_([0-9]{3})_(Head|Upper|Lower)(_Dye[0-9]{2})?/)){
				fileName='Armor_'+match[2];
				id=match[1];
				/* add dye */
				/*if(match[3])
					id+=match[3];*/

				if(match[1]==='Lower' && id==='140'){
					id='141';
				}
				var index=REPEAT_ARMOR_ICONS_1.indexOf(id);
				if(index>=0){
					id=REPEAT_ARMOR_ICONS_2[parseInt(index/4)];
				}
			}else if(match=itemNameId.match(/^Item_(Chilled|ChilledFish|Enemy|Material|Meat|Roast|RoastFish)_([0-9]{2})/)){
				fileName='Item_'+match[1];
				id=match[2];
			}else if(itemNameId==='Item_Enemy_Put_57'){
				fileName='Item_Enemy';
				id='Put_57';
			}else if(match=itemNameId.replace('Animal_Insect_','Item_InsectGet_').replace('Mushroom_','MushroomGet_').replace('Plant_','PlantGet_').match(/^Item_(FishGet|Fruit|InsectGet|MushroomGet|Ore|PlantGet)_([A-Z][A-B]?)/)){
				fileName='Item_'+match[1];
				id=match[2];

				/* fix normal (non-get) crabs */
				if((id==='K' || id==='O' || id==='Z') && itemNameId.startsWith('Animal_Insect_'))
					id='Normal'+id;
			}else if(match=itemNameId.match(/^Item_Cook_([A-P]_[0-9]{2})/)){
				fileName='Item_Cook';
				id=match[1];
			}else if(match=itemNameId.match(/^Weapon_(Sword|Lsword|Spear|Bow|Shield)_([0-9]{3})/)){
				fileName='Weapon_'+match[1];
				id=match[2];
			}else{
				fileName='Other';
				id=itemNameId;
			}

			var icon=-1;
			if(fileName)
				icon=ICONS[fileName].indexOf(id);

			if(icon===-1){
				return this.getBlankIcon()
			}

			/* add dye */
			if(itemNameId.startsWith('Armor_') && clothesColor && clothesColor<=15){
				icon+=clothesColor;
			}

			if(isLoaded){
				var img=loadedImages[fileName];
				canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height);
				canvas.getContext('2d').drawImage(img, (icon%ICON_COLS)*ICON_SIZE, parseInt(icon/ICON_COLS)*ICON_SIZE, ICON_SIZE, ICON_SIZE, 0, 0, ICON_SIZE, ICON_SIZE);
				return canvas.toDataURL();
			}
		},

		getBlankIcon:function(){return './assets/_blank.png'},
	}
}());
SHOW DATABASES;

CREATE DATABASE RUNOOB;

DROP DATABASE RUNOOB;

USE RUNOOB;

CREATE TABLE runoob_tbl (
  runoob_id       INT          NOT NULL AUTO_INCREMENT,
  runoob_title    VARCHAR(100) NOT NULL,
  runoob_author   VARCHAR(40)  NOT NULL,
  submission_date DATE,
  PRIMARY KEY (runoob_id)
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8;

SHOW TABLES;

DESC runoob_tbl;

DROP TABLE runoob_tbl;

SELECT *
FROM runoob_tbl;

SELECT
  runoob_id,
  runoob_title,
  runoob_author,
  submission_date
FROM runoob_tbl;

SELECT
  runoob_id,
  runoob_title,
  runoob_author,
  submission_date
FROM runoob_tbl
WHERE runoob_author LIKE "%org" AND runoob_title LIKE "%了%";

SELECT *
FROM runoob_tbl
ORDER BY runoob_id DESC;

SELECT *
FROM runoob_tbl
ORDER BY runoob_id ASC;

SELECT
  runoob_id,
  runoob_title,
  runoob_author,
  submission_date
FROM runoob_tbl
WHERE runoob_author = "python.org" AND runoob_id > 2;

INSERT INTO runoob_tbl (runoob_title, runoob_author, submission_date) VALUES ('学习php', 'php.com', '2018-9-2');

UPDATE runoob_tbl
SET runoob_title = "学习c", runoob_title = "c.org"
WHERE runoob_id = 3;

DELETE FROM runoob_tbl
WHERE runoob_id = 6;


CREATE TABLE Websites (
  id      INT          NOT NULL AUTO_INCREMENT,
  name    VARCHAR(100) NOT NULL,
  url     VARCHAR(40)  NOT NULL,
  axexa   INT,
  country VARCHAR(40),
  PRIMARY KEY (id)
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8;

CREATE TABLE apps (
  id      INT          NOT NULL AUTO_INCREMENT,
  name    VARCHAR(100) NOT NULL,
  url     VARCHAR(40)  NOT NULL,
  country VARCHAR(40),
  PRIMARY KEY (id)
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8;

INSERT INTO Websites (name, url, axexa, country) VALUES ('Google', 'https://www.google.com/ ', 1, 'USA');
INSERT INTO Websites (name, url, axexa, country) VALUES ('淘宝', 'https://www.taobao.com/ ', 211, 'CN');
INSERT INTO Websites (name, url, axexa, country) VALUES ('菜鸟教程', 'https://www.runoob.com/ ', 211, 'CN');
INSERT INTO Websites (name, url, axexa, country) VALUES ('Facebook ', 'https://www.facebook.com/ ', 23111, 'USA');
INSERT INTO Websites (name, url, axexa, country) VALUES ('stackoverflow ', 'https://www.stackoverflow.com/ ', 0, 'IND');
INSERT INTO Websites (name, url, axexa, country) VALUES ('微博 ', 'https://www.weibo.com/ ', 0, 'CN');

INSERT INTO apps (name, url, country) VALUES ('qq', 'https://www.qq.com/', 'CN');
INSERT INTO apps (name, url, country) VALUES ('微博', 'https://www.weibo.com/', 'CN');
INSERT INTO apps (name, url, country) VALUES ('淘宝', 'https://www.taobao.com/', 'CN');

SELECT country
FROM Websites
UNION SELECT country
      FROM apps
ORDER BY country;

SELECT
  country,
  name
FROM Websites
WHERE country = "CN"
UNION ALL SELECT
            country,
            name
          FROM apps
          WHERE country = "CN"
ORDER BY country;


SET NAMES utf8;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for employee_tbl
-- ----------------------------
DROP TABLE IF EXISTS employee_tbl;
CREATE TABLE employee_tbl (
  id     int(11)    NOT NULL,
  name   char(10)   NOT NULL DEFAULT '',
  date   datetime   NOT NULL,
  singin tinyint(4) NOT NULL DEFAULT '0'
  COMMENT '登录次数',
  PRIMARY KEY (id)
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8;

-- ----------------------------
--  Records of employee_tbl
-- ----------------------------
BEGIN;
INSERT INTO employee_tbl VALUES ('1', '小明', '2016-04-22 15:25:33', '1'), ('2', '小王', '2016-04-20 15:25:47', '3'),
  ('3', '小丽', '2016-04-19 15:26:02', '2'), ('4', '小王', '2016-04-07 15:26:14', '4'),
  ('5', '小明', '2016-04-11 15:26:40', '4'), ('6', '小明', '2016-04-04 15:26:54', '2');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;


SELECT
  name,
  COUNT(*)
FROM employee_tbl
GROUP BY name;

CREATE TABLE dage (
  id INT(11) NOT NULL AUTO_INCREMENT,
  name VARCHAR(32) DEFAULT '',
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE xiaodi (
 id INT(11) NOT NULL AUTO_INCREMENT,
 dage_id INT(11) DEFAULT NULL,
 name varchar(32) DEFAULT '',
 PRIMARY KEY (id),
 KEY dage_id (dage_id),
 FOREIGN KEY (dage_id) REFERENCES dage (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO dage(name) VALUES ('铜锣湾');
INSERT INTO xiaodi(dage_id, name) values (1, '铜锣湾小弟');


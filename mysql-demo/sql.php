<?php

/**
 *********************************** 连接 MYSQL ***********************************
 */
$dbHost = '47.104.30.27';
$dbUser = 'root';
$dbPass = '123456';
$conn = mysqli_connect($dbHost, $dbUser, $dbPass);

if (!$conn) {
    die('连接错误：' . mysqli_error($conn));
}

echo '连接成功<br />';

/**
 *********************************** 创建数据库 ***********************************
 */
//$sql = 'CREATE DATABASE RUNOOB';
//$retval = mysqli_query($conn, $sql);
//
//if (!$retval) {
//    die('创建数据库失败：' . mysqli_error($conn));
//}
//
//echo '数据库 RUNOOB 创建成功';

/**
 *********************************** 删除数据库 ***********************************
 */
//$sql = 'DROP DATABASE RUNOOB';
//
//$retval = mysqli_query($conn, $sql);
//
//if (!$retval) {
//    die('删除数据库失败：'.mysqli_error($conn));
//}
//
//echo '数据库 RUNOOB 删除成功';

/**
 *********************************** 选择数据库 ***********************************
 */
mysqli_select_db($conn, "RUNOOB");

/**
 *********************************** 中文 ***********************************
 */
// 设置编码，防止中文乱码
mysqli_query($conn, "set names utf8");

/**
 *********************************** 创建数据表 ***********************************
 */
//$sql = "CREATE TABLE runoob_tbl(
//  runoob_id INT NOT NULL AUTO_INCREMENT,
//  runoob_title VARCHAR(100) NOT NULL,
//  runoob_author VARCHAR(40) NOT NULL,
//  submission_date DATE,
//  PRIMARY KEY (runoob_id)
//)ENGINE=InnoDB DEFAULT CHARSET=utf8;"; // ENGINE 设置存储引擎，CHARSET 设置编码
//$retval = mysqli_query($conn, $sql);
//
//if (!$retval) {
//    die("数据库连接失败：".mysqli_error($conn));
//}
//echo "数据表创建成功";

/**
 *********************************** 删除数据表 ***********************************
 */
//$sql = "DROP TABLE runoob_tbl";
//$retval = mysqli_query($conn, $sql);
//
//if (!$retval) {
//    die("数据库删除失败：".mysqli_error($conn));
//}
//echo "数据表删除成功";

/**
 *********************************** 插入数据 ***********************************
 */
//$sql = "INSERT INTO runoob_tbl (runoob_title, runoob_author, submission_date) VALUES ('学习python', 'python.org', '2018-9-2');";
//$retval = mysqli_query($conn, $sql);
//
//if (!$retval) {
//    die("数据插入失败：".mysqli_error($conn));
//}
//echo "数据插入成功";

/**
 *********************************** 修改数据 ***********************************
 */
//$sql = "UPDATE runoob_tbl SET runoob_title=\"学习c\", runoob_author=\"c.org\" WHERE runoob_id=3;";
//$retval = mysqli_query($conn, $sql);
//
//if (!$retval) {
//    die("无法更新：".mysqli_error($conn));
//}
//echo "数据更新成功";

/**
 *********************************** 删除数据 ***********************************
 */
//$sql = "DELETE FROM runoob_tbl WHERE runoob_id=6;";
//$retval = mysqli_query($conn, $sql);
//
//if (!$retval) {
//    die("无法删除：".mysqli_error($conn));
//}
//echo "删除成功";

/**
 *********************************** 查询数据 ***********************************
 */
//$sql = "SELECT runoob_id, runoob_title, runoob_author, submission_date FROM runoob_tbl;";
//$sql = "SELECT runoob_id, runoob_title, runoob_author, submission_date FROM runoob_tbl WHERE runoob_author=\"python.org\" AND runoob_id > 2;";
$sql = "SELECT runoob_id, runoob_title, runoob_author, submission_date FROM runoob_tbl WHERE runoob_author LIKE \"%org\" AND runoob_title LIKE \"%了%\";";
$retval = mysqli_query($conn, $sql);

if (!$retval) {
    die("无法读取数据：" . mysqli_error($conn));
}

echo "<h2>数据表 runoob_tbl</h2>";
echo '<table border="1">
    <thead>
    <tr>
        <td>ID</td>
        <td>标题</td>
        <td>作者</td>
        <td>时间</td>
    </tr>
    </thead>
    <tbody>';
while ($row = mysqli_fetch_array($retval, MYSQLI_ASSOC)) {
    echo " <tr>
        <td>{$row['runoob_id']}</td>
        <td>{$row['runoob_title']}</td>
        <td>{$row['runoob_author']}</td>
        <td>{$row['submission_date']}</td>
    </tr>";
}

echo "</tbody></table>";

/**
 *********************************** 释放内存 ***********************************
 */
mysqli_free_result($retval);

/**
 *********************************** 关闭 MYSQL ***********************************
 */
mysqli_close($conn);


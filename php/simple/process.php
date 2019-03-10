<?php

session_start();

$mysqli = new mysqli('localhost', 'root', 'root', 'cardb', 8889) or die($mysqli);

$id = '';
$name = '';
$age = '';
$update = false;


if (isset($_POST['save'])) {
    $name = $_POST['name'];
    $age = $_POST['age'];

    $mysqli->query("INSERT INTO data (name, age) VALUES ('$name', $age)") or die($mysqli->error);
    $mysqli->close();

    $_SESSION['message'] = 'created !!!';

    header('Location: index.php');

}

if (isset($_GET['delete'])) {
    $id = $_GET['delete'];


    $mysqli->query("DELETE FROM data WHERE id=$id") or die($mysqli->error);
    $mysqli->close();

    $_SESSION['message'] = 'deleted !!!';

    header('Location: index.php');
}

if (isset($_GET['edit'])) {
    $update = true;
    $id = $_GET['edit'];

    $result = $mysqli->query("SELECT * FROM data WHERE id=$id") or die($mysqli->error);
    $mysqli->close();

    $row = $result->fetch_array();
    $id = $row['id'];
    $name = $row['name'];
    $age = $row['age'];

}


if (isset($_POST['update'])) {
    $id = $_POST['id'];
    $name = $_POST['name'];
    $age = $_POST['age'];
    echo "UPDATE data SET name='$name', age=$age WHERE id=$id";

    $mysqli->query("UPDATE data SET name='$name', age=$age WHERE id=$id") or die($mysqli->error);
    $mysqli->close();

    $_SESSION['message'] = 'updated !!!';

    header('Location: index.php');

}
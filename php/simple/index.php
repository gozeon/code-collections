<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
<?php
require_once('process.php')
?>

<?php
if (isset($_SESSION['message'])):
    ?>
    <p>
        <?php
        echo $_SESSION['message'];
        unset($_SESSION['message']);
        ?>
    </p>
<?php
endif;
?>

<?php
$mysqli = new mysqli('localhost', 'root', 'root', 'cardb', 8889) or die($mysqli);
$result = $mysqli->query('SELECT * FROM data') or die($mysqli->error);
$mysqli->close();

function pre_r($array)
{
    echo '<pre>';
    print_r($array);
    echo '</pre>';
}

?>

<ul>
    <?php
    while ($row = $result->fetch_assoc()):
        ?>
        <li>
            <span><?php echo $row['id'] ?></span>
            <span><?php echo $row['name'] ?></span>
            <span><?php echo $row['age'] ?></span>

            <a href="index.php?edit=<?php echo $row['id'] ?>">Edit</a>
            <a href="process.php?delete=<?php echo $row['id'] ?>">Delete</a>
        </li>
    <?php
    endwhile;
    ?>
</ul>

<form action="process.php" method="POST">
    <input type="hidden" name="id" value="<?php echo $id?>">
    <lable>姓名:</lable>
    <input type="text" name="name" value="<?php echo $name ?>"><br/>

    <lable>年龄:</lable>
    <input type="text" name="age" value="<?php echo $age ?>"><br/>

    <br/>
    <?php
    if ($update):
        ?>
        <button type="submit" name="update">Update</button>
    <?php
    else:
        ?>
        <button type="submit" name="save">Save</button>
    <?php
    endif;
    ?>

</form>

</body>
</html>
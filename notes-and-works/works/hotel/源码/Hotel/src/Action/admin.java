package Action;

import java.sql.ResultSet;

import DAO.Dao;

public class admin {

	/**
	 * @param args
	 */
	public String adminUser;
	public String adminPassword;
///////////////////////////////////////////////////////////////////	
	//添加管理员
	public void addUser(String sql){
		Dao dao = new Dao();
		dao.OpenConnection();
		dao.ExecuteUpdate(sql);
		dao.CloseConnection();
	}
	//删除管理员
	public void deleteUser(String sql) {
		Dao dao = new Dao();
		dao.OpenConnection();
		dao.ExecuteUpdate(sql);
		dao.CloseConnection();
	}
	//修改用户名-管理员
	public void updateUser(String sql) {
		Dao dao = new Dao();
		dao.OpenConnection();
		dao.ExecuteUpdate(sql);
		dao.CloseConnection();
	}
	//修改密码-管理员
	public void updatePassword(String sql) {
		Dao dao = new Dao();
		dao.OpenConnection();
		dao.ExecuteUpdate(sql);
		dao.CloseConnection();
	}
///////////////////////////////////////////////////////////////////	
	//增加客户
	public void addClient(String sql) {
		Dao dao = new Dao();
		dao.OpenConnection();
		dao.ExecuteUpdate(sql);
		dao.CloseConnection();
	}
	//删除客户
	public void deleteClient(String sql) {
		Dao dao = new Dao();
		dao.OpenConnection();
		dao.ExecuteUpdate(sql);
		dao.CloseConnection();
	}
	//查询用户
	public ResultSet selectClient(String sql) {
		ResultSet rs=null;
		Dao dao = new Dao();
		dao.OpenConnection();
		rs=dao.ExecuteQuery(sql);
		return rs; 
	}
	//修改用户
	public void updateClient(String sql) {
		Dao dao = new Dao();
		dao.OpenConnection();
		dao.ExecuteUpdate(sql);
		dao.CloseConnection();
	}
///////////////////////////////////////////////////////////////////
	//查询订单
	public ResultSet selectOrder(String sql) {
		ResultSet rs=null;
		Dao dao = new Dao();
		dao.OpenConnection();
		rs=dao.ExecuteQuery(sql);
		return rs; 
	}
	//修改订单
	public void updateOrder(String sql) {
		Dao dao = new Dao();
		dao.OpenConnection();
		dao.ExecuteUpdate(sql);
		dao.CloseConnection();
	}
	//删除订单
	public void deleteOrder(String sql) {
		Dao dao = new Dao();
		dao.OpenConnection();
		dao.ExecuteUpdate(sql);
		dao.CloseConnection();
	}
	//添加订单
	public void addOrder(String sql) {
		Dao dao = new Dao();
		dao.OpenConnection();
		dao.ExecuteUpdate(sql);
	}
///////////////////////////////////////////////////////////////////	
	//添加房间
	public void addRoom(String sql) {
		Dao dao = new Dao();
		dao.OpenConnection();
		dao.ExecuteUpdate(sql);
		dao.CloseConnection();
	}
	//删除房间
	public void deleteRoom(String sql) {
		Dao dao = new Dao();
		dao.OpenConnection();
		dao.ExecuteUpdate(sql);
		dao.CloseConnection();
	}
	//修改房间信息
	public void updateRoom(String sql) {
		Dao dao = new Dao();
		dao.OpenConnection();
		dao.ExecuteUpdate(sql);
		dao.CloseConnection();
	}
	//查询房间信息
	public ResultSet selectRoom(String sql) {
		ResultSet rs=null;
		Dao dao = new Dao();
		dao.OpenConnection();
		rs=dao.ExecuteQuery(sql);
		return rs; 
	}
}

package GUI;

import java.sql.ResultSet;
import java.sql.SQLException;

import DAO.Dao;

public class SelectColor {

	/**
	 * @param args
	 */
	public SelectColor() {
		
	}
	////////////////////////////////
	public String SSColor(String num){
		String state = "";
		String sql="select ro_state from tb_room where ro_id='"+num+"';";
		Dao dao = new Dao();
		dao.OpenConnection();
		ResultSet rs=dao.ExecuteQuery(sql);
		try {
			while(rs.next()){
				state=rs.getString(1);
			}
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return state;
	}
	////////////////////////////////
	public static void main(String[] args) {
		// TODO Auto-generated method stub

	}

}

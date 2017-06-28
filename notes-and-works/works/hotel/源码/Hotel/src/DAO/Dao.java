package DAO;

import java.sql.*;
import java.util.*;
import java.awt.*;
import java.awt.event.*;
import java.awt.*;

import javax.swing.JComboBox;
import javax.swing.JFrame;
public class Dao {
	Connection con;
	Statement sql;
	ResultSet rs;
	 //打开连接
	  public boolean OpenConnection()
	  {
	   boolean mResult=true;
	   try
	   {
		    String url = "sun.jdbc.odbc.JdbcOdbcDriver";
			Class.forName(url);
			con = DriverManager.getConnection("jdbc:odbc:dao", "", "");
	
	    sql=con.createStatement();
	     mResult=true;
	   }
	   catch(Exception e)
	   {
	     System.out.println(e.toString());
	     mResult=false;
	   }
	   return (mResult);
	  }

	  //关闭数据库连接
	  public void CloseConnection()
	  {
	   try
	   {
	     sql.close();
	     con.close();
	   }
	   catch(Exception e)
	   {
	     System.out.println(e.toString());
	   }
	  }
	  //查询
	  public ResultSet ExecuteQuery(String SqlString)
	  {
	    ResultSet result=null;
	    try
	    {
	      result=sql.executeQuery(SqlString);
	    }
	    catch(Exception e)
	    {
	      System.out.println(e.toString());
	    }
	    return (result);
	  }

	//数据更新(增、删、改)
	  public int ExecuteUpdate(String SqlString)
	  {
	    int result=0;
	    try
	    {
	      result=sql.executeUpdate(SqlString);
	    }
	    catch(Exception e)
	    {
	      System.out.println(e.toString());
	    }
	    return (result);
	  }

		//public String getStr(String stzd,String tablezd,String tjzd,String tj) 
	  /*public String getStr(String stzd,String tablezd,String tj) 
		{
              String name="";
			String condition="SELECT "+stzd+" FROM "+tablezd+" WHERE "+tj;
			OpenConnection();
			rs = ExecuteQuery(condition);	
			try{
				while (rs.next()) 
			{
				name =(String)rs.getString(1);
					//name=(String)rs.get
				 return name;
				//list.add(name);
			}

			 CloseConnection();
		} catch (SQLException e) {
			System.out.println(e);
		}

			
			//return name;
		}
*/
	  public LinkedList getList(String listzd,String tablezd) {
			LinkedList list = new LinkedList();
			String condition = "SELECT "+listzd+" FROM "+tablezd;
			OpenConnection();
			rs = ExecuteQuery(condition);	
			try{
				while (rs.next()) 
			{
				String name = rs.getString(1);
				list.add(name);
			}

			 CloseConnection();
		} catch (SQLException e) {
			System.out.println(e);
		}

			
			return list;
		}
	/*public LinkedList getList(String listzd,String tablezd) {
		LinkedList list = new LinkedList();
		//String condition = "SELECT "+a+" FROM "+b+" where qlyname='"+listzd+"'and glymm='"+tablezd+"'";
		String condition = "SELECT qlyid FROM Guanliyuan where qlyname='"+listzd+"'and glymm='"+tablezd+"'";
		OpenConnection();
		rs = ExecuteQuery(condition);
		try{
			while (rs.next()) 
		{
			String name = rs.getString(1);
			list.add(name);
		}

		 CloseConnection();
	} catch (SQLException e) {
		System.out.println(e);
	}

		
		return list;
	}*/
	  public LinkedList slygetList1(String a) {
			LinkedList list = new LinkedList();
			//String condition = "SELECT "+a+" FROM "+b+" where qlyname='"+listzd+"'and glymm='"+tablezd+"'";
			String condition = a;
			OpenConnection();
			rs = ExecuteQuery(condition);
			try{
				while (rs.next()) 
			{
				String id = rs.getString(1);
			    String name = rs.getString(2);
				String xb = rs.getString(3);
				String birth = rs.getString(4);
				String adress = rs.getString(5);
				String tel = rs.getString(6);
				String mm = rs.getString(7);
				String free=rs.getString(8);
				list.add(id);
				list.add("/");
				list.add(mm);
				list.add("/");
				list.add(name);
				list.add("/");
				list.add(xb);
				list.add("/");
				list.add(birth);
				list.add("/");
				
				list.add(tel);
				list.add("/");
				list.add(adress);
				list.add("/");
				list.add(free);
				
				list.add("\n");
				
			}

			 CloseConnection();
		} catch (SQLException e) {
			System.out.println(e);
		}

			
			return list;
		}
	////////////////////管理员//////////////////////////////////////////
	public LinkedList ylfgetList1(String a) {
		LinkedList list = new LinkedList();
		//String condition = "SELECT "+a+" FROM "+b+" where qlyname='"+listzd+"'and glymm='"+tablezd+"'";
		String condition = a;
		OpenConnection();
		rs = ExecuteQuery(condition);
		try{
			while (rs.next()) 
		{
			String id = rs.getString(1);
			String mm = rs.getString(2);
			String xb = rs.getString(3);
			String name = rs.getString(4);
			String adress = rs.getString(5);
			String tel = rs.getString(6);
			//list.add("\n");
			list.add(id);
			list.add("/");
			list.add(mm);
			list.add("/");
			list.add(xb);
			list.add("/");
			list.add(name);
			list.add("/");
			list.add(adress);
			list.add("/");
			list.add(tel);
			list.add("\n");
			
		}

		 CloseConnection();
	} catch (SQLException e) {
		System.out.println(e);
	}

		
		return list;
	}
	/////////////查询最后一条语句///////////////
	public  String ylfgetList2(String a) {
		//LinkedList list = new LinkedList();
		//String condition = "SELECT "+a+" FROM "+b+" where qlyname='"+listzd+"'and glymm='"+tablezd+"'";
		String condition = a;
		String id = null;
		OpenConnection();
		rs = ExecuteQuery(condition);
		int ss = 0,kk=0;
		try{
	        while (rs.next()) {
	        	ss++;
	        }
		}
	        catch (SQLException e) {
	    		System.out.println(e);
	        }
	    		CloseConnection();
	    		OpenConnection();
	    		rs = ExecuteQuery(condition);
	        try{
	        while (rs.next()) {
	        	kk++;
	          
            if(kk==ss){
            	
			 id = rs.getString(1); 
		
			//list.add("\n");
			
            }}
	       // System.out.print(kk);
        	//System.out.print(ss);
		 CloseConnection();
	} catch (SQLException e) {
		System.out.println(e);
	}

		
		return id;
	}
	//
	public LinkedList ylfgetList3(String condition) {
		LinkedList list = new LinkedList();
		//String condition = "SELECT "+a+" FROM "+b+" where qlyname='"+listzd+"'and glymm='"+tablezd+"'";
		//String condition = "SELECT qlyid FROM Guanliyuan where qlyname='"+listzd+"'and glymm='"+tablezd+"'";
		OpenConnection();
		rs = ExecuteQuery(condition);
		
		try{
			while (rs.next()) 
		{
			String id = rs.getString(1);
			list.add(id);
		}

		 CloseConnection();
	} catch (SQLException e) {
		System.out.println(e);
	}

		
		return list;
	}
	//返回某一链表值形成的下拉列表
	public JComboBox getCombox(LinkedList list)
	{
		JComboBox  combox=new JComboBox();
		for(int i=0;i<list.size();i++)
		{combox.addItem(list.get(i));}
		return combox;
		
	}
	
	//得到对应某个SQL语句运行后结果集的总行数
	public int getRowSum(String sql)
	
	{
		int rownum=0;
		OpenConnection();
		rs = ExecuteQuery(sql);
		
		
		try{
			while (rs.next()) 
		{
			//String name = rs.getString(1);
			//list.add(name);
				rownum++;
		}

		 CloseConnection();
	} catch (SQLException e) {
		System.out.println(e);
	}
		return rownum;
	}
	
//通过参数SQL语句把所得结果集转化成二维数组返回
	public Object[][] getErArray(int rownum,String sql)
	{
	
		Object[][] str = null;
	OpenConnection();
	rs = ExecuteQuery(sql);
	try{
		str=new Object[rownum][rs.getMetaData().getColumnCount()];
		
		for(int i=1;rs.next();i++)
		{
			
			for(int j=0;j<rs.getMetaData().getColumnCount();j++)
			{
		
				str[i-1][j]=(Object)rs.getString(j+1);
	
			}
		
        }
     CloseConnection();
    
       } 
	catch (SQLException e) 
	{
	System.out.println(e);
     }
	return str;		
	}
	//根据参数表名得到相应表列名的数组
	public Object[] getItemName(String biaoname)
	{
	
		Object[] item = null;
	if(biaoname.equals("CanguanBiao"))
	{
		//Object[] name={"餐馆编号","餐馆名称","餐馆电话","餐馆地址","餐馆负责人","餐馆密码"};
		Object[] name={"餐馆编号","餐馆名称","餐馆电话","餐馆地址","餐馆负责人","餐馆密码"};
		item=name;
		//return name;
	}
	else if(biaoname.equals("DemoBiao"))
	{
		Object[] name={"餐馆编号","菜单编号","菜单名称","菜单单价"};
		item=name;
		//return name;
	}
	else if(biaoname.equals("KehuBiao"))
	{
		Object[] name={"客户编号","客户名字","客户性别","客户电话"};
		item=name;
		//return name;
	}
	else if(biaoname.equals("DingdanBiao"))
	{
		Object[] name={"订单编号","客户编号","司机编号","菜单编号","订餐数量"};
		item=name;
		//return name;
	}
	else if(biaoname.equals("DdzhifuBiao"))
	{
		Object[] name={"账单编号","账单名称","支付方式","支付金额"};
		item=name;
		//return name;
	}
	else if(biaoname.equals("DriverBiao"))
	{
		Object[] name={"司机编号","司机姓名","司机性别","出生日期","司机电话","司机地址"};
		item=name;
		//return name;
	}
	return item;
	}

	//获取新编号 
	public String ylfgetNewID(LinkedList list)
	{
		String id=(String)list.getLast();
		//String temp=id.substring(2);	
		int oldindex=Integer.parseInt(id);
		int newindex=oldindex+1;
		//String newid=id.substring(0,2)+String.valueOf(newindex);
		String newid=String.valueOf(newindex);
		return newid;	
	}
	//判断某一编号在不在数据库内 
	public boolean equalID(String str,LinkedList list)
	{
		boolean flag=false;
		for(int i=0;i<list.size();i++)
		{
			String temp=(String)list.get(i);
			if(str.equals(temp))
			{
				flag=true;
				}
			else
			{
				flag=false;
				
				}
			
		}
		
		return flag;	

	}
//判断某一字段值超没超出数据库设定范围
	public boolean dbEqual(String str,int index)
	{
		boolean flag=false;
		if(str.length()<=index)
		{flag=true;}
		else
		{flag=false;}
		return flag;
		
	}
//马佳敏
	//把数据库中的某一字段值传给链表（字段值，表名）
	  public LinkedList mjmgetList(String listzd,String tablezd) {
			LinkedList list = new LinkedList();
			String condition = "SELECT "+listzd+" FROM "+tablezd;
			OpenConnection();
			rs = ExecuteQuery(condition);	
			try{
				while (rs.next()) 
			{
				String name = rs.getString(1);
				list.add(name);
			}

			 CloseConnection();
		} catch (SQLException e) {
			System.out.println(e);
		}

			
			return list;
		}
			  
	  ////////////////////订单//////////////////////////////////////////
	public LinkedList mjmgetList1(String a) {
		LinkedList list = new LinkedList();
		//String condition = "SELECT "+a+" FROM "+b+" where qlyname='"+listzd+"'and glymm='"+tablezd+"'";
		String condition = a;
		OpenConnection();
		rs = ExecuteQuery(condition);
		try{
			while (rs.next()) 
		{
			String id = rs.getString(1);
			String mm = rs.getString(2);
			String xb = rs.getString(3);
			String name = rs.getString(4);
			String adress = rs.getString(5);
			//String tel = rs.getString(6);
			//list.add("\n");
			list.add(id);
			list.add("/");
			list.add(mm);
			list.add("/");
			list.add(xb);
			list.add("/");
			list.add(name);
			list.add("/");
			list.add(adress);
			list.add("/");
//			list.add(tel);
		list.add("\n");
			
		}

		 CloseConnection();
	} catch (SQLException e) {
		System.out.println(e);
	}

		
		return list;
	}
	 ////////////////////订单2//////////////////////////////////////////
	public LinkedList mjmgetList2(String a) {
		LinkedList list = new LinkedList();
		//String condition = "SELECT "+a+" FROM "+b+" where qlyname='"+listzd+"'and glymm='"+tablezd+"'";
		String condition = a;
		OpenConnection();
		rs = ExecuteQuery(condition);
		try{
			while (rs.next()) 
		{
			String id = rs.getString(1);
			String mm = rs.getString(2);
			String xb = rs.getString(3);
			String name = rs.getString(4);
			String adress = rs.getString(5);
			String tel = rs.getString(6);
			//list.add("\n");
			list.add(id);
			list.add("/");
			list.add(mm);
			list.add("/");
			list.add(xb);
			list.add("/");
			list.add(name);
			list.add("/");
			list.add(adress);
			list.add("/");
			list.add(tel);
		list.add("\n");
			
		}

		 CloseConnection();
	} catch (SQLException e) {
		System.out.println(e);
	}

		
		return list;
	}
//
	//更改某表中某一字段的值
	public void mjmgetUpdate(String biaoname,String zdname,String zdvalue,String idname,String idvalue)
	{
		String sql="update "+biaoname+" set "+zdname+"='"+zdvalue+"' where "+idname+"='"+idvalue+"';";
		OpenConnection();
		ExecuteUpdate(sql);	
	    CloseConnection();
	}
	
public double mjmDzqty(double a,int b)
{
	double dzqty=0.0;
	dzqty=a*b;
	return dzqty;
}
	/////////////////////////////////////////
	public LinkedList cmlList1(String a) {
		LinkedList list = new LinkedList();
		//String condition = "SELECT "+a+" FROM "+b+" where qlyname='"+listzd+"'and glymm='"+tablezd+"'";
		String condition = a;
		OpenConnection();
		rs = ExecuteQuery(condition);
		try{
			while (rs.next()) 
		{
			String id = rs.getString(1);
			String mm = rs.getString(2);
			String xb = rs.getString(3);
			String name = rs.getString(4);
			String name1 = rs.getString(5);
			String name2 = rs.getString(6);
			list.add(id);
			list.add("\u0008");
			//list.add("/");
			list.add(mm);
			list.add("\u0008");
			//list.add("/");
			list.add(xb);
			
			list.add("\u0008");
			//list.add("/");
			list.add(name);
			list.add("\u0008");
			list.add(name1);
			list.add("\u0008");
			list.add(name2);
			list.add("\u0008");
			//list.add("/");
		    list.add("\n");
			
		}

		 CloseConnection();
	} catch (SQLException e) {
		System.out.println(e);
	}

		
		return list;
	}
	///////////////王永生////////////////////////
	public LinkedList wysyhList1(String a) {
		LinkedList list = new LinkedList();
		//String condition = "SELECT "+a+" FROM "+b+" where qlyname='"+listzd+"'and glymm='"+tablezd+"'";
		String id=null;
		String condition = a;
		OpenConnection();
		rs = ExecuteQuery(condition);
		try{
			while (rs.next()) 
		{
			 id = rs.getString(1);						
			list.add(id);
		  //list.add("\n");
			
		}

		CloseConnection();
		} catch (SQLException e) {
		System.out.println(e);
		}

		//return id;
		return list;
		}

	public Object[][] wysgetErArray(int rownum,String sql)
	{

	Object[][] str = null;
	OpenConnection();
	rs = ExecuteQuery(sql);
	try{
	str=new Object[rownum][rs.getMetaData().getColumnCount()+1];

	for(int i=1;rs.next();i++)
	{
		
		for(int j=0;j<rs.getMetaData().getColumnCount();j++)
		{

			str[i-1][j]=(Object)rs.getString(j+1);

		}
		str[i-1][rs.getMetaData().getColumnCount()]="";
	}
	CloseConnection();

	} 
	catch (SQLException e) 
	{
	System.out.println(e);
	}
	return str;		
	}
	public LinkedList wysList1(String a) {
		LinkedList list = new LinkedList();
		//String condition = "SELECT "+a+" FROM "+b+" where qlyname='"+listzd+"'and glymm='"+tablezd+"'";
		String condition = a;
		OpenConnection();
		rs = ExecuteQuery(condition);
		try{
			while (rs.next()) 
		{
			String id = rs.getString(1);
			String mm = rs.getString(2);
			String xb = rs.getString(3);
			String name = rs.getString(4);						
			list.add(id);
			list.add("\u0008");
			//list.add("/");
			list.add(mm);
			list.add("\u0008");
			//list.add("/");
			list.add(xb);
			list.add("元");
			list.add("\u0008");
			//list.add("/");
			list.add(name);
			list.add("\u0008");
			//list.add("/");
		    list.add("\n");
			
		}

		 CloseConnection();
	} catch (SQLException e) {
		System.out.println(e);
	}

		
		return list;
	}
	public  String wysgetList2(String a) {
		//LinkedList list = new LinkedList();
		//String condition = "SELECT "+a+" FROM "+b+" where qlyname='"+listzd+"'and glymm='"+tablezd+"'";
		String condition = a;
		String id = null;
		OpenConnection();
		rs = ExecuteQuery(condition);
		int ss = 0,kk=0;
		try{
	        while (rs.next()) {
	        	ss++;
	        }
		}
	        catch (SQLException e) {
	    		System.out.println(e);
	        }
	    		CloseConnection();
	    		OpenConnection();
	    		rs = ExecuteQuery(condition);
	        try{
	        while (rs.next()) {
	        	kk++;
	          
            if(kk==ss){
            	
			 id = rs.getString(1); 
		
			//list.add("\n");
			
            }}
	       // System.out.print(kk);
        	//System.out.print(ss);
		 CloseConnection();
	} catch (SQLException e) {
		System.out.println(e);
	}

		
		return id;
	}
	//////////////////////////////////////
	//
	//获取新编号 
	public String mjmgetNewID(LinkedList list)
	{
		String id=(String)list.getLast();
		//String temp=id.substring(2);	
		int oldindex=Integer.parseInt(id);
		int newindex=oldindex+1;
		//String newid=id.substring(0,2)+String.valueOf(newindex);
		String newid=String.valueOf(newindex);
		return newid;	
	}
	//根据某一字段值获取该字段的id值（id名，表名，字段名，字段值）
	public String mjmgetID (String idname,String biaoname,String zdname,String zdvalue){
		String id=null;
		OpenConnection();
		rs = ExecuteQuery("select "+idname+" from "+biaoname+" where "+zdname+"='"+zdvalue+"'");
		
		
		
		try{
			while (rs.next()) 
		{
			 id = rs.getString(1);
			//list.add(name);
				
		}

		 CloseConnection();
	} catch (SQLException e) {
		System.out.println(e);
	}
		return id;
	}
		

//根据sql语句查询id值
	public String slygetID (String sql){
		String id=null;
		OpenConnection();
		rs = ExecuteQuery(sql);
		
		
		
		try{
			while (rs.next()) 
		{
			 id = rs.getString(1);
			//list.add(name);
				
		}

		 CloseConnection();
	} catch (SQLException e) {
		System.out.println(e);
	}
		return id;
	}
	
	
	
}

	/*public Object link(String string) {
		// TODO Auto-generated method stub
		OpenConnection();
		//rs = ExecuteQuery(condition);
		rs =sql.executeQuery("select * from Guanliyuan");
		rs.last();
		int rows=rs.getRow();
		System.out.println("Guanliyuan表共有"+rows+"条记录");
		rs.afterLast();
		System.out.println("倒序输出Guanliyuan表中的记录");
		try{
			while (rs.previous()) 
		{
			String id = rs.getString(1);
			String mm = rs.getString(2);
			String xb = rs.getString(3);
			String name = rs.getString(4);
			String adress = rs.getString(5);
			String tel = rs.getString(6);
			System.out.printf("%-4s",id);
			System.out.printf("%-4s",mm);
			System.out.printf("%-4s",name);
			System.out.printf("%-4s",xb);
			System.out.printf("%-4s",adress);
			System.out.printf("%-4s",tel);
		}

		 CloseConnection();
	} 
	catch (SQLException e) {
		System.out.println(e);
	}
		//return list;

	
	//	return null;
	}
}
*/

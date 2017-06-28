package GUI;

import java.awt.BorderLayout;
import java.awt.EventQueue;

import javax.swing.JFrame;
import javax.swing.JPanel;
import javax.swing.border.EmptyBorder;
import javax.swing.JButton;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JTextField;
import javax.swing.SwingConstants;

import DAO.Dao;

import java.awt.event.ActionListener;
import java.awt.event.ActionEvent;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.awt.Font;
import javax.swing.JPasswordField;
import java.awt.Toolkit;
import javax.swing.ImageIcon;

public class login extends JFrame {

	private JPanel contentPane;
	private JTextField txt_user;
	private JPasswordField txt_paw;

	/**
	 * Launch the application.
	 */
	public static void main(String[] args) {
		EventQueue.invokeLater(new Runnable() {
			public void run() {
				try {
					login frame = new login();
					frame.setLocationRelativeTo(null);  //让窗体居中显示
					frame.setVisible(true);
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		});
	}

	/**
	 * Create the frame.
	 */
	public login() {
		setIconImage(Toolkit.getDefaultToolkit().getImage(login.class.getResource("/Image/00.PNG")));
		setTitle("\u767B\u9646");
		setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		setBounds(100, 100, 450, 300);
		contentPane = new JPanel();
		contentPane.setBorder(new EmptyBorder(5, 5, 5, 5));
		setContentPane(contentPane);
		contentPane.setLayout(null);
		
		JButton btn_login = new JButton("\u767B\u5F55");
		btn_login.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				//登录按钮
				String sql="";
				String tbpaw ="";   //存储数据库搜索结果
				String user = txt_user.getText();
				String paw = txt_paw.getText();
				ResultSet rs;
				
//				System.out.print(user+paw);
				Dao dao = new Dao();  //调用Dao，打开数据库
				dao.OpenConnection(); //打开数据库
				sql="select password from tb_admin where user = ";
//				user=user.toUpperCase(); //转换为大写
				sql=sql+"'"+user+"'";
//				System.out.print(sql);
				rs = dao.ExecuteQuery(sql);  //执行语句

/*				try {
					while(rs.next()) {
						
						String stuName = rs.getString(1);
						System.out.print(stuName);

					}
				} catch (SQLException ee) {
					// TODO Auto-generated catch block
					ee.printStackTrace();
				}*/
				if(user.equals("")){ //text-用户名为空
					JOptionPane.showMessageDialog(null, "请输入用户名！", "错误信息",  JOptionPane.ERROR_MESSAGE);
				}else if(paw.equals("")){ //text-密码为空
					JOptionPane.showMessageDialog(null, "请输入密码！", "错误信息", JOptionPane.ERROR_MESSAGE);
				} else {
					try { //获取搜索结果
						while(rs.next()){
	//						System.out.print(rs.getString(1));
							    tbpaw  =rs.getString(1);
								//System.out.print(tbpaw);
								
/*							else {
								JOptionPane.showMessageDialog(null, "密码不正确！", "错误信息", JOptionPane.ERROR_MESSAGE);
							}*/
						}
						
//						System.out.print(tbpaw+paw);
						if (tbpaw.equals(paw)) {  //判断密码的正确性
							main mm = new main(user);  //初始化主窗口界面
							mm.setLocationRelativeTo(null);  //让窗口居中显示
							mm.setVisible(true);   //显示主窗口界面
							dispose();   //关闭登录界面
						}else{
							JOptionPane.showMessageDialog(null, "密码不正确！", "错误信息", JOptionPane.ERROR_MESSAGE);
						}
						
					} catch (SQLException e1) {
						// TODO Auto-generated catch block
						e1.printStackTrace();
					}
				}
			}
		});
		btn_login.setBounds(102, 210, 93, 23);
		contentPane.add(btn_login);
		
		JButton btn_cancle = new JButton("\u53D6\u6D88");
		btn_cancle.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				//返回按钮
				dispose();   //关闭界面
			}
		});
		btn_cancle.setBounds(252, 210, 93, 23);
		contentPane.add(btn_cancle);
		
		JLabel lbl_user = new JLabel("\u8D26\u53F7\uFF1A");
		lbl_user.setBounds(102, 92, 54, 15);
		contentPane.add(lbl_user);
		
		txt_user = new JTextField();
		txt_user.setBounds(192, 89, 153, 21);
		contentPane.add(txt_user);
		txt_user.setColumns(10);
		
		JLabel lbl_paw = new JLabel("\u5BC6\u7801\uFF1A");
		lbl_paw.setHorizontalAlignment(SwingConstants.LEFT);
		lbl_paw.setBounds(102, 153, 54, 15);
		contentPane.add(lbl_paw);
		
		JLabel label = new JLabel("\u7BA1\u7406\u5458\u767B\u9646");
		label.setFont(new Font("微软雅黑", Font.PLAIN, 19));
		label.setBounds(162, 35, 133, 23);
		contentPane.add(label);
		
		txt_paw = new JPasswordField();
		txt_paw.setBounds(192, 150, 153, 21);
		contentPane.add(txt_paw);
		
		JLabel label_1 = new JLabel("");
		label_1.setIcon(new ImageIcon(login.class.getResource("/Image/06.png")));
		label_1.setBounds(0, 0, 434, 262);
		contentPane.add(label_1);
	}
}

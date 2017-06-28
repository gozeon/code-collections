package GUI;

import java.awt.BorderLayout;
import java.awt.EventQueue;

import javax.swing.JFrame;
import javax.swing.JPanel;
import javax.swing.border.EmptyBorder;
import javax.swing.JLabel;
import javax.swing.JComboBox;
import javax.swing.JTextField;
import javax.swing.JButton;

import Action.CreateSql;
import Action.admin;
import DAO.Dao;

import java.awt.event.ActionListener;
import java.awt.event.ActionEvent;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.awt.Toolkit;

public class SelectRoom extends JFrame {

	private JPanel contentPane;
	private JTextField txt_style;
	private JTextField txt_price;
	private JTextField txt_state;

	/**
	 * Launch the application.
	 */
	public static void main(String[] args) {
		EventQueue.invokeLater(new Runnable() {
			public void run() {
				try {
					SelectRoom frame = new SelectRoom();
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
	public SelectRoom() {
		setIconImage(Toolkit.getDefaultToolkit().getImage(SelectRoom.class.getResource("/Image/00.PNG")));
		setTitle("\u67E5\u8BE2\u623F\u95F4\u4FE1\u606F");
		setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		setBounds(100, 100, 450, 373);
		contentPane = new JPanel();
		contentPane.setBorder(new EmptyBorder(5, 5, 5, 5));
		setContentPane(contentPane);
		contentPane.setLayout(null);
		
		JLabel label = new JLabel("\u623F\u95F4\u53F7\uFF1A");
		label.setBounds(46, 43, 54, 15);
		contentPane.add(label);
		
		JLabel label_1 = new JLabel("\u623F\u95F4\u7C7B\u578B\uFF1A");
		label_1.setBounds(46, 110, 76, 15);
		contentPane.add(label_1);
		
		JLabel label_2 = new JLabel("\u623F\u95F4\u4EF7\u683C\uFF1A");
		label_2.setBounds(46, 169, 76, 15);
		contentPane.add(label_2);
		
		JLabel label_3 = new JLabel("\u623F\u95F4\u72B6\u6001\uFF1A");
		label_3.setBounds(46, 229, 76, 15);
		contentPane.add(label_3);
		
		final JComboBox cob_id = new JComboBox();
		cob_id.setBounds(121, 40, 141, 21);
		Dao dao = new Dao();
		for(int i=0;i<dao.getList("ro_id", "tb_room").size();i++)
		{
			cob_id.addItem(dao.getList("ro_id", "tb_room").get(i));
		}
		contentPane.add(cob_id);
		
		txt_style = new JTextField();
		txt_style.setBounds(121, 107, 141, 21);
		contentPane.add(txt_style);
		txt_style.setColumns(10);
		
		txt_price = new JTextField();
		txt_price.setColumns(10);
		txt_price.setBounds(121, 166, 141, 21);
		contentPane.add(txt_price);
		
		txt_state = new JTextField();
		txt_state.setColumns(10);
		txt_state.setBounds(121, 226, 141, 21);
		contentPane.add(txt_state);
		
		JButton button = new JButton("\u67E5\u8BE2");
		button.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				//确定按钮
				ResultSet rs;
				
				String id = (String) cob_id.getSelectedItem();
				String style ="";
				String price ="";
				String state = "" ;
				
				admin admin = new admin();
				CreateSql sql = new CreateSql();
				
				rs=admin.selectRoom(sql.selectRoom(id));
				//获取结果
				try {
					while (rs.next()) {
						style = rs.getString(1);
			     		price = rs.getString(2);
						state = rs.getString(3);
//						System.out.print(style+price+state);
					}
				} catch (SQLException e1) {
					// TODO Auto-generated catch block
					e1.printStackTrace();
				}
				//将结果赋值到文本框
				txt_state.setText(state);
				txt_style.setText(style);
				txt_price.setText(price);
			}
		});
		button.setBounds(305, 39, 93, 23);
		contentPane.add(button);
		
		JButton button_1 = new JButton("\u8FD4\u56DE");
		button_1.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				//返回按钮
				dispose();  //关闭
			}
		});
		button_1.setBounds(305, 106, 93, 23);
		contentPane.add(button_1);
	}

}

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

public class SelectOrder extends JFrame {

	private JPanel contentPane;
	private JTextField txt_ro_id;
	private JTextField txt_intime;
	private JTextField txt_outtime;

	/**
	 * Launch the application.
	 */
	public static void main(String[] args) {
		EventQueue.invokeLater(new Runnable() {
			public void run() {
				try {
					SelectOrder frame = new SelectOrder();
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
	public SelectOrder() {
		setIconImage(Toolkit.getDefaultToolkit().getImage(SelectOrder.class.getResource("/Image/00.PNG")));
		setTitle("\u67E5\u8BE2\u8BA2\u5355\u4FE1\u606F");
		setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		setBounds(100, 100, 450, 310);
		contentPane = new JPanel();
		contentPane.setBorder(new EmptyBorder(5, 5, 5, 5));
		setContentPane(contentPane);
		contentPane.setLayout(null);
		
		JLabel label = new JLabel("\u8BA2\u5355\u53F7\uFF1A");
		label.setBounds(55, 37, 54, 15);
		contentPane.add(label);
		
		JLabel label_1 = new JLabel("\u5165\u4F4F\u65F6\u95F4\uFF1A");
		label_1.setBounds(43, 135, 66, 15);
		contentPane.add(label_1);
		
		JLabel label_2 = new JLabel("\u623F\u95F4\u53F7\uFF1A");
		label_2.setBounds(55, 89, 54, 15);
		contentPane.add(label_2);
		
		final JComboBox cob_or_id = new JComboBox();
		cob_or_id.setBounds(133, 34, 92, 21);
		Dao dao = new Dao();
		for(int i=0;i<dao.getList("or_id", "tb_order").size();i++)
		{
			//System.out.print(ddDao.getList("ro_id", "tb_room").get(i));
			cob_or_id.addItem(dao.getList("or_id", "tb_order").get(i));
		}
		contentPane.add(cob_or_id);
		
		txt_ro_id = new JTextField();
		txt_ro_id.setBounds(133, 86, 92, 21);
		contentPane.add(txt_ro_id);
		txt_ro_id.setColumns(10);
		
		txt_intime = new JTextField();
		txt_intime.setBounds(133, 132, 92, 21);
		contentPane.add(txt_intime);
		txt_intime.setColumns(10);
		
		JLabel label_3 = new JLabel("\u9000\u623F\u65F6\u95F4\uFF1A");
		label_3.setBounds(43, 181, 66, 15);
		contentPane.add(label_3);
		
		txt_outtime = new JTextField();
		txt_outtime.setBounds(133, 178, 92, 21);
		contentPane.add(txt_outtime);
		txt_outtime.setColumns(10);
		
		JButton button = new JButton("\u67E5\u8BE2");
		button.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				//查询按钮
				ResultSet rs;
				String id = (String) cob_or_id.getSelectedItem();
				String ro_id = "";
				String intime = "";
				String outtime= "";
				
				admin admin = new admin();
				CreateSql sql = new CreateSql();
				
				rs=admin.selectOrder(sql.selectOrder(id));
				try {
					while(rs.next()){
						ro_id = rs.getString(1);
						intime = rs.getString(2);
						outtime = rs.getString(3);
					}
				} catch (SQLException e1) {
					// TODO Auto-generated catch block
					e1.printStackTrace();
				}
				//System.out.print(ro_id+intime+outtime);
				txt_ro_id.setText(ro_id);
				txt_intime.setText(intime);
				txt_outtime.setText(outtime);
			}
		});
		button.setBounds(292, 33, 93, 23);
		contentPane.add(button);
		
		JButton button_1 = new JButton("\u8FD4\u56DE");
		button_1.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				//返回按钮
				dispose(); //关闭
			}
		});
		button_1.setBounds(292, 89, 93, 23);
		contentPane.add(button_1);
	}

}

package GUI;

import java.awt.BorderLayout;
import java.awt.EventQueue;

import javax.swing.JFrame;
import javax.swing.JPanel;
import javax.swing.border.EmptyBorder;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JTextField;
import javax.swing.JComboBox;
import javax.swing.JButton;

import Action.CreateSql;
import Action.admin;
import DAO.Dao;

import java.awt.event.ActionListener;
import java.awt.event.ActionEvent;
import java.awt.Toolkit;

public class AddOrder extends JFrame {

	private JPanel contentPane;

	/**
	 * Launch the application.
	 */
	public static void main(String[] args) {
		EventQueue.invokeLater(new Runnable() {
			public void run() {
				try {
					AddOrder frame = new AddOrder();
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
	public AddOrder() {
		setIconImage(Toolkit.getDefaultToolkit().getImage(AddOrder.class.getResource("/Image/00.PNG")));
		setTitle("\u6DFB\u52A0\u8BA2\u5355");
		setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		setBounds(100, 100, 450, 350);
		contentPane = new JPanel();
		contentPane.setBorder(new EmptyBorder(5, 5, 5, 5));
		setContentPane(contentPane);
		contentPane.setLayout(null);
		
		JLabel label = new JLabel("\u8BA2\u5355\u53F7\uFF1A");
		label.setBounds(77, 50, 54, 15);
		contentPane.add(label);
		
		JLabel label_1 = new JLabel("\u623F\u95F4\u53F7\uFF1A");
		label_1.setBounds(77, 107, 54, 15);
		contentPane.add(label_1);
		
		JLabel label_2 = new JLabel("\u5165\u4F4F\u65F6\u95F4\uFF1A");
		label_2.setBounds(77, 163, 70, 15);
		contentPane.add(label_2);
		
		JLabel label_3 = new JLabel("\u9000\u623F\u65F6\u95F4\uFF1A");
		label_3.setBounds(77, 214, 70, 15);
		contentPane.add(label_3);
		
		final JComboBox cob_in_year = new JComboBox();
		cob_in_year.setBounds(157, 160, 54, 21);
		cob_in_year.addItem("2016");
		cob_in_year.addItem("2017");
		cob_in_year.addItem("2018");
		cob_in_year.addItem("2019");
		cob_in_year.addItem("2020");
		contentPane.add(cob_in_year);
		
		JLabel label_4 = new JLabel("\u5E74");
		label_4.setBounds(221, 163, 18, 15);
		contentPane.add(label_4);
		
		final JComboBox cob_in_month = new JComboBox();
		cob_in_month.setBounds(249, 160, 45, 21);
		cob_in_month.addItem("12");
		cob_in_month.addItem("11");
		cob_in_month.addItem("10");
		cob_in_month.addItem("9");
		cob_in_month.addItem("8");
		cob_in_month.addItem("7");
		cob_in_month.addItem("6");
		cob_in_month.addItem("5");
		cob_in_month.addItem("4");
		cob_in_month.addItem("3");
		cob_in_month.addItem("2");
		cob_in_month.addItem("1");
		contentPane.add(cob_in_month);
		
		JLabel label_5 = new JLabel("\u6708");
		label_5.setBounds(304, 163, 18, 15);
		contentPane.add(label_5);
		
		final JComboBox cob_in_day = new JComboBox();
		cob_in_day.setBounds(327, 160, 45, 21);
		cob_in_day.addItem("31");
		cob_in_day.addItem("30");
		cob_in_day.addItem("29");
		cob_in_day.addItem("28");
		cob_in_day.addItem("27");
		cob_in_day.addItem("26");
		cob_in_day.addItem("25");
		cob_in_day.addItem("24");
		cob_in_day.addItem("23");
		cob_in_day.addItem("22");
		cob_in_day.addItem("21");
		cob_in_day.addItem("20");
		cob_in_day.addItem("19");
		cob_in_day.addItem("18");
		cob_in_day.addItem("17");
		cob_in_day.addItem("16");
		cob_in_day.addItem("15");
		cob_in_day.addItem("14");
		cob_in_day.addItem("13");
		cob_in_day.addItem("12");
		cob_in_day.addItem("11");
		cob_in_day.addItem("10");
		cob_in_day.addItem("9");
		cob_in_day.addItem("8");
		cob_in_day.addItem("7");
		cob_in_day.addItem("6");
		cob_in_day.addItem("5");
		cob_in_day.addItem("4");
		cob_in_day.addItem("3");
		cob_in_day.addItem("2");
		cob_in_day.addItem("1");
		contentPane.add(cob_in_day);
		
		JLabel lblNewLabel = new JLabel("\u65E5");
		lblNewLabel.setBounds(382, 163, 18, 15);
		contentPane.add(lblNewLabel);
		
		final JComboBox cob_out_year = new JComboBox();
		cob_out_year.setBounds(157, 211, 54, 21);
		cob_out_year.addItem("2016");
		cob_out_year.addItem("2017");
		cob_out_year.addItem("2018");
		cob_out_year.addItem("2019");
		cob_out_year.addItem("2020");
		contentPane.add(cob_out_year);
		
		JLabel label_6 = new JLabel("\u5E74");
		label_6.setBounds(221, 214, 18, 15);
		contentPane.add(label_6);
		
		final JComboBox cob_out_month = new JComboBox();
		cob_out_month.setBounds(249, 211, 45, 21);
		cob_out_month.addItem("12");
		cob_out_month.addItem("11");
		cob_out_month.addItem("10");
		cob_out_month.addItem("9");
		cob_out_month.addItem("8");
		cob_out_month.addItem("7");
		cob_out_month.addItem("6");
		cob_out_month.addItem("5");
		cob_out_month.addItem("4");
		cob_out_month.addItem("3");
		cob_out_month.addItem("2");
		cob_out_month.addItem("1");
		contentPane.add(cob_out_month);
		
		JLabel label_7 = new JLabel("\u6708");
		label_7.setBounds(304, 214, 18, 15);
		contentPane.add(label_7);
		
		final JComboBox cob_out_day = new JComboBox();
		cob_out_day.setBounds(327, 211, 45, 21);
		cob_out_day.addItem("31");
		cob_out_day.addItem("30");
		cob_out_day.addItem("29");
		cob_out_day.addItem("28");
		cob_out_day.addItem("27");
		cob_out_day.addItem("26");
		cob_out_day.addItem("25");
		cob_out_day.addItem("24");
		cob_out_day.addItem("23");
		cob_out_day.addItem("22");
		cob_out_day.addItem("21");
		cob_out_day.addItem("20");
		cob_out_day.addItem("19");
		cob_out_day.addItem("18");
		cob_out_day.addItem("17");
		cob_out_day.addItem("16");
		cob_out_day.addItem("15");
		cob_out_day.addItem("14");
		cob_out_day.addItem("13");
		cob_out_day.addItem("12");
		cob_out_day.addItem("11");
		cob_out_day.addItem("10");
		cob_out_day.addItem("9");
		cob_out_day.addItem("8");
		cob_out_day.addItem("7");
		cob_out_day.addItem("6");
		cob_out_day.addItem("5");
		cob_out_day.addItem("4");
		cob_out_day.addItem("3");
		cob_out_day.addItem("2");
		cob_out_day.addItem("1");
		contentPane.add(cob_out_day);
		
		JLabel label_8 = new JLabel("\u65E5");
		label_8.setBounds(382, 214, 18, 15);
		contentPane.add(label_8);
		
		JButton btnNewButton = new JButton("\u6DFB\u52A0");

		btnNewButton.setBounds(101, 266, 93, 23);
		contentPane.add(btnNewButton);
		
		JButton button = new JButton("\u53D6\u6D88");
		button.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				//取消按钮
				dispose();  //关闭
			}
		});
		button.setBounds(238, 266, 93, 23);
		contentPane.add(button);
		
		final JComboBox cob_ro_id = new JComboBox();
		cob_ro_id.setBounds(141, 104, 78, 21);
		Dao dao = new Dao();
		//获取空房的房间号
		for(int i=0;i<dao.getList("ro_id", "tb_room where ro_state='空房'").size();i++)
		{
			cob_ro_id.addItem(dao.getList("ro_id", "tb_room where ro_state='空房'").get(i));
		}
		contentPane.add(cob_ro_id);
		
		JLabel label_9 = new JLabel("\u7528\u6237\u540D\uFF1A");
		label_9.setBounds(210, 50, 54, 15);
		contentPane.add(label_9);
		
		final JComboBox cob_cl_name = new JComboBox();
		cob_cl_name.setBounds(274, 47, 135, 21);
		for(int i=0;i<dao.getList("cl_name", "tb_client").size();i++)
		{
			cob_cl_name.addItem(dao.getList("cl_name", "tb_client").get(i));
		}
		contentPane.add(cob_cl_name);
		
		JLabel lab_or_id = new JLabel("New label");
		lab_or_id.setBounds(141, 50, 78, 15);
		contentPane.add(lab_or_id);
		//订单自动编号
		final String or_id = dao.ylfgetNewID(dao.getList("or_id", "tb_order"));
		lab_or_id.setText(or_id);
		
		btnNewButton.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				//添加按钮
//				Dao dao = new Dao();
//				dao.mjmgetNewID("tb_order");
				String name = (String) cob_cl_name.getSelectedItem();
				String ro_id = (String) cob_ro_id.getSelectedItem();
				String intime = cob_in_year.getSelectedItem().toString()+"/"+cob_in_month.getSelectedItem().toString()+"/"+cob_in_day.getSelectedItem().toString();
				String outtime =cob_out_year.getSelectedItem().toString()+"/"+cob_out_month.getSelectedItem().toString()+"/"+cob_out_day.getSelectedItem().toString();
				
/*				System.out.println(or_id);
				System.out.println(ro_id);
				System.out.println(intime);
				System.out.println(outtime);
				System.out.println(name);*/
				
				//添加订单
				admin admin = new admin();
				CreateSql sql = new CreateSql();
				admin.addOrder(sql.addOrder(or_id, ro_id, intime, outtime));
				
				Dao daoo = new Dao();
				daoo.OpenConnection();
				//将订单号添加到用户
				String sql1 = "update tb_client set or_id='"+or_id+"' where cl_name='"+name+"'";
				daoo.ExecuteUpdate(sql1);
				//将房间设置为已住
				String sql2 = "update tb_room set ro_state='已住' where ro_id='"+ro_id+"'";
				daoo.ExecuteUpdate(sql2);
				
				JOptionPane.showMessageDialog(null, "添加成功", "正确信息", JOptionPane.INFORMATION_MESSAGE);
			}
		});
	}
}

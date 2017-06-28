package GUI;

import java.awt.BorderLayout;
import java.awt.EventQueue;

import javax.swing.JFrame;
import javax.swing.JPanel;
import javax.swing.border.EmptyBorder;
import javax.swing.JLabel;
import javax.swing.JComboBox;
import javax.swing.JButton;
import javax.swing.JOptionPane;

import Action.CreateSql;
import Action.admin;
import DAO.Dao;

import java.awt.event.ActionListener;
import java.awt.event.ActionEvent;
import java.awt.Toolkit;

public class UpdateOrder extends JFrame {

	private JPanel contentPane;

	/**
	 * Launch the application.
	 */
	public static void main(String[] args) {
		EventQueue.invokeLater(new Runnable() {
			public void run() {
				try {
					UpdateOrder frame = new UpdateOrder();
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
	public UpdateOrder() {
		setIconImage(Toolkit.getDefaultToolkit().getImage(UpdateOrder.class.getResource("/Image/00.PNG")));
		setTitle("\u4FEE\u6539\u8BA2\u5355");
		setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		setBounds(100, 100, 450, 363);
		contentPane = new JPanel();
		contentPane.setBorder(new EmptyBorder(5, 5, 5, 5));
		setContentPane(contentPane);
		contentPane.setLayout(null);
		
		JLabel label = new JLabel("\u8BA2\u5355\u53F7\uFF1A");
		label.setBounds(77, 40, 54, 15);
		contentPane.add(label);
		
		final JComboBox cob_or_id = new JComboBox();
		cob_or_id.setBounds(141, 37, 107, 21);
		Dao dao = new Dao();
		for(int i=0;i<dao.getList("or_id", "tb_order").size();i++)
		{
			cob_or_id.addItem(dao.getList("or_id", "tb_order").get(i));
		}
		contentPane.add(cob_or_id);
		
		JLabel label_1 = new JLabel("\u623F\u95F4\u53F7\uFF1A");
		label_1.setBounds(77, 102, 54, 15);
		contentPane.add(label_1);
		
		final JComboBox cob_ro_id = new JComboBox();
		cob_ro_id.setBounds(141, 99, 107, 21);
		for(int i=0;i<dao.getList("ro_id", "tb_room").size();i++)
		{
			cob_ro_id.addItem(dao.getList("ro_id", "tb_room").get(i));
		}
		contentPane.add(cob_ro_id);
		
		JLabel label_2 = new JLabel("\u5165\u4F4F\u65F6\u95F4\uFF1A");
		label_2.setBounds(61, 166, 70, 15);
		contentPane.add(label_2);
		
		JLabel label_3 = new JLabel("\u9000\u623F\u65F6\u95F4\uFF1A");
		label_3.setBounds(61, 226, 70, 15);
		contentPane.add(label_3);
		
		final JComboBox cob_in_year = new JComboBox();
		cob_in_year.setBounds(141, 163, 54, 21);
		for(int i=2016;i<2022;i++){
			cob_in_year.addItem(i);
		}
		contentPane.add(cob_in_year);
		
		final JComboBox cob_out_year = new JComboBox();
		cob_out_year.setBounds(141, 223, 54, 21);
		for(int i=2016;i<2022;i++){
			cob_out_year.addItem(i);
		}
		contentPane.add(cob_out_year);
		
		JLabel label_4 = new JLabel("\u5E74");
		label_4.setBounds(205, 166, 23, 15);
		contentPane.add(label_4);
		
		final JComboBox cob_in_month = new JComboBox();
		cob_in_month.setBounds(238, 163, 47, 21);
		for(int i =1;i<13;i++){
			cob_in_month.addItem(i);
		}
		contentPane.add(cob_in_month);
		
		JLabel label_5 = new JLabel("\u6708");
		label_5.setBounds(298, 166, 23, 15);
		contentPane.add(label_5);
		
		final JComboBox cob_in_day = new JComboBox();
		cob_in_day.setBounds(331, 163, 47, 21);
		for(int i=1;i<32;i++){
			cob_in_day.addItem(i);
		}
		contentPane.add(cob_in_day);
		
		JLabel label_6 = new JLabel("\u65E5");
		label_6.setBounds(388, 166, 23, 15);
		contentPane.add(label_6);
		
		JLabel label_7 = new JLabel("\u5E74");
		label_7.setBounds(205, 226, 23, 15);
		contentPane.add(label_7);
		
		final JComboBox cob_out_month = new JComboBox();
		cob_out_month.setBounds(238, 223, 47, 21);
		for(int i =1;i<13;i++){
			cob_out_month.addItem(i);
		}
		contentPane.add(cob_out_month);
		
		JLabel label_8 = new JLabel("\u6708");
		label_8.setBounds(298, 226, 23, 15);
		contentPane.add(label_8);
		
		final JComboBox cob_out_day = new JComboBox();
		cob_out_day.setBounds(331, 223, 47, 21);
		for(int i=1;i<32;i++){
			cob_out_day.addItem(i);
		}
		contentPane.add(cob_out_day);
		
		JLabel label_9 = new JLabel("\u65E5");
		label_9.setBounds(388, 226, 23, 15);
		contentPane.add(label_9);
		
		JButton button = new JButton("\u786E\u5B9A");
		button.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				//修改按钮
				String or_id = (String) cob_or_id.getSelectedItem();
				String ro_id = (String) cob_ro_id.getSelectedItem();
				

//				System.out.println(ro_id);
				//String year = (String) cob_in_year.getSelectedItem();
/*				String year=cob_in_year.getSelectedItem().toString();
				String month = cob_in_month.getSelectedItem().toString();
				String day = cob_in_day.getSelectedItem().toString();
				String intime = year+"/"+month+"/"+day;*/
				String intime = cob_in_year.getSelectedItem().toString()+"/"+cob_in_month.getSelectedItem().toString()+"/"+cob_in_day.getSelectedItem().toString();
				String outtime =cob_out_year.getSelectedItem().toString()+"/"+cob_out_month.getSelectedItem().toString()+"/"+cob_out_day.getSelectedItem().toString();
//				System.out.println(intime);
//				System.out.println(outtime);
				
				admin admin = new admin();
				CreateSql sql = new CreateSql();
				
				admin.updateOrder(sql.updateOrder(or_id, ro_id, intime, outtime));
				JOptionPane.showMessageDialog(null, "修改成功", "正确信息", JOptionPane.INFORMATION_MESSAGE);
			}
		});
		button.setBounds(102, 279, 93, 23);
		contentPane.add(button);
		
		JButton button_1 = new JButton("\u53D6\u6D88");
		button_1.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				//取消按钮
				dispose();
			}
		});
		button_1.setBounds(243, 279, 93, 23);
		contentPane.add(button_1);
	}

}
